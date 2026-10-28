import { all, create, type MathNode } from "mathjs";

const math = create(all, {});

math.import(
  {
    factorial(n: unknown) {
      const x = asReal(n, "Factorial");
      if (x < 0) throw new Error("Factorial is undefined for negative numbers");
      if (Math.abs(x - Math.round(x)) > 1e-10) {
        throw new Error("Factorial requires a non-negative integer");
      }
      if (x > 170) throw new Error("Factorial overflow");
      return math.gamma(x + 1);
    },
  },
  { override: true },
);

export const ALLOWED_FUNCTIONS = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "log",
  "log10",
  "log2",
  "exp",
  "sqrt",
  "cbrt",
  "nthRoot",
  "abs",
  "factorial",
  "combinations",
  "permutations",
  "gcd",
  "lcm",
  "round",
  "floor",
  "ceil",
  "pow",
  "min",
  "max",
  "sign",
  "mod",
] as const;

const FN = new Set<string>(ALLOWED_FUNCTIONS);
const SYMBOLS = new Set(["pi", "e", "tau", "Ans", "M"]);
const OPS = new Set(["+", "-", "*", "/", "^", "!", "%", "mod"]);
const TYPES = new Set([
  "ConstantNode",
  "OperatorNode",
  "ParenthesisNode",
  "FunctionNode",
  "SymbolNode",
]);

const MAX_LENGTH = 400;
const MAX_NODES = 280;

export type AngleMode = "deg" | "rad";

export type EvalContext = {
  angle: AngleMode;
  ans?: number;
  memory?: number;
  symbols?: Record<string, number>;
  precision?: number;
};

export type EvalResult =
  | { ok: true; value: number; formatted: string }
  | { ok: false; error: string };

type NodeLike = {
  type: string;
  op?: string;
  fn?: { name?: string };
  name?: string;
  args?: NodeLike[];
  value?: number | string;
  isPercentage?: boolean;
  traverse: (cb: (n: NodeLike) => void) => void;
};

function asReal(n: unknown, label: string): number {
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new Error(`${label} expected a real number`);
  }
  if (!Number.isFinite(n)) throw new Error(`${label} is not finite`);
  return n;
}

function toRad(angle: AngleMode, x: number): number {
  return angle === "deg" ? (x * Math.PI) / 180 : x;
}

function fromRad(angle: AngleMode, x: number): number {
  return angle === "deg" ? (x * 180) / Math.PI : x;
}

function tanReal(angle: AngleMode, x: number): number {
  if (angle === "deg") {
    const m = ((x % 180) + 180) % 180;
    if (Math.abs(m - 90) < 1e-8) throw new Error("Tangent is undefined");
  } else {
    const turns = x / Math.PI - 0.5;
    if (Math.abs(turns - Math.round(turns)) < 1e-8) throw new Error("Tangent is undefined");
  }
  return Math.tan(toRad(angle, x));
}

function scopeFor(ctx: EvalContext): Record<string, unknown> {
  const angle = ctx.angle;
  const symbols = ctx.symbols ?? {};
  const real = (label: string, fn: (x: number) => number) => (x: unknown) => fn(asReal(x, label));
  return {
    Ans: ctx.ans ?? 0,
    M: ctx.memory ?? 0,
    ...symbols,
    sin: real("sin", (x) => Math.sin(toRad(angle, x))),
    cos: real("cos", (x) => Math.cos(toRad(angle, x))),
    tan: real("tan", (x) => tanReal(angle, x)),
    asin: real("asin", (x) => {
      if (x < -1 || x > 1) throw new Error("asin domain error");
      return fromRad(angle, Math.asin(x));
    }),
    acos: real("acos", (x) => {
      if (x < -1 || x > 1) throw new Error("acos domain error");
      return fromRad(angle, Math.acos(x));
    }),
    atan: real("atan", (x) => fromRad(angle, Math.atan(x))),
    sinh: real("sinh", Math.sinh),
    cosh: real("cosh", Math.cosh),
    tanh: real("tanh", Math.tanh),
    asinh: real("asinh", Math.asinh),
    acosh: real("acosh", (x) => {
      if (x < 1) throw new Error("acosh domain error");
      return Math.acosh(x);
    }),
    atanh: real("atanh", (x) => {
      if (x <= -1 || x >= 1) throw new Error("atanh domain error");
      return Math.atanh(x);
    }),
    log: real("ln", (x) => {
      if (x <= 0) throw new Error("Logarithm domain error");
      return Math.log(x);
    }),
    log10: real("log", (x) => {
      if (x <= 0) throw new Error("Logarithm domain error");
      return Math.log10(x);
    }),
    log2: real("log2", (x) => {
      if (x <= 0) throw new Error("Logarithm domain error");
      return Math.log2(x);
    }),
    exp: real("exp", Math.exp),
    sqrt: real("sqrt", (x) => {
      if (x < 0) throw new Error("Square root of a negative number is not real");
      return Math.sqrt(x);
    }),
    cbrt: real("cbrt", Math.cbrt),
    nthRoot: (x: unknown, root: unknown) => {
      const v = asReal(x, "nthRoot");
      const r = asReal(root, "nthRoot");
      if (!Number.isInteger(r) || r === 0) throw new Error("nthRoot requires a non-zero integer root");
      if (v < 0 && Math.abs(r) % 2 === 0) throw new Error("Even root of a negative number is not real");
      return Math.sign(v) * Math.abs(v) ** (1 / r);
    },
    abs: real("abs", Math.abs),
    combinations: (n: unknown, k: unknown) => {
      const nn = asReal(n, "nCr");
      const kk = asReal(k, "nCr");
      if (!Number.isInteger(nn) || !Number.isInteger(kk)) throw new Error("nCr requires integers");
      if (nn < 0 || kk < 0 || kk > nn) throw new Error("nCr domain error");
      if (nn > 1000) throw new Error("nCr argument is too large");
      return math.combinations(nn, kk);
    },
    permutations: (n: unknown, k: unknown) => {
      const nn = asReal(n, "nPr");
      const kk = asReal(k, "nPr");
      if (!Number.isInteger(nn) || !Number.isInteger(kk)) throw new Error("nPr requires integers");
      if (nn < 0 || kk < 0 || kk > nn) throw new Error("nPr domain error");
      if (nn > 1000) throw new Error("nPr argument is too large");
      return math.permutations(nn, kk);
    },
    gcd: (a: unknown, b: unknown) => math.gcd(asReal(a, "gcd"), asReal(b, "gcd")),
    lcm: (a: unknown, b: unknown) => math.lcm(asReal(a, "lcm"), asReal(b, "lcm")),
    round: real("round", (x) => Math.round(x)),
    floor: real("floor", (x) => Math.floor(x)),
    ceil: real("ceil", (x) => Math.ceil(x)),
    pow: (a: unknown, b: unknown) => {
      const v = Math.pow(asReal(a, "pow"), asReal(b, "pow"));
      if (typeof v !== "number" || Number.isNaN(v)) throw new Error("Power is not real");
      if (!Number.isFinite(v)) throw new Error("Power overflow");
      return v;
    },
    min: (a: unknown, b: unknown) => Math.min(asReal(a, "min"), asReal(b, "min")),
    max: (a: unknown, b: unknown) => Math.max(asReal(a, "max"), asReal(b, "max")),
    sign: real("sign", Math.sign),
    mod: (a: unknown, b: unknown) => {
      const d = asReal(b, "mod");
      if (d === 0) throw new Error("Modulo by zero");
      return asReal(a, "mod") % d;
    },
  };
}

/** Normalize keypad unicode without turning Euler's constant into an exponent. */
export function normalizeExpression(input: string): string {
  return input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/\s+/g, "");
}

function assertSafe(node: NodeLike, extra: string[]) {
  let count = 0;
  const extraSet = new Set(extra);
  node.traverse((n) => {
    count += 1;
    if (count > MAX_NODES) throw new Error("Expression is too complex");
    if (!TYPES.has(n.type)) throw new Error("Unsupported syntax");
    if (n.type === "FunctionNode") {
      const name = n.fn?.name ?? "";
      if (!FN.has(name)) throw new Error(`Unsupported function: ${name || "unknown"}`);
      const arg0 = n.args?.[0];
      if ((name === "factorial" || name === "gamma") && arg0?.type === "ConstantNode") {
        const v = Number(arg0.value);
        if (v > 170) throw new Error("Factorial overflow");
      }
    }
    if (n.type === "SymbolNode") {
      const name = n.name ?? "";
      if (!SYMBOLS.has(name) && !FN.has(name) && !extraSet.has(name)) {
        throw new Error(`Unknown symbol: ${name}`);
      }
    }
    if (n.type === "OperatorNode") {
      const op = n.op ?? "";
      if (!OPS.has(op)) throw new Error(`Unsupported operator: ${op}`);
      if (op === "^" && n.args?.[1]?.type === "ConstantNode") {
        const exp = Math.abs(Number(n.args[1].value));
        if (exp > 10000) throw new Error("Exponent is too large");
      }
      if (op === "!" && n.args?.[0]?.type === "ConstantNode") {
        const v = Number(n.args[0].value);
        if (v > 170) throw new Error("Factorial overflow");
      }
    }
  });
}

export function formatNumber(value: number, precision = 10): string {
  if (!Number.isFinite(value)) return "undefined";
  if (Object.is(value, -0)) return "0";
  const sig = Math.min(14, Math.max(1, Math.round(precision)));
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e12 || abs < 1e-6) {
    const exp = value.toExponential(Math.max(0, sig - 1));
    return exp.replace(/\.?0+e/, "e").replace("e+", "e+");
  }
  let text = value.toPrecision(sig);
  if (/e/i.test(text)) {
    return text.replace("e", "e").replace("e+", "e+");
  }
  if (text.includes(".")) text = text.replace(/0+$/, "").replace(/\.$/, "");
  return text;
}

export function evaluateExpression(raw: string, ctx: EvalContext): EvalResult {
  try {
    const input = normalizeExpression(raw ?? "");
    if (!input) return { ok: false, error: "Empty expression" };
    if (input.length > MAX_LENGTH) return { ok: false, error: "Expression is too long" };
    const extra = Object.keys(ctx.symbols ?? {});
    for (const name of extra) {
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name) || FN.has(name) || SYMBOLS.has(name)) {
        return { ok: false, error: `Invalid symbol: ${name}` };
      }
    }
    const node = math.parse(input) as MathNode;
    assertSafe(node as unknown as NodeLike, extra);
    const value = node.compile().evaluate(scopeFor(ctx)) as unknown;
    if (typeof value === "number") {
      if (Number.isNaN(value)) return { ok: false, error: "Undefined result" };
      if (!Number.isFinite(value)) return { ok: false, error: "Division by zero or overflow" };
      return { ok: true, value, formatted: formatNumber(value, ctx.precision ?? 10) };
    }
    if (value && typeof value === "object" && "im" in (value as object)) {
      return { ok: false, error: "Result is not real" };
    }
    return { ok: false, error: "Not a numeric result" };
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n")[0] : "Invalid expression";
    return { ok: false, error: message.replace(/^Error:\s*/, "").slice(0, 180) };
  }
}

export function compileReal(
  raw: string,
  symbols: string[],
  angle: AngleMode,
): (vars: Record<string, number>) => number {
  const input = normalizeExpression(raw);
  if (!input) throw new Error("Empty expression");
  if (input.length > MAX_LENGTH) throw new Error("Expression is too long");
  const node = math.parse(input) as MathNode;
  assertSafe(node as unknown as NodeLike, symbols);
  const compiled = node.compile();
  return (vars: Record<string, number>) => {
    const value = compiled.evaluate(scopeFor({ angle, symbols: vars })) as unknown;
    if (typeof value !== "number" || Number.isNaN(value)) throw new Error("Undefined result");
    return value;
  };
}
