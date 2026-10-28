import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useNexus, i as fieldClass, l as formatNumber, r as Panel, s as compileReal } from "./routes-l7g4NdBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calculus-panel-BocXOyv4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Numerical derivative at a point.
* Central differences at h and h/2, then Richardson extrapolation.
* The result is an approximation, not a symbolic derivative.
*/
function differentiate(expression, x, angle) {
	const fn = compileReal(expression, ["x"], angle);
	const f = (t) => {
		const y = fn({ x: t });
		if (!Number.isFinite(y)) throw new Error("Function is not finite near the point");
		return y;
	};
	f(x);
	const h = .001 * Math.max(1, Math.abs(x));
	const d = (step) => (f(x + step) - f(x - step)) / (2 * step);
	const d1 = d(h);
	const d2 = d(h / 2);
	const value = (4 * d2 - d1) / 3;
	if (!Number.isFinite(value)) throw new Error("Derivative did not converge to a finite value");
	return {
		value,
		errorEstimate: Math.abs(value - d2),
		converged: Math.abs(value - d2) <= 1e-4 * (1 + Math.abs(value)),
		method: "Richardson extrapolation of the central difference. This is a numerical approximation, not a symbolic derivative."
	};
}
/**
* Definite integral on [a, b] by adaptive Simpson's rule.
* The result is an approximation, not an exact antiderivative.
*/
function integrate(expression, a, b, angle, tolerance = 1e-7) {
	if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Limits must be finite");
	if (a === b) return {
		value: 0,
		errorEstimate: 0,
		converged: true,
		method: "Integral over a zero-width interval is 0."
	};
	const fn = compileReal(expression, ["x"], angle);
	const f = (t) => {
		try {
			const y = fn({ x: t });
			if (!Number.isFinite(y)) throw new Error("non-finite");
			return y;
		} catch {
			throw new Error("Integrand is undefined or non-finite inside the interval");
		}
	};
	const left = Math.min(a, b);
	const right = Math.max(a, b);
	const sign = a <= b ? 1 : -1;
	const probe = 32;
	let previous = null;
	for (let i = 0; i <= probe; i++) {
		const y = f(left + (right - left) * i / probe);
		if (previous !== null && Math.abs(y - previous) > 1e6 * (1 + Math.abs(previous))) throw new Error("Integrand appears discontinuous on this interval. The approximation was not attempted.");
		previous = y;
	}
	const result = adaptive(f, left, right, tolerance, simpson(f, left, right), 12);
	return {
		value: sign * result.value,
		errorEstimate: result.error,
		converged: result.ok,
		method: "Adaptive Simpson's rule. This is a numerical approximation, not an exact symbolic integral."
	};
}
function simpson(f, a, b) {
	const c = (a + b) / 2;
	return (b - a) / 6 * (f(a) + 4 * f(c) + f(b));
}
function adaptive(f, a, b, eps, whole, depth) {
	const c = (a + b) / 2;
	const left = simpson(f, a, c);
	const right = simpson(f, c, b);
	const delta = left + right - whole;
	if (depth <= 0) return {
		value: left + right,
		error: Math.abs(delta),
		ok: false
	};
	if (Math.abs(delta) <= 15 * eps) return {
		value: left + right + delta / 15,
		error: Math.abs(delta) / 15,
		ok: true
	};
	const L = adaptive(f, a, c, eps / 2, left, depth - 1);
	const R = adaptive(f, c, b, eps / 2, right, depth - 1);
	return {
		value: L.value + R.value,
		error: L.error + R.error,
		ok: L.ok && R.ok
	};
}
function CalculusPanel() {
	const angle = useNexus((s) => s.angle);
	const [expression, setExpression] = (0, import_react.useState)("x^2");
	const [point, setPoint] = (0, import_react.useState)("3");
	const [a, setA] = (0, import_react.useState)("0");
	const [b, setB] = (0, import_react.useState)("1");
	const [message, setMessage] = (0, import_react.useState)("Results are numerical approximations.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Calculus",
		title: "Numerical derivative and integral",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Differentiation uses Richardson extrapolation of a central difference. Integration uses adaptive Simpson’s rule. Angle mode applies to trig functions. These are not symbolic antiderivatives."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["f(x)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: `${fieldClass} mt-1 font-mono`,
					value: expression,
					onChange: (event) => setExpression(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Point", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value: point,
							onChange: (event) => setPoint(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Lower limit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value: a,
							onChange: (event) => setA(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Upper limit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value: b,
							onChange: (event) => setB(event.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg",
					onClick: () => {
						try {
							const result = differentiate(expression, Number(point), angle);
							setMessage(`f'(${point}) ≈ ${formatNumber(result.value, 8)}. Error estimate ${result.errorEstimate.toExponential(2)}. ${result.converged ? "The two step sizes agreed." : "The estimate did not settle within tolerance."} ${result.method}`);
						} catch (error) {
							setMessage(error instanceof Error ? error.message : "Derivative failed");
						}
					},
					children: "Differentiate"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line px-4 text-sm",
					onClick: () => {
						try {
							const result = integrate(expression, Number(a), Number(b), angle);
							setMessage(`∫ from ${a} to ${b} ≈ ${formatNumber(result.value, 8)}. Error estimate ${result.errorEstimate.toExponential(2)}. ${result.converged ? "The adaptive rule converged." : "The rule hit its depth limit."} ${result.method}`);
						} catch (error) {
							setMessage(error instanceof Error ? error.message : "Integral failed");
						}
					},
					children: "Integrate"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				"aria-live": "polite",
				children: message
			})
		]
	});
}
//#endregion
export { CalculusPanel as default };
