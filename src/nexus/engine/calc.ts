import { evaluateExpression, formatNumber, type AngleMode, type EvalResult } from "./evaluate.ts";

export type HistoryDraft = {
  expression: string;
  result: string;
  value: number;
};

export type CalcSnapshot = {
  expression: string;
  memory: number;
  ans: number;
  angle: AngleMode;
  precision: number;
  justEvaluated: boolean;
  error: string | null;
  resultText: string;
};

export type CalcAction =
  | { type: "insert"; text: string }
  | { type: "ac" }
  | { type: "ce" }
  | { type: "backspace" }
  | { type: "equals" }
  | { type: "memory"; op: "clear" | "recall" | "add" | "sub" | "store" }
  | { type: "negate" }
  | { type: "percent" }
  | { type: "ee" }
  | { type: "angle"; angle: AngleMode }
  | { type: "precision"; precision: number }
  | { type: "load"; expression: string };

const STARTS_FRESH = /^(?:[0-9.(]|pi$|e$|Ans$|M$|[A-Za-z]\w*\()/;
const CONTINUES_WITH_ANS = /^[+\-*/^%]/;

export function initialCalc(partial?: Partial<CalcSnapshot>): CalcSnapshot {
  return {
    expression: "",
    memory: 0,
    ans: 0,
    angle: "deg",
    precision: 10,
    justEvaluated: false,
    error: null,
    resultText: "0",
    ...partial,
  };
}

export function clearEntry(expression: string): string {
  return expression.replace(/((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[A-Za-z]\w*\(|π|√|.)$/u, "");
}

function currentValue(state: CalcSnapshot): EvalResult {
  if (!state.expression.trim()) {
    return { ok: true, value: state.ans, formatted: formatNumber(state.ans, state.precision) };
  }
  return evaluateExpression(state.expression, {
    angle: state.angle,
    ans: state.ans,
    memory: state.memory,
    precision: state.precision,
  });
}

export function reduceCalc(
  state: CalcSnapshot,
  action: CalcAction,
): { state: CalcSnapshot; committed?: HistoryDraft } {
  switch (action.type) {
    case "angle": {
      const next = { ...state, angle: action.angle, justEvaluated: false };
      return { state: preview(next) };
    }
    case "precision": {
      const next = { ...state, precision: action.precision };
      return { state: preview(next) };
    }
    case "load":
      return { state: preview({ ...state, expression: action.expression, justEvaluated: false, error: null }) };
    case "ac":
      return {
        state: {
          ...state,
          expression: "",
          justEvaluated: false,
          error: null,
          resultText: "0",
        },
      };
    case "ce":
      return { state: preview({ ...state, expression: clearEntry(state.expression), justEvaluated: false }) };
    case "backspace": {
      const expression = state.justEvaluated ? "" : state.expression.slice(0, -1);
      return { state: preview({ ...state, expression, justEvaluated: false }) };
    }
    case "insert": {
      const text = action.text;
      let expression: string;
      if (state.justEvaluated && STARTS_FRESH.test(text)) expression = text;
      else if (state.justEvaluated && CONTINUES_WITH_ANS.test(text)) {
        expression = formatNumber(state.ans, Math.min(12, state.precision)) + text;
      } else expression = state.expression + text;
      return { state: preview({ ...state, expression, justEvaluated: false }) };
    }
    case "percent":
      return {
        state: preview({
          ...state,
          expression: `${state.justEvaluated ? formatNumber(state.ans, Math.min(12, state.precision)) : state.expression}%`,
          justEvaluated: false,
        }),
      };
    case "ee": {
      // Always scientific notation as ×10^(, never Euler's e.
      const base = state.justEvaluated
        ? formatNumber(state.ans, Math.min(12, state.precision))
        : state.expression;
      const expression = /(?:\d|\))$/.test(base) ? `${base}*10^(` : base ? `${base}*10^(` : "10^(";
      return { state: preview({ ...state, expression, justEvaluated: false }) };
    }
    case "negate": {
      const expression = state.expression.startsWith("-(") && state.expression.endsWith(")")
        ? state.expression.slice(2, -1)
        : state.expression
          ? `-(${state.expression})`
          : "-";
      return { state: preview({ ...state, expression, justEvaluated: false }) };
    }
    case "memory":
      return reduceMemory(state, action.op);
    case "equals":
      return commit(state);
    default:
      return { state };
  }
}

function reduceMemory(
  state: CalcSnapshot,
  op: "clear" | "recall" | "add" | "sub" | "store",
): { state: CalcSnapshot; committed?: HistoryDraft } {
  if (op === "clear") return { state: { ...state, memory: 0 } };
  if (op === "recall") {
    const text = formatNumber(state.memory, Math.min(12, state.precision));
    return reduceCalc({ ...state, justEvaluated: false }, { type: "insert", text });
  }
  const value = currentValue(state);
  if (!value.ok) return { state: { ...state, error: value.error, resultText: value.error } };
  if (op === "store") return { state: { ...preview(state), memory: value.value, error: null } };
  if (op === "add") return { state: { ...preview(state), memory: state.memory + value.value, error: null } };
  return { state: { ...preview(state), memory: state.memory - value.value, error: null } };
}

function preview(state: CalcSnapshot): CalcSnapshot {
  if (!state.expression.trim()) {
    return { ...state, error: null, resultText: "0" };
  }
  const value = evaluateExpression(state.expression, {
    angle: state.angle,
    ans: state.ans,
    memory: state.memory,
    precision: state.precision,
  });
  if (!value.ok) return { ...state, error: null, resultText: "…" };
  return { ...state, error: null, resultText: value.formatted };
}

function commit(state: CalcSnapshot): { state: CalcSnapshot; committed?: HistoryDraft } {
  if (!state.expression.trim()) return { state };
  const value = evaluateExpression(state.expression, {
    angle: state.angle,
    ans: state.ans,
    memory: state.memory,
    precision: state.precision,
  });
  if (!value.ok) {
    return { state: { ...state, error: value.error, resultText: value.error, justEvaluated: false } };
  }
  return {
    state: {
      ...state,
      ans: value.value,
      error: null,
      resultText: value.formatted,
      justEvaluated: true,
    },
    committed: { expression: state.expression, result: value.formatted, value: value.value },
  };
}

export const KEYS: {
  id: string;
  label: string;
  aria: string;
  variant: "digit" | "op" | "fn" | "mem" | "eq";
  action: CalcAction;
  second?: { label: string; aria: string; action: CalcAction };
}[] = [
  { id: "mc", label: "MC", aria: "Memory clear", variant: "mem", action: { type: "memory", op: "clear" } },
  { id: "mr", label: "MR", aria: "Memory recall", variant: "mem", action: { type: "memory", op: "recall" } },
  { id: "mp", label: "M+", aria: "Memory add", variant: "mem", action: { type: "memory", op: "add" } },
  { id: "mm", label: "M−", aria: "Memory subtract", variant: "mem", action: { type: "memory", op: "sub" } },
  { id: "ms", label: "MS", aria: "Memory store", variant: "mem", action: { type: "memory", op: "store" } },
  { id: "ans", label: "Ans", aria: "Previous answer", variant: "mem", action: { type: "insert", text: "Ans" } },
  {
    id: "sin",
    label: "sin",
    aria: "Sine",
    variant: "fn",
    action: { type: "insert", text: "sin(" },
    second: { label: "asin", aria: "Inverse sine", action: { type: "insert", text: "asin(" } },
  },
  {
    id: "cos",
    label: "cos",
    aria: "Cosine",
    variant: "fn",
    action: { type: "insert", text: "cos(" },
    second: { label: "acos", aria: "Inverse cosine", action: { type: "insert", text: "acos(" } },
  },
  {
    id: "tan",
    label: "tan",
    aria: "Tangent",
    variant: "fn",
    action: { type: "insert", text: "tan(" },
    second: { label: "atan", aria: "Inverse tangent", action: { type: "insert", text: "atan(" } },
  },
  {
    id: "ln",
    label: "ln",
    aria: "Natural log",
    variant: "fn",
    action: { type: "insert", text: "log(" },
    second: { label: "sinh", aria: "Hyperbolic sine", action: { type: "insert", text: "sinh(" } },
  },
  {
    id: "log",
    label: "log",
    aria: "Log base 10",
    variant: "fn",
    action: { type: "insert", text: "log10(" },
    second: { label: "cosh", aria: "Hyperbolic cosine", action: { type: "insert", text: "cosh(" } },
  },
  {
    id: "sqrt",
    label: "√",
    aria: "Square root",
    variant: "fn",
    action: { type: "insert", text: "sqrt(" },
    second: { label: "tanh", aria: "Hyperbolic tangent", action: { type: "insert", text: "tanh(" } },
  },
  { id: "pi", label: "π", aria: "Pi", variant: "fn", action: { type: "insert", text: "pi" }, second: { label: "asinh", aria: "Inverse hyperbolic sine", action: { type: "insert", text: "asinh(" } } },
  { id: "e", label: "e", aria: "Euler's constant", variant: "fn", action: { type: "insert", text: "e" }, second: { label: "acosh", aria: "Inverse hyperbolic cosine", action: { type: "insert", text: "acosh(" } } },
  { id: "pow", label: "xʸ", aria: "Power", variant: "op", action: { type: "insert", text: "^" }, second: { label: "atanh", aria: "Inverse hyperbolic tangent", action: { type: "insert", text: "atanh(" } } },
  { id: "sq", label: "x²", aria: "Square", variant: "op", action: { type: "insert", text: "^2" }, second: { label: "nCr", aria: "Combinations", action: { type: "insert", text: "combinations(" } } },
  { id: "fact", label: "n!", aria: "Factorial", variant: "op", action: { type: "insert", text: "!" }, second: { label: "nPr", aria: "Permutations", action: { type: "insert", text: "permutations(" } } },
  { id: "lp", label: "(", aria: "Left parenthesis", variant: "op", action: { type: "insert", text: "(" } },
  { id: "7", label: "7", aria: "7", variant: "digit", action: { type: "insert", text: "7" } },
  { id: "8", label: "8", aria: "8", variant: "digit", action: { type: "insert", text: "8" } },
  { id: "9", label: "9", aria: "9", variant: "digit", action: { type: "insert", text: "9" } },
  { id: "div", label: "÷", aria: "Divide", variant: "op", action: { type: "insert", text: "/" } },
  { id: "pct", label: "%", aria: "Percent", variant: "op", action: { type: "percent" } },
  { id: "bs", label: "⌫", aria: "Backspace", variant: "op", action: { type: "backspace" } },
  { id: "4", label: "4", aria: "4", variant: "digit", action: { type: "insert", text: "4" } },
  { id: "5", label: "5", aria: "5", variant: "digit", action: { type: "insert", text: "5" } },
  { id: "6", label: "6", aria: "6", variant: "digit", action: { type: "insert", text: "6" } },
  { id: "mul", label: "×", aria: "Multiply", variant: "op", action: { type: "insert", text: "*" } },
  { id: "rp", label: ")", aria: "Right parenthesis", variant: "op", action: { type: "insert", text: ")" } },
  { id: "ce", label: "CE", aria: "Clear entry", variant: "op", action: { type: "ce" } },
  { id: "1", label: "1", aria: "1", variant: "digit", action: { type: "insert", text: "1" } },
  { id: "2", label: "2", aria: "2", variant: "digit", action: { type: "insert", text: "2" } },
  { id: "3", label: "3", aria: "3", variant: "digit", action: { type: "insert", text: "3" } },
  { id: "sub", label: "−", aria: "Subtract", variant: "op", action: { type: "insert", text: "-" } },
  { id: "neg", label: "±", aria: "Toggle sign", variant: "op", action: { type: "negate" } },
  { id: "ee", label: "EE", aria: "Scientific notation times 10 to the power", variant: "op", action: { type: "ee" } },
  { id: "0", label: "0", aria: "0", variant: "digit", action: { type: "insert", text: "0" } },
  { id: "dot", label: ".", aria: "Decimal point", variant: "digit", action: { type: "insert", text: "." } },
  { id: "inv", label: "1/x", aria: "Reciprocal", variant: "op", action: { type: "insert", text: "1/(" } },
  { id: "add", label: "+", aria: "Add", variant: "op", action: { type: "insert", text: "+" } },
  { id: "ac", label: "AC", aria: "All clear", variant: "op", action: { type: "ac" } },
  { id: "eq", label: "=", aria: "Evaluate", variant: "eq", action: { type: "equals" } },
];
