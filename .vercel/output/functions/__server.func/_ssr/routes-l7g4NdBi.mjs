import { i as __toESM } from "../_runtime.mjs";
import { n as all, t as create } from "../_libs/mathjs+[...].mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { n as create$1, t as persist } from "../_libs/zustand.mjs";
import { a as string, i as object, n as literal, r as number, t as array } from "../_libs/zod.mjs";
import { a as Focus, i as Moon, n as Sun, o as Copy, r as Settings2, s as Command } from "../_libs/lucide-react.mjs";
import { r as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evaluate-CqC4QJzP.js
var math = create(all, {});
math.import({ factorial(n) {
	const x = asReal(n, "Factorial");
	if (x < 0) throw new Error("Factorial is undefined for negative numbers");
	if (Math.abs(x - Math.round(x)) > 1e-10) throw new Error("Factorial requires a non-negative integer");
	if (x > 170) throw new Error("Factorial overflow");
	return math.gamma(x + 1);
} }, { override: true });
var FN = /* @__PURE__ */ new Set([
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
	"mod"
]);
var SYMBOLS = /* @__PURE__ */ new Set([
	"pi",
	"e",
	"tau",
	"Ans",
	"M"
]);
var OPS = /* @__PURE__ */ new Set([
	"+",
	"-",
	"*",
	"/",
	"^",
	"!",
	"%",
	"mod"
]);
var TYPES = /* @__PURE__ */ new Set([
	"ConstantNode",
	"OperatorNode",
	"ParenthesisNode",
	"FunctionNode",
	"SymbolNode"
]);
var MAX_LENGTH = 400;
var MAX_NODES = 280;
function asReal(n, label) {
	if (typeof n !== "number" || Number.isNaN(n)) throw new Error(`${label} expected a real number`);
	if (!Number.isFinite(n)) throw new Error(`${label} is not finite`);
	return n;
}
function toRad(angle, x) {
	return angle === "deg" ? x * Math.PI / 180 : x;
}
function fromRad(angle, x) {
	return angle === "deg" ? x * 180 / Math.PI : x;
}
function tanReal(angle, x) {
	if (angle === "deg") {
		const m = (x % 180 + 180) % 180;
		if (Math.abs(m - 90) < 1e-8) throw new Error("Tangent is undefined");
	} else {
		const turns = x / Math.PI - .5;
		if (Math.abs(turns - Math.round(turns)) < 1e-8) throw new Error("Tangent is undefined");
	}
	return Math.tan(toRad(angle, x));
}
function scopeFor(ctx) {
	const angle = ctx.angle;
	const symbols = ctx.symbols ?? {};
	const real = (label, fn) => (x) => fn(asReal(x, label));
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
		nthRoot: (x, root) => {
			const v = asReal(x, "nthRoot");
			const r = asReal(root, "nthRoot");
			if (!Number.isInteger(r) || r === 0) throw new Error("nthRoot requires a non-zero integer root");
			if (v < 0 && Math.abs(r) % 2 === 0) throw new Error("Even root of a negative number is not real");
			return Math.sign(v) * Math.abs(v) ** (1 / r);
		},
		abs: real("abs", Math.abs),
		combinations: (n, k) => {
			const nn = asReal(n, "nCr");
			const kk = asReal(k, "nCr");
			if (!Number.isInteger(nn) || !Number.isInteger(kk)) throw new Error("nCr requires integers");
			if (nn < 0 || kk < 0 || kk > nn) throw new Error("nCr domain error");
			if (nn > 1e3) throw new Error("nCr argument is too large");
			return math.combinations(nn, kk);
		},
		permutations: (n, k) => {
			const nn = asReal(n, "nPr");
			const kk = asReal(k, "nPr");
			if (!Number.isInteger(nn) || !Number.isInteger(kk)) throw new Error("nPr requires integers");
			if (nn < 0 || kk < 0 || kk > nn) throw new Error("nPr domain error");
			if (nn > 1e3) throw new Error("nPr argument is too large");
			return math.permutations(nn, kk);
		},
		gcd: (a, b) => math.gcd(asReal(a, "gcd"), asReal(b, "gcd")),
		lcm: (a, b) => math.lcm(asReal(a, "lcm"), asReal(b, "lcm")),
		round: real("round", (x) => Math.round(x)),
		floor: real("floor", (x) => Math.floor(x)),
		ceil: real("ceil", (x) => Math.ceil(x)),
		pow: (a, b) => {
			const v = Math.pow(asReal(a, "pow"), asReal(b, "pow"));
			if (typeof v !== "number" || Number.isNaN(v)) throw new Error("Power is not real");
			if (!Number.isFinite(v)) throw new Error("Power overflow");
			return v;
		},
		min: (a, b) => Math.min(asReal(a, "min"), asReal(b, "min")),
		max: (a, b) => Math.max(asReal(a, "max"), asReal(b, "max")),
		sign: real("sign", Math.sign),
		mod: (a, b) => {
			const d = asReal(b, "mod");
			if (d === 0) throw new Error("Modulo by zero");
			return asReal(a, "mod") % d;
		}
	};
}
/** Normalize keypad unicode without turning Euler's constant into an exponent. */
function normalizeExpression(input) {
	return input.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/\s+/g, "");
}
function assertSafe(node, extra) {
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
				if (Number(arg0.value) > 170) throw new Error("Factorial overflow");
			}
		}
		if (n.type === "SymbolNode") {
			const name = n.name ?? "";
			if (!SYMBOLS.has(name) && !FN.has(name) && !extraSet.has(name)) throw new Error(`Unknown symbol: ${name}`);
		}
		if (n.type === "OperatorNode") {
			const op = n.op ?? "";
			if (!OPS.has(op)) throw new Error(`Unsupported operator: ${op}`);
			if (op === "^" && n.args?.[1]?.type === "ConstantNode") {
				if (Math.abs(Number(n.args[1].value)) > 1e4) throw new Error("Exponent is too large");
			}
			if (op === "!" && n.args?.[0]?.type === "ConstantNode") {
				if (Number(n.args[0].value) > 170) throw new Error("Factorial overflow");
			}
		}
	});
}
function formatNumber(value, precision = 10) {
	if (!Number.isFinite(value)) return "undefined";
	if (Object.is(value, -0)) return "0";
	const sig = Math.min(14, Math.max(1, Math.round(precision)));
	if (value === 0) return "0";
	const abs = Math.abs(value);
	if (abs >= 0xe8d4a51000 || abs < 1e-6) return value.toExponential(Math.max(0, sig - 1)).replace(/\.?0+e/, "e").replace("e+", "e+");
	let text = value.toPrecision(sig);
	if (/e/i.test(text)) return text.replace("e", "e").replace("e+", "e+");
	if (text.includes(".")) text = text.replace(/0+$/, "").replace(/\.$/, "");
	return text;
}
function evaluateExpression(raw, ctx) {
	try {
		const input = normalizeExpression(raw ?? "");
		if (!input) return {
			ok: false,
			error: "Empty expression"
		};
		if (input.length > MAX_LENGTH) return {
			ok: false,
			error: "Expression is too long"
		};
		const extra = Object.keys(ctx.symbols ?? {});
		for (const name of extra) if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name) || FN.has(name) || SYMBOLS.has(name)) return {
			ok: false,
			error: `Invalid symbol: ${name}`
		};
		const node = math.parse(input);
		assertSafe(node, extra);
		const value = node.compile().evaluate(scopeFor(ctx));
		if (typeof value === "number") {
			if (Number.isNaN(value)) return {
				ok: false,
				error: "Undefined result"
			};
			if (!Number.isFinite(value)) return {
				ok: false,
				error: "Division by zero or overflow"
			};
			return {
				ok: true,
				value,
				formatted: formatNumber(value, ctx.precision ?? 10)
			};
		}
		if (value && typeof value === "object" && "im" in value) return {
			ok: false,
			error: "Result is not real"
		};
		return {
			ok: false,
			error: "Not a numeric result"
		};
	} catch (error) {
		return {
			ok: false,
			error: (error instanceof Error ? error.message.split("\n")[0] : "Invalid expression").replace(/^Error:\s*/, "").slice(0, 180)
		};
	}
}
function compileReal(raw, symbols, angle) {
	const input = normalizeExpression(raw);
	if (!input) throw new Error("Empty expression");
	if (input.length > MAX_LENGTH) throw new Error("Expression is too long");
	const node = math.parse(input);
	assertSafe(node, symbols);
	const compiled = node.compile();
	return (vars) => {
		const value = compiled.evaluate(scopeFor({
			angle,
			symbols: vars
		}));
		if (typeof value !== "number" || Number.isNaN(value)) throw new Error("Undefined result");
		return value;
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-l7g4NdBi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var STARTS_FRESH = /^(?:[0-9.(]|pi$|e$|Ans$|M$|[A-Za-z]\w*\()/;
var CONTINUES_WITH_ANS = /^[+\-*/^%]/;
function initialCalc(partial) {
	return {
		expression: "",
		memory: 0,
		ans: 0,
		angle: "deg",
		precision: 10,
		justEvaluated: false,
		error: null,
		resultText: "0",
		...partial
	};
}
function clearEntry(expression) {
	return expression.replace(/((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[A-Za-z]\w*\(|π|√|.)$/u, "");
}
function currentValue(state) {
	if (!state.expression.trim()) return {
		ok: true,
		value: state.ans,
		formatted: formatNumber(state.ans, state.precision)
	};
	return evaluateExpression(state.expression, {
		angle: state.angle,
		ans: state.ans,
		memory: state.memory,
		precision: state.precision
	});
}
function reduceCalc(state, action) {
	switch (action.type) {
		case "angle": return { state: preview({
			...state,
			angle: action.angle,
			justEvaluated: false
		}) };
		case "precision": return { state: preview({
			...state,
			precision: action.precision
		}) };
		case "load": return { state: preview({
			...state,
			expression: action.expression,
			justEvaluated: false,
			error: null
		}) };
		case "ac": return { state: {
			...state,
			expression: "",
			justEvaluated: false,
			error: null,
			resultText: "0"
		} };
		case "ce": return { state: preview({
			...state,
			expression: clearEntry(state.expression),
			justEvaluated: false
		}) };
		case "backspace": {
			const expression = state.justEvaluated ? "" : state.expression.slice(0, -1);
			return { state: preview({
				...state,
				expression,
				justEvaluated: false
			}) };
		}
		case "insert": {
			const text = action.text;
			let expression;
			if (state.justEvaluated && STARTS_FRESH.test(text)) expression = text;
			else if (state.justEvaluated && CONTINUES_WITH_ANS.test(text)) expression = formatNumber(state.ans, Math.min(12, state.precision)) + text;
			else expression = state.expression + text;
			return { state: preview({
				...state,
				expression,
				justEvaluated: false
			}) };
		}
		case "percent": return { state: preview({
			...state,
			expression: `${state.justEvaluated ? formatNumber(state.ans, Math.min(12, state.precision)) : state.expression}%`,
			justEvaluated: false
		}) };
		case "ee": {
			const base = state.justEvaluated ? formatNumber(state.ans, Math.min(12, state.precision)) : state.expression;
			const expression = /(?:\d|\))$/.test(base) ? `${base}*10^(` : base ? `${base}*10^(` : "10^(";
			return { state: preview({
				...state,
				expression,
				justEvaluated: false
			}) };
		}
		case "negate": {
			const expression = state.expression.startsWith("-(") && state.expression.endsWith(")") ? state.expression.slice(2, -1) : state.expression ? `-(${state.expression})` : "-";
			return { state: preview({
				...state,
				expression,
				justEvaluated: false
			}) };
		}
		case "memory": return reduceMemory(state, action.op);
		case "equals": return commit(state);
		default: return { state };
	}
}
function reduceMemory(state, op) {
	if (op === "clear") return { state: {
		...state,
		memory: 0
	} };
	if (op === "recall") {
		const text = formatNumber(state.memory, Math.min(12, state.precision));
		return reduceCalc({
			...state,
			justEvaluated: false
		}, {
			type: "insert",
			text
		});
	}
	const value = currentValue(state);
	if (!value.ok) return { state: {
		...state,
		error: value.error,
		resultText: value.error
	} };
	if (op === "store") return { state: {
		...preview(state),
		memory: value.value,
		error: null
	} };
	if (op === "add") return { state: {
		...preview(state),
		memory: state.memory + value.value,
		error: null
	} };
	return { state: {
		...preview(state),
		memory: state.memory - value.value,
		error: null
	} };
}
function preview(state) {
	if (!state.expression.trim()) return {
		...state,
		error: null,
		resultText: "0"
	};
	const value = evaluateExpression(state.expression, {
		angle: state.angle,
		ans: state.ans,
		memory: state.memory,
		precision: state.precision
	});
	if (!value.ok) return {
		...state,
		error: null,
		resultText: "…"
	};
	return {
		...state,
		error: null,
		resultText: value.formatted
	};
}
function commit(state) {
	if (!state.expression.trim()) return { state };
	const value = evaluateExpression(state.expression, {
		angle: state.angle,
		ans: state.ans,
		memory: state.memory,
		precision: state.precision
	});
	if (!value.ok) return { state: {
		...state,
		error: value.error,
		resultText: value.error,
		justEvaluated: false
	} };
	return {
		state: {
			...state,
			ans: value.value,
			error: null,
			resultText: value.formatted,
			justEvaluated: true
		},
		committed: {
			expression: state.expression,
			result: value.formatted,
			value: value.value
		}
	};
}
var KEYS = [
	{
		id: "mc",
		label: "MC",
		aria: "Memory clear",
		variant: "mem",
		action: {
			type: "memory",
			op: "clear"
		}
	},
	{
		id: "mr",
		label: "MR",
		aria: "Memory recall",
		variant: "mem",
		action: {
			type: "memory",
			op: "recall"
		}
	},
	{
		id: "mp",
		label: "M+",
		aria: "Memory add",
		variant: "mem",
		action: {
			type: "memory",
			op: "add"
		}
	},
	{
		id: "mm",
		label: "M−",
		aria: "Memory subtract",
		variant: "mem",
		action: {
			type: "memory",
			op: "sub"
		}
	},
	{
		id: "ms",
		label: "MS",
		aria: "Memory store",
		variant: "mem",
		action: {
			type: "memory",
			op: "store"
		}
	},
	{
		id: "ans",
		label: "Ans",
		aria: "Previous answer",
		variant: "mem",
		action: {
			type: "insert",
			text: "Ans"
		}
	},
	{
		id: "sin",
		label: "sin",
		aria: "Sine",
		variant: "fn",
		action: {
			type: "insert",
			text: "sin("
		},
		second: {
			label: "asin",
			aria: "Inverse sine",
			action: {
				type: "insert",
				text: "asin("
			}
		}
	},
	{
		id: "cos",
		label: "cos",
		aria: "Cosine",
		variant: "fn",
		action: {
			type: "insert",
			text: "cos("
		},
		second: {
			label: "acos",
			aria: "Inverse cosine",
			action: {
				type: "insert",
				text: "acos("
			}
		}
	},
	{
		id: "tan",
		label: "tan",
		aria: "Tangent",
		variant: "fn",
		action: {
			type: "insert",
			text: "tan("
		},
		second: {
			label: "atan",
			aria: "Inverse tangent",
			action: {
				type: "insert",
				text: "atan("
			}
		}
	},
	{
		id: "ln",
		label: "ln",
		aria: "Natural log",
		variant: "fn",
		action: {
			type: "insert",
			text: "log("
		},
		second: {
			label: "sinh",
			aria: "Hyperbolic sine",
			action: {
				type: "insert",
				text: "sinh("
			}
		}
	},
	{
		id: "log",
		label: "log",
		aria: "Log base 10",
		variant: "fn",
		action: {
			type: "insert",
			text: "log10("
		},
		second: {
			label: "cosh",
			aria: "Hyperbolic cosine",
			action: {
				type: "insert",
				text: "cosh("
			}
		}
	},
	{
		id: "sqrt",
		label: "√",
		aria: "Square root",
		variant: "fn",
		action: {
			type: "insert",
			text: "sqrt("
		},
		second: {
			label: "tanh",
			aria: "Hyperbolic tangent",
			action: {
				type: "insert",
				text: "tanh("
			}
		}
	},
	{
		id: "pi",
		label: "π",
		aria: "Pi",
		variant: "fn",
		action: {
			type: "insert",
			text: "pi"
		},
		second: {
			label: "asinh",
			aria: "Inverse hyperbolic sine",
			action: {
				type: "insert",
				text: "asinh("
			}
		}
	},
	{
		id: "e",
		label: "e",
		aria: "Euler's constant",
		variant: "fn",
		action: {
			type: "insert",
			text: "e"
		},
		second: {
			label: "acosh",
			aria: "Inverse hyperbolic cosine",
			action: {
				type: "insert",
				text: "acosh("
			}
		}
	},
	{
		id: "pow",
		label: "xʸ",
		aria: "Power",
		variant: "op",
		action: {
			type: "insert",
			text: "^"
		},
		second: {
			label: "atanh",
			aria: "Inverse hyperbolic tangent",
			action: {
				type: "insert",
				text: "atanh("
			}
		}
	},
	{
		id: "sq",
		label: "x²",
		aria: "Square",
		variant: "op",
		action: {
			type: "insert",
			text: "^2"
		},
		second: {
			label: "nCr",
			aria: "Combinations",
			action: {
				type: "insert",
				text: "combinations("
			}
		}
	},
	{
		id: "fact",
		label: "n!",
		aria: "Factorial",
		variant: "op",
		action: {
			type: "insert",
			text: "!"
		},
		second: {
			label: "nPr",
			aria: "Permutations",
			action: {
				type: "insert",
				text: "permutations("
			}
		}
	},
	{
		id: "lp",
		label: "(",
		aria: "Left parenthesis",
		variant: "op",
		action: {
			type: "insert",
			text: "("
		}
	},
	{
		id: "7",
		label: "7",
		aria: "7",
		variant: "digit",
		action: {
			type: "insert",
			text: "7"
		}
	},
	{
		id: "8",
		label: "8",
		aria: "8",
		variant: "digit",
		action: {
			type: "insert",
			text: "8"
		}
	},
	{
		id: "9",
		label: "9",
		aria: "9",
		variant: "digit",
		action: {
			type: "insert",
			text: "9"
		}
	},
	{
		id: "div",
		label: "÷",
		aria: "Divide",
		variant: "op",
		action: {
			type: "insert",
			text: "/"
		}
	},
	{
		id: "pct",
		label: "%",
		aria: "Percent",
		variant: "op",
		action: { type: "percent" }
	},
	{
		id: "bs",
		label: "⌫",
		aria: "Backspace",
		variant: "op",
		action: { type: "backspace" }
	},
	{
		id: "4",
		label: "4",
		aria: "4",
		variant: "digit",
		action: {
			type: "insert",
			text: "4"
		}
	},
	{
		id: "5",
		label: "5",
		aria: "5",
		variant: "digit",
		action: {
			type: "insert",
			text: "5"
		}
	},
	{
		id: "6",
		label: "6",
		aria: "6",
		variant: "digit",
		action: {
			type: "insert",
			text: "6"
		}
	},
	{
		id: "mul",
		label: "×",
		aria: "Multiply",
		variant: "op",
		action: {
			type: "insert",
			text: "*"
		}
	},
	{
		id: "rp",
		label: ")",
		aria: "Right parenthesis",
		variant: "op",
		action: {
			type: "insert",
			text: ")"
		}
	},
	{
		id: "ce",
		label: "CE",
		aria: "Clear entry",
		variant: "op",
		action: { type: "ce" }
	},
	{
		id: "1",
		label: "1",
		aria: "1",
		variant: "digit",
		action: {
			type: "insert",
			text: "1"
		}
	},
	{
		id: "2",
		label: "2",
		aria: "2",
		variant: "digit",
		action: {
			type: "insert",
			text: "2"
		}
	},
	{
		id: "3",
		label: "3",
		aria: "3",
		variant: "digit",
		action: {
			type: "insert",
			text: "3"
		}
	},
	{
		id: "sub",
		label: "−",
		aria: "Subtract",
		variant: "op",
		action: {
			type: "insert",
			text: "-"
		}
	},
	{
		id: "neg",
		label: "±",
		aria: "Toggle sign",
		variant: "op",
		action: { type: "negate" }
	},
	{
		id: "ee",
		label: "EE",
		aria: "Scientific notation times 10 to the power",
		variant: "op",
		action: { type: "ee" }
	},
	{
		id: "0",
		label: "0",
		aria: "0",
		variant: "digit",
		action: {
			type: "insert",
			text: "0"
		}
	},
	{
		id: "dot",
		label: ".",
		aria: "Decimal point",
		variant: "digit",
		action: {
			type: "insert",
			text: "."
		}
	},
	{
		id: "inv",
		label: "1/x",
		aria: "Reciprocal",
		variant: "op",
		action: {
			type: "insert",
			text: "1/("
		}
	},
	{
		id: "add",
		label: "+",
		aria: "Add",
		variant: "op",
		action: {
			type: "insert",
			text: "+"
		}
	},
	{
		id: "ac",
		label: "AC",
		aria: "All clear",
		variant: "op",
		action: { type: "ac" }
	},
	{
		id: "eq",
		label: "=",
		aria: "Evaluate",
		variant: "eq",
		action: { type: "equals" }
	}
];
var sceneBus = {
	mode: "calc",
	pointer: {
		x: 0,
		y: 0
	},
	pulse: 0,
	theme: "dark",
	focus: false,
	reduced: false,
	intro: 1
};
function nid(prefix) {
	return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}
var useNexus = create$1()(persist((set, get) => ({
	mode: "calc",
	theme: "dark",
	angle: "deg",
	precision: 10,
	graphics: "auto",
	intro: true,
	focus: false,
	motion: "full",
	expression: "",
	memory: 0,
	ans: 0,
	justEvaluated: false,
	error: null,
	resultText: "0",
	history: [],
	functions: [{
		id: "f1",
		expression: "sin(x)",
		enabled: true
	}, {
		id: "f2",
		expression: "x^2/4",
		enabled: true
	}],
	formulas: [],
	bookmarks: [],
	paletteOpen: false,
	settingsOpen: false,
	setMode: (mode) => set({ mode }),
	patch: (partial) => set(partial),
	dispatch: (action) => {
		const s = get();
		const { state, committed } = reduceCalc(initialCalc({
			expression: s.expression,
			memory: s.memory,
			ans: s.ans,
			angle: s.angle,
			precision: s.precision,
			justEvaluated: s.justEvaluated,
			error: s.error,
			resultText: s.resultText
		}), action);
		const history = committed ? [{
			id: nid("h"),
			expression: committed.expression,
			result: committed.result,
			at: Date.now()
		}, ...s.history].slice(0, 500) : s.history;
		if (committed) sceneBus.pulse = 1;
		set({
			expression: state.expression,
			memory: state.memory,
			ans: state.ans,
			angle: state.angle,
			precision: state.precision,
			justEvaluated: state.justEvaluated,
			error: state.error,
			resultText: state.resultText,
			history
		});
	},
	removeHistory: (id) => set({ history: get().history.filter((item) => item.id !== id) }),
	clearHistory: () => set({ history: [] }),
	noteHistory: (id, note) => set({ history: get().history.map((item) => item.id === id ? {
		...item,
		note
	} : item) }),
	importRecords: (history, formulas, bookmarks) => set({
		history: history.slice(0, 500),
		formulas: formulas ? formulas.slice(0, 200) : get().formulas,
		bookmarks: bookmarks ? bookmarks.slice(0, 200) : get().bookmarks
	})
}), {
	name: "nexus.v2",
	skipHydration: true,
	partialize: (s) => ({
		theme: s.theme,
		angle: s.angle,
		precision: s.precision,
		graphics: s.graphics,
		intro: s.intro,
		focus: s.focus,
		motion: s.motion,
		expression: s.expression,
		memory: s.memory,
		ans: s.ans,
		resultText: s.resultText,
		history: s.history,
		functions: s.functions,
		formulas: s.formulas,
		bookmarks: s.bookmarks,
		mode: s.mode
	})
}));
var MODES = [
	{
		id: "calc",
		label: "Calculate",
		hint: "Scientific keypad"
	},
	{
		id: "graph",
		label: "Graph",
		hint: "Plot and inspect"
	},
	{
		id: "solve",
		label: "Solve",
		hint: "Equations and systems"
	},
	{
		id: "matrix",
		label: "Matrix",
		hint: "Matrices and vectors"
	},
	{
		id: "stats",
		label: "Statistics",
		hint: "Data and probability"
	},
	{
		id: "units",
		label: "Convert",
		hint: "Units and bases"
	},
	{
		id: "calculus",
		label: "Calculus",
		hint: "Numeric derivative and integral"
	},
	{
		id: "formulas",
		label: "Formulas",
		hint: "Library and bookmarks"
	},
	{
		id: "history",
		label: "History",
		hint: "Search past work"
	},
	{
		id: "insights",
		label: "Insights",
		hint: "Usage from your history"
	}
];
function Panel({ eyebrow, title, children, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass rounded-2xl p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-4 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.22em] text-accent uppercase",
				children: eyebrow
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold tracking-tight",
				children: title
			})] }), actions]
		}), children]
	});
}
var fieldClass = "min-h-11 w-full rounded-xl border border-line bg-bg/50 px-3 text-fg outline-none";
var historySchema = object({
	id: string().min(1).max(80),
	expression: string().max(400),
	result: string().max(200),
	at: number(),
	note: string().max(500).optional()
});
var customFormulaSchema = object({
	id: string().min(1).max(80),
	name: string().min(1).max(80),
	expression: string().min(1).max(400),
	variables: array(string().regex(/^[A-Za-z][A-Za-z0-9_]*$/)).max(12),
	note: string().max(500).optional()
});
var backupSchema = object({
	version: literal(1),
	history: array(historySchema).max(500),
	formulas: array(customFormulaSchema).max(200).optional(),
	bookmarks: array(string().max(80)).max(200).optional()
});
function parseBackup(raw) {
	return backupSchema.parse(raw);
}
function Background() {
	const graphics = useNexus((s) => s.graphics);
	const [Scene, setScene] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [quality, setQuality] = (0, import_react.useState)("low");
	(0, import_react.useEffect)(() => {
		const next = resolveQuality(graphics);
		setQuality(next);
		if (next === "off" || !hasWebGL()) {
			setFailed(!hasWebGL() && graphics !== "off");
			return;
		}
		let alive = true;
		import("./scene-D6ub-fH7.mjs").then((mod) => {
			if (alive) setScene(() => mod.NexusScene);
		}).catch(() => {
			if (alive) setFailed(true);
		});
		return () => {
			alive = false;
		};
	}, [graphics]);
	if (quality === "off" || failed || !Scene) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-0",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { quality })
	});
}
function resolveQuality(graphics) {
	if (graphics === "off") return "off";
	if (graphics === "high") return "high";
	if (graphics === "low") return "low";
	if ((navigator.hardwareConcurrency || 4) < 4 || window.innerWidth < 760 || sceneBus.reduced) return "low";
	return "high";
}
function hasWebGL() {
	try {
		const canvas = document.createElement("canvas");
		return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
	} catch {
		return false;
	}
}
function Calculator() {
	const expression = useNexus((s) => s.expression);
	const resultText = useNexus((s) => s.resultText);
	const error = useNexus((s) => s.error);
	const memory = useNexus((s) => s.memory);
	const angle = useNexus((s) => s.angle);
	const dispatch = useNexus((s) => s.dispatch);
	const [second, setSecond] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copyResult() {
		const text = error ? "" : resultText;
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1200);
		} catch {
			setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass rounded-2xl p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.22em] text-accent uppercase",
					children: "Scientific"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [angle === "deg" ? "Degrees" : "Radians", memory !== 0 ? " · M" : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Expression"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: expression,
					autoCapitalize: "off",
					autoCorrect: "off",
					spellCheck: false,
					placeholder: "sin(30)+2^3",
					"aria-label": "Expression",
					className: "w-full bg-transparent font-mono text-lg text-fg outline-none placeholder:text-muted",
					onChange: (event) => dispatch({
						type: "load",
						expression: event.target.value
					}),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							dispatch({ type: "equals" });
						} else if (event.key === "Escape") {
							event.preventDefault();
							dispatch({ type: "ac" });
						}
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `min-h-8 flex-1 text-right font-mono text-4xl tracking-tight sm:text-5xl ${error ? "text-danger text-xl sm:text-2xl" : "text-fg"}`,
					role: "status",
					"aria-live": "polite",
					children: error ?? resultText
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-1 grid size-11 place-items-center rounded-xl border border-line text-muted",
					"aria-label": "Copy result",
					onClick: () => void copyResult(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
				})]
			}),
			copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-right text-xs text-ok",
				children: "Copied"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": second,
					className: `min-h-11 rounded-xl border px-3 text-sm ${second ? "border-accent text-accent" : "border-line text-muted"}`,
					onClick: () => setSecond((value) => !value),
					children: "2nd"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-center text-xs text-muted",
					children: "EE inserts ×10^( so it never types Euler’s e. % follows calculator percent: 200+10% = 220."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-6 gap-1.5",
				children: KEYS.map((key) => {
					const face = second && key.second ? key.second : key;
					const variant = key.variant === "eq" ? "bg-accent text-bg font-semibold" : key.variant === "fn" ? "border border-line text-accent" : key.variant === "mem" ? "border border-line text-muted text-xs" : key.variant === "op" ? "border border-line text-fg" : "border border-line bg-bg/40 text-fg";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": face.aria,
						className: `min-h-11 rounded-xl text-sm ${variant}`,
						onClick: () => dispatch(face.action),
						children: face.label
					}, key.id);
				})
			})
		]
	});
}
function Intro() {
	const enabled = useNexus((s) => s.intro);
	const motion = useNexus((s) => s.motion);
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!enabled || reduce) {
			sceneBus.intro = 1;
			setShow(false);
			return;
		}
		sceneBus.intro = 0;
		setShow(true);
		let alive = true;
		let timeline = null;
		import("../_libs/gsap.mjs").then((n) => n.t).then(({ default: gsap }) => {
			if (!alive) return;
			const mark = document.getElementById("nexus-mark");
			const tl = gsap.timeline({ onComplete: () => setShow(false) });
			timeline = tl;
			tl.to(sceneBus, {
				intro: 1,
				duration: 2.8,
				ease: "power2.inOut"
			});
			if (mark) {
				tl.fromTo(mark, {
					opacity: 0,
					y: 16
				}, {
					opacity: 1,
					y: 0,
					duration: .7
				}, .15);
				tl.to(mark, {
					opacity: 0,
					duration: .45
				}, 1.8);
			}
		});
		return () => {
			alive = false;
			timeline?.kill();
		};
	}, [enabled, motion]);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "pointer-events-auto absolute top-4 right-4 min-h-11 rounded-xl border border-line bg-surface px-3 text-sm",
			onClick: () => {
				sceneBus.intro = 1;
				setShow(false);
			},
			children: "Skip intro"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: "nexus-mark",
			className: "mt-16 text-3xl font-semibold tracking-[0.42em] text-fg",
			children: "NEXUS"
		})]
	});
}
var GraphPanel = (0, import_react.lazy)(() => import("./graph-panel-BlEAuLV1.mjs"));
var SolverPanel = (0, import_react.lazy)(() => import("./solver-panel-C0RCvjMz.mjs"));
var MatrixPanel = (0, import_react.lazy)(() => import("./matrix-panel-bQD0utGh.mjs"));
var StatsPanel = (0, import_react.lazy)(() => import("./stats-panel-DPRE_T0o.mjs"));
var UnitsPanel = (0, import_react.lazy)(() => import("./units-panel-whd5sXsa.mjs"));
var CalculusPanel = (0, import_react.lazy)(() => import("./calculus-panel-BocXOyv4.mjs"));
var FormulaPanel = (0, import_react.lazy)(() => import("./formula-panel-D6i6nABq.mjs"));
var HistoryPanel = (0, import_react.lazy)(() => import("./history-panel-B020rAre.mjs"));
var InsightsPanel = (0, import_react.lazy)(() => import("./insights-panel-DhKac1W8.mjs"));
function NexusApp() {
	const mode = useNexus((s) => s.mode);
	const theme = useNexus((s) => s.theme);
	const angle = useNexus((s) => s.angle);
	const precision = useNexus((s) => s.precision);
	const focus = useNexus((s) => s.focus);
	const motionSetting = useNexus((s) => s.motion);
	const graphics = useNexus((s) => s.graphics);
	const intro = useNexus((s) => s.intro);
	const paletteOpen = useNexus((s) => s.paletteOpen);
	const settingsOpen = useNexus((s) => s.settingsOpen);
	const patch = useNexus((s) => s.patch);
	const setMode = useNexus((s) => s.setMode);
	const dispatch = useNexus((s) => s.dispatch);
	const history = useNexus((s) => s.history);
	const formulas = useNexus((s) => s.formulas);
	const bookmarks = useNexus((s) => s.bookmarks);
	const importRecords = useNexus((s) => s.importRecords);
	const reduce = useReducedMotion();
	const [online, setOnline] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		useNexus.persist.rehydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.theme = theme;
		sceneBus.theme = theme;
		sceneBus.mode = mode;
		sceneBus.focus = focus;
		sceneBus.reduced = motionSetting === "reduced" || reduce === true || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, [
		focus,
		mode,
		motionSetting,
		reduce,
		theme
	]);
	(0, import_react.useEffect)(() => {
		const sync = () => setOnline(navigator.onLine);
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		const onKey = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				patch({ paletteOpen: true });
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
			window.removeEventListener("keydown", onKey);
		};
	}, [patch]);
	const commands = MODES.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.hint.toLowerCase().includes(query.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-3 py-3 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold tracking-[0.28em]",
						children: "NEXUS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: online ? "Ready on this device" : "Offline — calculations still run here"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3 text-sm",
								onClick: () => dispatch({
									type: "angle",
									angle: angle === "deg" ? "rad" : "deg"
								}),
								children: angle === "deg" ? "DEG" : "RAD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Precision"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "min-h-11 rounded-xl border border-line bg-transparent px-2 text-fg",
									"aria-label": "Precision",
									value: precision,
									onChange: (event) => dispatch({
										type: "precision",
										precision: Number(event.target.value)
									}),
									children: [
										6,
										8,
										10,
										12,
										14
									].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value,
										children: [value, " digits"]
									}, value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-xl border border-line",
								"aria-label": "Toggle theme",
								onClick: () => patch({ theme: theme === "dark" ? "light" : "dark" }),
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `grid size-11 place-items-center rounded-xl border ${focus ? "border-accent text-accent" : "border-line"}`,
								"aria-pressed": focus,
								"aria-label": "Focus mode",
								onClick: () => patch({ focus: !focus }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-xl border border-line",
								"aria-label": "Settings",
								onClick: () => patch({ settingsOpen: true }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "hidden min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm sm:flex",
								onClick: () => patch({ paletteOpen: true }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "size-4" }), "Search"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-3 grid flex-1 gap-3 ${focus ? "" : "lg:grid-cols-[220px_minmax(0,1fr)]"}`,
					children: [focus ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "glass flex gap-2 overflow-x-auto rounded-2xl p-2 lg:flex-col",
						"aria-label": "Tools",
						children: MODES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-current": mode === item.id ? "page" : void 0,
							className: `min-h-11 shrink-0 rounded-xl px-3 text-left text-sm ${mode === item.id ? "bg-accent text-bg" : "text-fg"}`,
							onClick: () => setMode(item.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block text-xs ${mode === item.id ? "text-bg/80" : "text-muted"}`,
								children: item.hint
							})]
						}, item.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: reduce ? false : {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: reduce ? void 0 : { opacity: 0 },
							transition: { duration: .18 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "glass rounded-2xl p-6 text-sm text-muted",
									children: "Loading tool…"
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tool, { mode })
							})
						}, mode)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 px-1 text-xs text-muted",
						children: "Guest mode keeps history, formulas, and settings in local storage on this device. Expressions are not uploaded."
					})] })]
				})]
			}),
			paletteOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-start justify-center bg-bg/70 p-4 pt-[12vh]",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Command palette",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass w-full max-w-lg rounded-2xl p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						className: fieldClass,
						placeholder: "Jump to a tool",
						"aria-label": "Command search",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						onKeyDown: (event) => {
							if (event.key === "Escape") patch({ paletteOpen: false });
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 max-h-80 overflow-auto",
						children: [
							commands.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-bg/40",
								onClick: () => {
									setMode(item.id);
									patch({ paletteOpen: false });
									setQuery("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: item.hint
								})]
							}, item.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 w-full rounded-xl px-3 text-left text-sm",
								onClick: () => patch({
									theme: theme === "dark" ? "light" : "dark",
									paletteOpen: false
								}),
								children: "Toggle theme"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 w-full rounded-xl px-3 text-left text-sm",
								onClick: () => patch({
									focus: !focus,
									paletteOpen: false
								}),
								children: "Toggle focus mode"
							})
						]
					})]
				})
			}) : null,
			settingsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "settings-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "settings-title",
							className: "text-lg font-semibold",
							children: "Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-3",
									children: ["Graphics", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "min-h-11 rounded-xl border border-line bg-transparent px-2",
										value: graphics,
										onChange: (event) => patch({ graphics: event.target.value }),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "auto",
												children: "Auto"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "high",
												children: "High"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "low",
												children: "Low"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "off",
												children: "Off"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-3",
									children: ["Motion", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "min-h-11 rounded-xl border border-line bg-transparent px-2",
										value: motionSetting,
										onChange: (event) => patch({ motion: event.target.value }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "full",
											children: "Full"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "reduced",
											children: "Reduced"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Play intro" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: intro,
										onChange: (event) => patch({ intro: event.target.checked })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Reduced motion from the operating system is always respected. The intro never covers the keypad. Turning graphics off leaves every calculation available."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Keyboard: Ctrl or Cmd K opens this search. Enter evaluates. Escape clears the expression."
								}),
								notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: notice }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-xl border border-line px-3",
										onClick: () => {
											const blob = new Blob([JSON.stringify({
												version: 1,
												history,
												formulas,
												bookmarks
											}, null, 2)], { type: "application/json" });
											const link = document.createElement("a");
											link.href = URL.createObjectURL(blob);
											link.download = "nexus-backup.json";
											link.click();
											URL.revokeObjectURL(link.href);
										},
										children: "Export data"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "min-h-11 cursor-pointer rounded-xl border border-line px-3 py-2",
										children: ["Import data", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "application/json",
											className: "sr-only",
											onChange: async (event) => {
												const file = event.target.files?.[0];
												event.target.value = "";
												if (!file) return;
												try {
													const parsed = parseBackup(JSON.parse(await file.text()));
													importRecords(parsed.history, parsed.formulas, parsed.bookmarks);
													setNotice(`Imported ${parsed.history.length} calculations.`);
												} catch {
													setNotice("That file is not a NEXUS backup.");
												}
											}
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg",
							onClick: () => patch({ settingsOpen: false }),
							children: "Done"
						})
					]
				})
			}) : null
		]
	});
}
function Tool({ mode }) {
	if (mode === "calc") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, {});
	if (mode === "graph") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphPanel, {});
	if (mode === "solve") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolverPanel, {});
	if (mode === "matrix") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatrixPanel, {});
	if (mode === "stats") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsPanel, {});
	if (mode === "units") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitsPanel, {});
	if (mode === "calculus") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculusPanel, {});
	if (mode === "formulas") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormulaPanel, {});
	if (mode === "history") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryPanel, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightsPanel, {});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NexusApp, {});
}
//#endregion
export { useNexus as a, evaluateExpression as c, fieldClass as i, formatNumber as l, parseBackup as n, sceneBus as o, Panel as r, compileReal as s, routes_exports as t };
