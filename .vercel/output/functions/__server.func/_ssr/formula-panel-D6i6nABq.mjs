import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useNexus, c as evaluateExpression, i as fieldClass, r as Panel } from "./routes-l7g4NdBi.mjs";
import { t as katex } from "../_libs/katex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formula-panel-D6i6nABq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FORMULA_CATEGORIES = [
	"Algebra",
	"Geometry",
	"Trigonometry",
	"Calculus",
	"Statistics",
	"Physics",
	"Engineering"
];
var LIBRARY = [
	{
		id: "quadratic",
		category: "Algebra",
		name: "Quadratic formula",
		latex: "x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
		about: "Roots of ax² + bx + c = 0. Use the solver for evaluated roots and the discriminant.",
		variables: [],
		note: "Shown as a reference. The equation solver computes the roots and verifies them."
	},
	{
		id: "slope",
		category: "Algebra",
		name: "Slope",
		latex: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}",
		about: "Slope between two points.",
		expression: "(y2-y1)/(x2-x1)",
		variables: [
			{
				symbol: "y2",
				label: "y₂"
			},
			{
				symbol: "y1",
				label: "y₁"
			},
			{
				symbol: "x2",
				label: "x₂"
			},
			{
				symbol: "x1",
				label: "x₁"
			}
		]
	},
	{
		id: "circle-area",
		category: "Geometry",
		name: "Circle area",
		latex: "A = \\pi r^2",
		about: "Area of a circle from its radius.",
		expression: "pi*r^2",
		variables: [{
			symbol: "r",
			label: "radius"
		}]
	},
	{
		id: "sphere-volume",
		category: "Geometry",
		name: "Sphere volume",
		latex: "V = \\dfrac{4}{3}\\pi r^3",
		about: "Volume of a sphere.",
		expression: "(4/3)*pi*r^3",
		variables: [{
			symbol: "r",
			label: "radius"
		}]
	},
	{
		id: "pythagoras",
		category: "Geometry",
		name: "Pythagorean theorem",
		latex: "c = \\sqrt{a^2 + b^2}",
		about: "Hypotenuse of a right triangle.",
		expression: "sqrt(a^2+b^2)",
		variables: [{
			symbol: "a",
			label: "leg a"
		}, {
			symbol: "b",
			label: "leg b"
		}]
	},
	{
		id: "heron",
		category: "Geometry",
		name: "Heron's formula",
		latex: "A = \\sqrt{s(s-a)(s-b)(s-c)},\\ s=\\dfrac{a+b+c}{2}",
		about: "Triangle area from three side lengths.",
		expression: "sqrt(((a+b+c)/2)*(((a+b+c)/2)-a)*(((a+b+c)/2)-b)*(((a+b+c)/2)-c))",
		variables: [
			{
				symbol: "a",
				label: "side a"
			},
			{
				symbol: "b",
				label: "side b"
			},
			{
				symbol: "c",
				label: "side c"
			}
		]
	},
	{
		id: "law-cos",
		category: "Trigonometry",
		name: "Law of cosines",
		latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
		about: "Third side from two sides and the included angle. Angle mode follows the calculator setting.",
		expression: "sqrt(a^2+b^2-2*a*b*cos(C))",
		variables: [
			{
				symbol: "a",
				label: "side a"
			},
			{
				symbol: "b",
				label: "side b"
			},
			{
				symbol: "C",
				label: "included angle"
			}
		]
	},
	{
		id: "identity-sin",
		category: "Trigonometry",
		name: "Pythagorean identity",
		latex: "\\sin^2\\theta + \\cos^2\\theta = 1",
		about: "Reference identity. It is not a substitution formula.",
		variables: []
	},
	{
		id: "deriv-power",
		category: "Calculus",
		name: "Power rule",
		latex: "\\dfrac{d}{dx} x^n = n x^{n-1}",
		about: "Reference rule. Use the calculus workspace for a numerical derivative of a specific function.",
		variables: [],
		note: "NEXUS does not produce symbolic derivatives."
	},
	{
		id: "fund-theorem",
		category: "Calculus",
		name: "Fundamental theorem (reference)",
		latex: "\\int_a^b f'(x)\\,dx = f(b) - f(a)",
		about: "Reference statement. Numerical integrals in the calculus workspace are approximations.",
		variables: []
	},
	{
		id: "mean",
		category: "Statistics",
		name: "Arithmetic mean",
		latex: "\\bar{x} = \\dfrac{1}{n}\\sum x_i",
		about: "Use the statistics workspace for a full data set. This form is for a short explicit sum.",
		expression: "(x1+x2+x3)/3",
		variables: [
			{
				symbol: "x1",
				label: "x₁"
			},
			{
				symbol: "x2",
				label: "x₂"
			},
			{
				symbol: "x3",
				label: "x₃"
			}
		],
		note: "Fixed at three values. Longer lists belong in Statistics."
	},
	{
		id: "zscore",
		category: "Statistics",
		name: "z-score",
		latex: "z = \\dfrac{x - \\mu}{\\sigma}",
		about: "Standard score. Sigma is a population or sample standard deviation you supply.",
		expression: "(x-mu)/sigma",
		variables: [
			{
				symbol: "x",
				label: "value"
			},
			{
				symbol: "mu",
				label: "mean"
			},
			{
				symbol: "sigma",
				label: "standard deviation"
			}
		]
	},
	{
		id: "newton2",
		category: "Physics",
		name: "Newton's second law",
		latex: "F = ma",
		about: "Net force from mass and acceleration.",
		expression: "m*a",
		variables: [{
			symbol: "m",
			label: "mass"
		}, {
			symbol: "a",
			label: "acceleration"
		}]
	},
	{
		id: "kinematic",
		category: "Physics",
		name: "Kinematic energy relation",
		latex: "v^2 = u^2 + 2as",
		about: "Final speed magnitude from initial speed, acceleration, and displacement, when the expression under the root is non-negative.",
		expression: "sqrt(u^2+2*a*s)",
		variables: [
			{
				symbol: "u",
				label: "initial speed"
			},
			{
				symbol: "a",
				label: "acceleration"
			},
			{
				symbol: "s",
				label: "displacement"
			}
		]
	},
	{
		id: "coulomb",
		category: "Physics",
		name: "Coulomb's law (magnitude)",
		latex: "F = k\\dfrac{|q_1 q_2|}{r^2}",
		about: "Force magnitude. k is 8.9875517923×10⁹ in SI when charges are in coulombs and r in metres.",
		expression: "k*abs(q1*q2)/r^2",
		variables: [
			{
				symbol: "k",
				label: "Coulomb constant"
			},
			{
				symbol: "q1",
				label: "charge 1"
			},
			{
				symbol: "q2",
				label: "charge 2"
			},
			{
				symbol: "r",
				label: "distance"
			}
		]
	},
	{
		id: "ohms",
		category: "Engineering",
		name: "Ohm's law",
		latex: "V = IR",
		about: "Voltage from current and resistance.",
		expression: "I*R",
		variables: [{
			symbol: "I",
			label: "current"
		}, {
			symbol: "R",
			label: "resistance"
		}]
	},
	{
		id: "power",
		category: "Engineering",
		name: "Electrical power",
		latex: "P = IV",
		about: "Power from current and voltage.",
		expression: "I*V",
		variables: [{
			symbol: "I",
			label: "current"
		}, {
			symbol: "V",
			label: "voltage"
		}]
	},
	{
		id: "stress",
		category: "Engineering",
		name: "Axial stress",
		latex: "\\sigma = \\dfrac{F}{A}",
		about: "Average normal stress.",
		expression: "F/A",
		variables: [{
			symbol: "F",
			label: "force"
		}, {
			symbol: "A",
			label: "area"
		}]
	}
];
function FormulaPanel() {
	const angle = useNexus((s) => s.angle);
	const precision = useNexus((s) => s.precision);
	const bookmarks = useNexus((s) => s.bookmarks);
	const formulas = useNexus((s) => s.formulas);
	const patch = useNexus((s) => s.patch);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All");
	const [name, setName] = (0, import_react.useState)("");
	const [expression, setExpression] = (0, import_react.useState)("m*a");
	const [vars, setVars] = (0, import_react.useState)("m,a");
	const custom = formulas.filter((item) => {
		if (category !== "All" && category !== "Saved") return false;
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return `${item.name} ${item.expression}`.toLowerCase().includes(q);
	});
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return LIBRARY.filter((item) => {
			if (category === "Saved") return bookmarks.includes(item.id);
			if (category !== "All" && item.category !== category) return false;
			if (!q) return true;
			return `${item.name} ${item.category} ${item.about}`.toLowerCase().includes(q);
		});
	}, [
		bookmarks,
		category,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Library",
		title: "Formulas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				"aria-label": "Search formulas",
				placeholder: "Search algebra, physics, engineering…",
				value: query,
				onChange: (event) => setQuery(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto pb-1",
				children: [
					"All",
					"Saved",
					...FORMULA_CATEGORIES
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `min-h-11 shrink-0 rounded-xl border px-3 text-sm ${category === item ? "border-accent text-accent" : "border-line"}`,
					onClick: () => setCategory(item),
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					visible.length === 0 && custom.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No formulas match."
					}) : null,
					visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormulaCard, {
						bookmarked: bookmarks.includes(item.id),
						onBookmark: () => patch({ bookmarks: bookmarks.includes(item.id) ? bookmarks.filter((id) => id !== item.id) : [...bookmarks, item.id] }),
						name: item.name,
						category: item.category,
						latex: item.latex,
						about: item.about,
						note: item.note,
						expression: item.expression,
						variables: item.variables,
						angle,
						precision
					}, item.id)),
					custom.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormulaCard, {
						bookmarked: bookmarks.includes(item.id),
						onBookmark: () => patch({ bookmarks: bookmarks.includes(item.id) ? bookmarks.filter((id) => id !== item.id) : [...bookmarks, item.id] }),
						name: item.name,
						category: "Saved",
						about: item.note || "Custom formula stored on this device.",
						expression: item.expression,
						variables: item.variables.map((symbol) => ({
							symbol,
							label: symbol
						})),
						angle,
						precision,
						onDelete: () => patch({ formulas: formulas.filter((formula) => formula.id !== item.id) })
					}, item.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-2 border-t border-line pt-4",
				onSubmit: (event) => {
					event.preventDefault();
					const variables = vars.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean);
					if (!name.trim() || !expression.trim()) return;
					patch({ formulas: [...formulas, {
						id: `c-${Date.now()}`,
						name: name.trim(),
						expression: expression.trim(),
						variables,
						note: "Custom"
					}] });
					setName("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Save a formula"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						"aria-label": "Formula name",
						placeholder: "Name",
						value: name,
						onChange: (event) => setName(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} font-mono`,
						"aria-label": "Formula expression",
						placeholder: "Expression",
						value: expression,
						onChange: (event) => setExpression(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						"aria-label": "Formula variables",
						placeholder: "Variables, comma separated",
						value: vars,
						onChange: (event) => setVars(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg",
						children: "Save on this device"
					})
				]
			})
		]
	});
}
function FormulaCard({ name, category, latex, about, note, expression, variables, angle, precision, bookmarked, onBookmark, onDelete }) {
	const [values, setValues] = (0, import_react.useState)({});
	const [result, setResult] = (0, import_react.useState)(null);
	const html = latex ? katex.renderToString(latex, {
		throwOnError: false,
		displayMode: true
	}) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.16em] text-accent uppercase",
					children: category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl border border-line px-3 text-sm",
						onClick: onBookmark,
						children: bookmarked ? "Bookmarked" : "Bookmark"
					}), onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-xl border border-line px-3 text-sm",
						onClick: onDelete,
						children: "Delete"
					}) : null]
				})]
			}),
			html ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 overflow-x-auto",
				dangerouslySetInnerHTML: { __html: html }
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: about
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: note
			}) : null,
			expression && variables.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [
					variables.map((variable) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: [variable.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-1 font-mono`,
							value: values[variable.symbol] ?? "",
							onChange: (event) => setValues({
								...values,
								[variable.symbol]: event.target.value
							})
						})]
					}, variable.symbol)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 self-end rounded-xl border border-line px-3 text-sm",
						onClick: () => {
							const symbols = {};
							for (const variable of variables) {
								const n = Number(values[variable.symbol]);
								if (!Number.isFinite(n)) {
									setResult(`Enter a number for ${variable.label}.`);
									return;
								}
								symbols[variable.symbol] = n;
							}
							const evaluated = evaluateExpression(expression, {
								angle,
								precision,
								symbols
							});
							setResult(evaluated.ok ? evaluated.formatted : evaluated.error);
						},
						children: "Substitute"
					}),
					result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "self-end font-mono text-sm",
						children: result
					}) : null
				]
			}) : null
		]
	});
}
//#endregion
export { FormulaPanel as default };
