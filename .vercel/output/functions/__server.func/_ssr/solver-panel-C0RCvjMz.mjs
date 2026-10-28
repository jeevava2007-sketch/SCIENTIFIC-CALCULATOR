import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useNexus, i as fieldClass, l as formatNumber, r as Panel, s as compileReal } from "./routes-l7g4NdBi.mjs";
import { d as rrefSolve } from "./matrix-DQ97hqo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solver-panel-C0RCvjMz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RESERVED = /* @__PURE__ */ new Set([
	"pi",
	"e",
	"tau",
	"Ans",
	"M",
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
function solveInput(raw, angle) {
	const text = raw.trim();
	if (!text) return {
		kind: "error",
		title: "Empty",
		lines: ["Enter an equation."],
		roots: []
	};
	if (text.length > 500) return {
		kind: "error",
		title: "Too long",
		lines: ["Equation is too long."],
		roots: []
	};
	try {
		if (text.includes(";")) return solveSystem(text, angle);
		return solveSingle(text, angle);
	} catch (error) {
		return {
			kind: "error",
			title: "Could not solve",
			lines: [error instanceof Error ? error.message : "Invalid equation"],
			roots: []
		};
	}
}
function splitEquation(eq) {
	const parts = eq.split("=");
	if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) throw new Error("Use exactly one \"=\" per equation.");
	return [parts[0].trim(), parts[1].trim()];
}
function identifiers(expression) {
	const names = /* @__PURE__ */ new Set();
	for (const match of expression.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
		const name = match[0];
		if (!RESERVED.has(name)) names.add(name);
	}
	return [...names];
}
function solveSingle(raw, angle) {
	const [left, right] = splitEquation(raw);
	const expr = `(${left})-(${right})`;
	const vars = identifiers(expr);
	if (vars.length === 0) {
		let value = 0;
		try {
			value = compileReal(expr, [], angle)({});
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : "Invalid equation");
		}
		if (Math.abs(value) < 1e-8) return {
			kind: "infinite",
			title: "Identity",
			lines: ["Both sides are equal for every value. Infinitely many solutions."],
			roots: []
		};
		return {
			kind: "none",
			title: "Contradiction",
			lines: [`Both sides differ by ${formatNumber(value, 8)}. No solution.`],
			roots: []
		};
	}
	if (vars.length > 1) return solveSystem(raw, angle);
	return solveUnivariate(expr, vars[0], angle);
}
function solveUnivariate(expr, variable, angle) {
	const fn = compileReal(expr, [variable], angle);
	const f = (x) => fn({ [variable]: x });
	const c = f(0);
	const a = (f(1) + f(-1)) / 2 - c;
	const b = (f(1) - f(-1)) / 2;
	const probes = [
		-3,
		-1.5,
		-.5,
		.5,
		1.5,
		2,
		3,
		4
	];
	const scale = probes.reduce((m, x) => Math.max(m, Math.abs(f(x))), 1);
	if (!probes.every((x) => Math.abs(f(x) - (a * x * x + b * x + c)) <= 1e-7 * scale)) return numericScan(f, variable, angle);
	if (Math.abs(a) > 1e-10) return solveQuadratic(a, b, c, variable, f);
	if (Math.abs(b) <= 1e-10) {
		if (Math.abs(c) <= 1e-8) return {
			kind: "infinite",
			title: "Identity",
			lines: ["The equation simplifies to 0 = 0. Infinitely many solutions."],
			roots: []
		};
		return {
			kind: "none",
			title: "Contradiction",
			lines: ["The equation simplifies to a non-zero constant. No solution."],
			roots: []
		};
	}
	const x = -c / b;
	const residual = f(x);
	return {
		kind: "unique",
		title: "Linear equation",
		lines: [
			`Rearranged to ${formatNumber(b, 8)}${variable} + ${formatNumber(c, 8)} = 0.`,
			`${variable} = −c / b = ${formatNumber(x, 10)}.`,
			`Verification: substituting gives a residual of ${residual.toExponential(2)}.`
		],
		roots: [{
			real: x,
			imag: 0
		}]
	};
}
function solveQuadratic(a, b, c, variable, f) {
	const d = b * b - 4 * a * c;
	const lines = [`Matched a quadratic ${formatNumber(a, 8)}${variable}² + ${formatNumber(b, 8)}${variable} + ${formatNumber(c, 8)} = 0.`, `Discriminant D = b² − 4ac = ${formatNumber(d, 8)}.`];
	if (d > 1e-12) {
		const s = Math.sqrt(d);
		const x1 = (-b + s) / (2 * a);
		const x2 = (-b - s) / (2 * a);
		lines.push("Two real roots from (−b ± √D) / 2a.");
		lines.push(`${variable}₁ = ${formatNumber(x1, 10)}, residual ${f(x1).toExponential(2)}.`);
		lines.push(`${variable}₂ = ${formatNumber(x2, 10)}, residual ${f(x2).toExponential(2)}.`);
		return {
			kind: "unique",
			title: "Quadratic equation",
			lines,
			roots: [{
				real: x1,
				imag: 0
			}, {
				real: x2,
				imag: 0
			}]
		};
	}
	if (Math.abs(d) <= 1e-12) {
		const x = -b / (2 * a);
		lines.push("Repeated real root x = −b / 2a.");
		lines.push(`${variable} = ${formatNumber(x, 10)}, residual ${f(x).toExponential(2)}.`);
		return {
			kind: "unique",
			title: "Quadratic equation",
			lines,
			roots: [{
				real: x,
				imag: 0
			}]
		};
	}
	const re = -b / (2 * a);
	const im = Math.sqrt(-d) / (2 * Math.abs(a));
	const imag = a > 0 ? im : -im;
	lines.push("No real roots. Complex pair from (−b ± i√|D|) / 2a.");
	lines.push(`${variable} = ${formatNumber(re, 8)} ± ${formatNumber(Math.abs(imag), 8)}i.`);
	lines.push(`Complex residual magnitude ${complexResidual(a, b, c, re, imag).toExponential(2)}.`);
	return {
		kind: "unique",
		title: "Quadratic equation (complex roots)",
		lines,
		roots: [{
			real: re,
			imag: Math.abs(imag)
		}, {
			real: re,
			imag: -Math.abs(imag)
		}]
	};
}
function complexResidual(a, b, c, re, im) {
	const x2re = re * re - im * im;
	const x2im = 2 * re * im;
	const rePart = a * x2re + b * re + c;
	const imPart = a * x2im + b * im;
	return Math.hypot(rePart, imPart);
}
function numericScan(f, variable, _angle) {
	const lines = [
		"Not a linear or quadratic polynomial.",
		"Approximate roots only, by sign-change bisection on [−20, 20].",
		"This does not guarantee every root, and it is not a symbolic solution."
	];
	const roots = [];
	let prevX = -20;
	let prevY = safe(f, prevX);
	for (let i = 1; i <= 2e3; i++) {
		const x = -20 + 40 * i / 2e3;
		const y = safe(f, x);
		if (prevY !== null && y !== null && prevY * y <= 0 && Math.abs(y - prevY) < 1e5) {
			let lo = prevX;
			let hi = x;
			let flo = prevY;
			for (let k = 0; k < 60; k++) {
				const mid = (lo + hi) / 2;
				const fm = safe(f, mid);
				if (fm === null) break;
				if (flo * fm <= 0) hi = mid;
				else {
					lo = mid;
					flo = fm;
				}
			}
			const root = (lo + hi) / 2;
			const residual = safe(f, root);
			if (residual !== null && Math.abs(residual) < 1e-5) {
				roots.push({
					real: root,
					imag: 0
				});
				lines.push(`${variable} ≈ ${formatNumber(root, 8)}, residual ${residual.toExponential(2)}.`);
			}
		}
		prevX = x;
		prevY = y;
	}
	if (!roots.length) lines.push("No roots found in [−20, 20].");
	return {
		kind: "approximate",
		title: "Numeric approximation",
		lines,
		roots
	};
}
function safe(f, x) {
	try {
		const y = f(x);
		return Number.isFinite(y) ? y : null;
	} catch {
		return null;
	}
}
function solveSystem(raw, angle) {
	const equations = raw.split(";").map((part) => part.trim()).filter(Boolean);
	if (equations.length < 2) throw new Error("Separate equations with a semicolon.");
	if (equations.length > 6) throw new Error("At most 6 equations.");
	const parsed = equations.map((eq) => {
		const [left, right] = splitEquation(eq);
		return `(${left})-(${right})`;
	});
	const vars = [...new Set(parsed.flatMap((expr) => identifiers(expr)))];
	if (!vars.length) throw new Error("No unknowns found.");
	if (vars.length !== equations.length) throw new Error(`${equations.length} equations and ${vars.length} unknowns (${vars.join(", ")}). Need the same count for a unique linear solution.`);
	const fns = parsed.map((expr) => compileReal(expr, vars, angle));
	const at = (values) => {
		const scope = {};
		vars.forEach((name, i) => {
			scope[name] = values[i];
		});
		return fns.map((fn) => fn(scope));
	};
	const zero = at(vars.map(() => 0));
	const columns = vars.map((_, index) => {
		const values = vars.map(() => 0);
		values[index] = 1;
		return at(values).map((v, row) => v - zero[row]);
	});
	const A = vars.map((_, row) => columns.map((col) => col[row]));
	const b = zero.map((v) => -v);
	const probe = at(vars.map(() => 1.7));
	for (let row = 0; row < vars.length; row++) {
		const linear = A[row].reduce((sum, coeff, col) => sum + coeff * 1.7, 0) - b[row];
		if (Math.abs(probe[row] - linear) > 1e-6 * (1 + Math.abs(probe[row]))) throw new Error("The system is not linear. NEXUS solves linear systems, plus one linear or quadratic equation in a single variable.");
	}
	const solved = rrefSolve(A, b);
	if (solved.kind === "none") return {
		kind: "none",
		title: "No solution",
		lines: ["Gaussian elimination reached a row 0 = non-zero. The system is inconsistent."],
		roots: []
	};
	if (solved.kind === "infinite") return {
		kind: "infinite",
		title: "Infinitely many solutions",
		lines: ["Gaussian elimination found a free variable. The system is singular and consistent, so it does not have a unique solution."],
		roots: []
	};
	const residuals = at(solved.x);
	return {
		kind: "unique",
		title: "Linear system",
		lines: [
			`Linear system in ${vars.join(", ")}, solved by Gaussian elimination with partial pivoting.`,
			...vars.map((name, i) => `${name} = ${formatNumber(solved.x[i], 10)}`),
			`Verification residuals: ${residuals.map((r) => r.toExponential(2)).join(", ")}.`
		],
		roots: solved.x.map((real) => ({
			real,
			imag: 0
		}))
	};
}
function SolverPanel() {
	const angle = useNexus((s) => s.angle);
	const [text, setText] = (0, import_react.useState)("x^2-5x+6=0");
	const [result, setResult] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Solver",
		title: "Supported equation classes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "One linear or quadratic equation in a single variable, or a square linear system separated by semicolons. Other equations get an approximate scan on [−20, 20], clearly labeled as numeric. Arbitrary symbolic equations are not solved."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${fieldClass} min-h-24 font-mono`,
				"aria-label": "Equation",
				value: text,
				onChange: (event) => setText(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg",
				onClick: () => setResult(solveInput(text, angle)),
				children: "Solve"
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: result.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 list-decimal space-y-1 pl-5 text-sm text-muted",
					children: result.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Steps come from the method that actually ran: coefficient fit, the quadratic formula, or Gaussian elimination."
			})
		]
	});
}
//#endregion
export { SolverPanel as default };
