import { d as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useNexus, r as Panel } from "./routes-l7g4NdBi.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-panel-DhKac1W8.js
var import_jsx_runtime = require_jsx_runtime();
var FN_RE = /\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|log10|log2|log|exp|sqrt|cbrt|nthRoot|abs|factorial|combinations|permutations|gcd|lcm|round|floor|ceil|pow|min|max|sign|mod)\s*\(/g;
function summarizeUsage(entries, now = Date.now()) {
	const byDay = /* @__PURE__ */ new Map();
	const byWeek = /* @__PURE__ */ new Map();
	const functions = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (!Number.isFinite(entry.at)) continue;
		const day = isoDay(entry.at);
		byDay.set(day, (byDay.get(day) ?? 0) + 1);
		const week = isoWeek(entry.at);
		byWeek.set(week, (byWeek.get(week) ?? 0) + 1);
		for (const match of entry.expression.matchAll(FN_RE)) {
			const name = match[1] === "log" ? "ln" : match[1];
			functions.set(name, (functions.get(name) ?? 0) + 1);
		}
	}
	const days = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({
		date,
		count
	}));
	const weeks = [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([week, count]) => ({
		week,
		count
	}));
	const functionUsage = [...functions.entries()].map(([name, count]) => ({
		name,
		count
	})).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
	const weekAgo = now - 6048e5;
	return {
		total: entries.length,
		last7Days: entries.filter((entry) => entry.at >= weekAgo && entry.at <= now + 1e3).length,
		days,
		weeks,
		functionUsage
	};
}
function isoDay(at) {
	const date = new Date(at);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isoWeek(at) {
	const date = new Date(at);
	const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const day = utc.getUTCDay() || 7;
	utc.setUTCDate(utc.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
	return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
function InsightsPanel() {
	const summary = summarizeUsage(useNexus((s) => s.history).map((item) => ({
		expression: item.expression,
		at: item.at
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Insights",
		title: "From your calculations",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Charts count only calculations stored in history. There is no sample data."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Calculations",
						value: String(summary.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Last 7 days",
						value: String(summary.last7Days)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Distinct functions",
						value: String(summary.functionUsage.length)
					})
				]
			}),
			summary.days.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Run a calculation with = and the daily chart will use that record."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: summary.days,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "date",
								stroke: "currentColor",
								fontSize: 11,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								stroke: "currentColor",
								fontSize: 11,
								tickLine: false,
								axisLine: false,
								width: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "var(--color-accent)",
								radius: 6
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-semibold",
				children: "Function usage"
			}),
			summary.functionUsage.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No function calls recorded yet."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm",
				children: summary.functionUsage.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between border-b border-line py-1 font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.count })]
				}, item.name))
			}),
			summary.weeks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-semibold",
				children: "Weeks"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm text-muted",
				children: summary.weeks.map((week) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: week.week }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: week.count })]
				}, week.week))
			})] }) : null
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-2xl",
			children: value
		})]
	});
}
//#endregion
export { InsightsPanel as default };
