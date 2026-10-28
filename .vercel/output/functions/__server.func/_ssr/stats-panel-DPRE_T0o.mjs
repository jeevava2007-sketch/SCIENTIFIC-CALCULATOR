import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { i as fieldClass, l as formatNumber, r as Panel } from "./routes-l7g4NdBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-panel-DPRE_T0o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseDataset(text) {
	const values = text.split(/[\s,;]+/).map((part) => part.trim()).filter(Boolean).map((part) => {
		const value = Number(part);
		if (!Number.isFinite(value)) throw new Error(`Invalid number: ${part}`);
		return value;
	});
	if (!values.length) throw new Error("Enter at least one number");
	if (values.length > 1e4) throw new Error("Dataset is limited to 10,000 values");
	return values;
}
function summarize(values) {
	if (!values.length) throw new Error("Dataset is empty");
	const sorted = [...values].sort((a, b) => a - b);
	const count = sorted.length;
	const mean = sorted.reduce((sum, value) => sum + value, 0) / count;
	const populationVariance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count;
	const sampleVariance = count > 1 ? populationVariance * count / (count - 1) : null;
	return {
		count,
		mean,
		median: medianOf(sorted),
		modes: modes(sorted),
		min: sorted[0],
		max: sorted[count - 1],
		populationVariance,
		sampleVariance,
		populationStd: Math.sqrt(populationVariance),
		sampleStd: sampleVariance === null ? null : Math.sqrt(sampleVariance),
		q1: quartile(sorted, .25),
		q3: quartile(sorted, .75),
		iqr: quartile(sorted, .75) - quartile(sorted, .25)
	};
}
/** Tukey hinges: median of each half, excluding the median when n is odd. */
function quartile(sorted, q) {
	const n = sorted.length;
	const mid = Math.floor(n / 2);
	const lower = sorted.slice(0, mid);
	const upper = sorted.slice(n % 2 === 0 ? mid : mid + 1);
	if (q < .5) return medianOf(lower.length ? lower : sorted);
	if (q > .5) return medianOf(upper.length ? upper : sorted);
	return medianOf(sorted);
}
function medianOf(sorted) {
	const n = sorted.length;
	if (!n) return NaN;
	const mid = Math.floor(n / 2);
	return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function modes(sorted) {
	const counts = /* @__PURE__ */ new Map();
	for (const value of sorted) counts.set(value, (counts.get(value) ?? 0) + 1);
	let best = 1;
	for (const count of counts.values()) best = Math.max(best, count);
	if (best <= 1) return [];
	return [...counts.entries()].filter(([, count]) => count === best).map(([value]) => value);
}
function combination(n, k) {
	if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) throw new Error("nCr requires integers with 0 ≤ k ≤ n");
	if (n > 1e3) throw new Error("n is too large");
	let result = 1;
	const kk = Math.min(k, n - k);
	for (let i = 1; i <= kk; i++) result = result * (n - kk + i) / i;
	return result;
}
/** Binomial probability mass function. */
function binomialPmf(k, n, p) {
	if (p < 0 || p > 1) throw new Error("Probability must be between 0 and 1");
	if (!Number.isInteger(k) || k < 0 || k > n) throw new Error("k must be an integer from 0 to n");
	return combination(n, k) * p ** k * (1 - p) ** (n - k);
}
/** Poisson probability mass function. */
function poissonPmf(k, lambda) {
	if (lambda < 0) throw new Error("Lambda must be non-negative");
	if (!Number.isInteger(k) || k < 0 || k > 500) throw new Error("k must be an integer from 0 to 500");
	let term = Math.exp(-lambda);
	for (let i = 1; i <= k; i++) term *= lambda / i;
	return term;
}
/** Normal probability density, not a cumulative probability. */
function normalPdf(x, mean, std) {
	if (std <= 0) throw new Error("Standard deviation must be positive");
	const z = (x - mean) / std;
	return Math.exp(-.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
}
function StatsPanel() {
	const [text, setText] = (0, import_react.useState)("");
	const [spread, setSpread] = (0, import_react.useState)("sample");
	const [trials, setTrials] = (0, import_react.useState)("10");
	const [successes, setSuccesses] = (0, import_react.useState)("3");
	const [p, setP] = (0, import_react.useState)("0.5");
	const [lambda, setLambda] = (0, import_react.useState)("2");
	const [k, setK] = (0, import_react.useState)("1");
	const [zx, setZx] = (0, import_react.useState)("0");
	const [zmu, setZmu] = (0, import_react.useState)("0");
	const [zsd, setZsd] = (0, import_react.useState)("1");
	const summary = (0, import_react.useMemo)(() => {
		if (!text.trim()) return null;
		try {
			return {
				ok: true,
				value: summarize(parseDataset(text))
			};
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "Invalid data"
			};
		}
	}, [text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Statistics",
		title: "Data and probability",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Quartiles use Tukey hinges. Sample variance divides by n−1. Population variance divides by n. Nothing here is filled with sample data until you type a set."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: `${fieldClass} min-h-28 font-mono`,
				"aria-label": "Dataset",
				placeholder: "1, 2, 2, 3, 5",
				value: text,
				onChange: (event) => setText(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `min-h-11 rounded-xl border px-3 text-sm ${spread === "sample" ? "border-accent text-accent" : "border-line"}`,
					onClick: () => setSpread("sample"),
					children: "Sample"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `min-h-11 rounded-xl border px-3 text-sm ${spread === "population" ? "border-accent text-accent" : "border-line"}`,
					onClick: () => setSpread("population"),
					children: "Population"
				})]
			}),
			!text.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Enter numbers separated by commas, spaces, or new lines."
			}) : null,
			summary && !summary.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: summary.error
			}) : null,
			summary?.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Count",
						value: String(summary.value.count)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Mean",
						value: formatNumber(summary.value.mean, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Median",
						value: formatNumber(summary.value.median, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Mode",
						value: summary.value.modes.length ? summary.value.modes.map((m) => formatNumber(m, 6)).join(", ") : "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: spread === "sample" ? "Sample variance" : "Population variance",
						value: formatNumber(spread === "sample" ? summary.value.sampleVariance ?? NaN : summary.value.populationVariance, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: spread === "sample" ? "Sample std. dev." : "Population std. dev.",
						value: formatNumber(spread === "sample" ? summary.value.sampleStd ?? NaN : summary.value.populationStd, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Q1",
						value: formatNumber(summary.value.q1, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Q3",
						value: formatNumber(summary.value.q3, 8)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "IQR",
						value: formatNumber(summary.value.iqr, 8)
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-semibold",
				children: "Distributions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Binomial and Poisson values are probability masses. The normal value is a density, not a probability."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Binomial n",
						value: trials,
						set: setTrials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "k",
						value: successes,
						set: setSuccesses
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "p",
						value: p,
						set: setP
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prob, {
				run: () => formatNumber(binomialPmf(Number(successes), Number(trials), Number(p)), 8),
				label: "Binomial P(K = k)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Poisson k",
					value: k,
					set: setK
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "lambda",
					value: lambda,
					set: setLambda
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prob, {
				run: () => formatNumber(poissonPmf(Number(k), Number(lambda)), 8),
				label: "Poisson P(K = k)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Normal x",
						value: zx,
						set: setZx
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "mean",
						value: zmu,
						set: setZmu
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "std. dev.",
						value: zsd,
						set: setZsd
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prob, {
				run: () => formatNumber(normalPdf(Number(zx), Number(zmu), Number(zsd)), 8),
				label: "Normal density"
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-mono text-fg",
			children: value
		})]
	});
}
function Num({ label, value, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${fieldClass} mt-1 font-mono`,
			value,
			onChange: (event) => set(event.target.value)
		})]
	});
}
function Prob({ run, label }) {
	const [text, setText] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex flex-wrap items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 rounded-xl border border-line px-3 text-sm",
				onClick: () => {
					try {
						setError(null);
						setText(run());
					} catch (caught) {
						setText(null);
						setError(caught instanceof Error ? caught.message : "Invalid input");
					}
				},
				children: label
			}),
			text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-sm",
				children: text
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-danger",
				children: error
			}) : null
		]
	});
}
//#endregion
export { StatsPanel as default };
