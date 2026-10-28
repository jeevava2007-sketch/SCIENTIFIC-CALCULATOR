import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { i as fieldClass, l as formatNumber, r as Panel } from "./routes-l7g4NdBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/units-panel-whd5sXsa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UNIT_GROUPS = {
	length: {
		m: 1,
		km: 1e3,
		cm: .01,
		mm: .001,
		um: 1e-6,
		mi: 1609.344,
		yd: .9144,
		ft: .3048,
		in: .0254
	},
	mass: {
		kg: 1,
		g: .001,
		mg: 1e-6,
		lb: .45359237,
		oz: .028349523125,
		t: 1e3
	},
	time: {
		s: 1,
		ms: .001,
		min: 60,
		h: 3600,
		day: 86400,
		week: 604800
	},
	area: {
		"m^2": 1,
		"km^2": 1e6,
		"cm^2": 1e-4,
		"ft^2": .09290304,
		"in^2": 64516e-8,
		acre: 4046.8564224
	},
	volume: {
		"m^3": 1,
		L: .001,
		mL: 1e-6,
		"ft^3": .028316846592,
		"in^3": 16387064e-12,
		gal: .003785411784
	}
};
var TEMPERATURES = [
	"C",
	"F",
	"K"
];
function convertUnit(category, value, from, to) {
	if (!Number.isFinite(value)) throw new Error("Value must be a finite number");
	if (category === "temperature") return convertTemperature(value, from, to);
	const table = UNIT_GROUPS[category];
	if (!(from in table) || !(to in table)) throw new Error("Unknown unit");
	return value * table[from] / table[to];
}
function convertTemperature(value, from, to) {
	const celsius = toCelsius(value, from);
	if (to === "C") return celsius;
	if (to === "F") return celsius * 9 / 5 + 32;
	if (to === "K") {
		const k = celsius + 273.15;
		if (k < 0) throw new Error("Temperature is below absolute zero");
		return k;
	}
	throw new Error("Unknown temperature unit");
}
function toCelsius(value, from) {
	if (from === "C") return value;
	if (from === "F") return (value - 32) * 5 / 9;
	if (from === "K") {
		if (value < 0) throw new Error("Kelvin cannot be negative");
		return value - 273.15;
	}
	throw new Error("Unknown temperature unit");
}
var DIGITS = "0123456789ABCDEF";
function convertBase(raw, from, to) {
	const text = raw.trim().toUpperCase();
	if (!text) throw new Error("Enter a value");
	const negative = text.startsWith("-");
	const body = negative ? text.slice(1) : text;
	if (!/^[0-9A-F]+$/.test(body)) throw new Error("Digits are not valid for this base");
	for (const char of body) {
		const digit = DIGITS.indexOf(char);
		if (digit < 0 || digit >= from) throw new Error(`Digit ${char} is not valid in base ${from}`);
	}
	if (body.length > 16) throw new Error("Value is too long");
	const magnitude = parseInt(body, from);
	if (!Number.isSafeInteger(magnitude)) throw new Error("Value does not fit an exact integer");
	const converted = magnitude.toString(to).toUpperCase();
	return negative ? `-${converted}` : converted;
}
var CATEGORIES = [
	"length",
	"mass",
	"time",
	"area",
	"volume",
	"temperature"
];
function UnitsPanel() {
	const [category, setCategory] = (0, import_react.useState)("length");
	const units = (0, import_react.useMemo)(() => category === "temperature" ? [...TEMPERATURES] : Object.keys(UNIT_GROUPS[category]), [category]);
	const [from, setFrom] = (0, import_react.useState)("km");
	const [to, setTo] = (0, import_react.useState)("m");
	const [value, setValue] = (0, import_react.useState)("1");
	const [baseIn, setBaseIn] = (0, import_react.useState)("1010");
	const [fromBase, setFromBase] = (0, import_react.useState)(2);
	const [toBase, setToBase] = (0, import_react.useState)(10);
	const activeFrom = units.includes(from) ? from : units[0];
	const activeTo = units.includes(to) ? to : units[1] ?? units[0];
	const converted = (0, import_react.useMemo)(() => {
		const n = Number(value);
		try {
			return {
				ok: true,
				text: formatNumber(convertUnit(category, n, activeFrom, activeTo), 10)
			};
		} catch (error) {
			return {
				ok: false,
				text: error instanceof Error ? error.message : "Invalid conversion"
			};
		}
	}, [
		activeFrom,
		activeTo,
		category,
		value
	]);
	const based = (0, import_react.useMemo)(() => {
		try {
			return {
				ok: true,
				text: convertBase(baseIn, fromBase, toBase)
			};
		} catch (error) {
			return {
				ok: false,
				text: error instanceof Error ? error.message : "Invalid base"
			};
		}
	}, [
		baseIn,
		fromBase,
		toBase
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Convert",
		title: "Units and number bases",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `min-h-11 rounded-xl border px-3 text-sm capitalize ${item === category ? "border-accent text-accent" : "border-line"}`,
					onClick: () => setCategory(item),
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Value", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value,
							onChange: (event) => setValue(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "From",
						value: activeFrom,
						options: units,
						onChange: setFrom
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "To",
						value: activeTo,
						options: units,
						onChange: setTo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `self-end font-mono text-lg ${converted.ok ? "text-fg" : "text-danger"}`,
						"aria-live": "polite",
						children: converted.text
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-semibold",
				children: "Integer bases"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Binary, octal, decimal, and hexadecimal. Fractional values are not converted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Value", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value: baseIn,
							onChange: (event) => setBaseIn(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "From base",
						value: String(fromBase),
						options: [
							"2",
							"8",
							"10",
							"16"
						],
						onChange: (v) => setFromBase(Number(v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "To base",
						value: String(toBase),
						options: [
							"2",
							"8",
							"10",
							"16"
						],
						onChange: (v) => setToBase(Number(v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `self-end font-mono text-lg ${based.ok ? "text-fg" : "text-danger"}`,
						children: based.text
					})
				]
			})
		]
	});
}
function Select({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: `${fieldClass} mt-1`,
			value,
			onChange: (event) => onChange(event.target.value),
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: option,
				children: option
			}, option))
		})]
	});
}
//#endregion
export { UnitsPanel as default };
