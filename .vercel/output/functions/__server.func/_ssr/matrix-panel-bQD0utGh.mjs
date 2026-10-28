import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { i as fieldClass, r as Panel } from "./routes-l7g4NdBi.mjs";
import { a as dot, c as magnitude, f as subtract, i as determinant, l as multiply, m as transpose, n as addVectors, o as formatMatrix, p as subtractVectors, r as cross, s as inverse, t as add, u as parseGrid } from "./matrix-DQ97hqo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matrix-panel-bQD0utGh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MatrixPanel() {
	const [a, setA] = (0, import_react.useState)("1 2\n3 4");
	const [b, setB] = (0, import_react.useState)("5 6\n7 8");
	const [out, setOut] = (0, import_react.useState)("Results appear here.");
	const [va, setVa] = (0, import_react.useState)("1, 0, 0");
	const [vb, setVb] = (0, import_react.useState)("0, 1, 0");
	function run(op) {
		try {
			const A = parseGrid(a);
			const B = op === "det" || op === "inv" || op === "transpose" ? A : parseGrid(b);
			if (op === "add") setOut(formatMatrix(add(A, B)));
			if (op === "sub") setOut(formatMatrix(subtract(A, B)));
			if (op === "mul") setOut(formatMatrix(multiply(A, B)));
			if (op === "det") setOut(String(determinant(A)));
			if (op === "inv") setOut(formatMatrix(inverse(A)));
			if (op === "transpose") setOut(formatMatrix(transpose(A)));
		} catch (error) {
			setOut(error instanceof Error ? error.message : "Invalid matrix");
		}
	}
	function runVec(op) {
		try {
			const A = parseGrid(va.replace(/,/g, " "));
			const B = parseGrid(vb.replace(/,/g, " "));
			const u = A[0];
			const v = B[0];
			if (op === "add") setOut(addVectors(u, v).join(", "));
			if (op === "sub") setOut(subtractVectors(u, v).join(", "));
			if (op === "dot") setOut(String(dot(u, v)));
			if (op === "cross") setOut(cross(u, v).join(", "));
			if (op === "mag") setOut(`|u| = ${magnitude(u)}, |v| = ${magnitude(v)}`);
		} catch (error) {
			setOut(error instanceof Error ? error.message : "Invalid vector");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "Linear algebra",
		title: "Matrices and vectors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Matrix A", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} mt-1 min-h-28 font-mono`,
						value: a,
						onChange: (event) => setA(event.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Matrix B", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} mt-1 min-h-28 font-mono`,
						value: b,
						onChange: (event) => setB(event.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					["add", "A + B"],
					["sub", "A − B"],
					["mul", "A × B"],
					["det", "det A"],
					["inv", "A inverse"],
					["transpose", "A transpose"]
				].map(([op, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line px-3 text-sm",
					onClick: () => run(op),
					children: label
				}, op))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Vector u", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1 font-mono`,
						value: va,
						onChange: (event) => setVa(event.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Vector v", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: `${fieldClass} mt-1 font-mono`,
						value: vb,
						onChange: (event) => setVb(event.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					["add", "u + v"],
					["sub", "u − v"],
					["dot", "Dot"],
					["cross", "Cross"],
					["mag", "Magnitude"]
				].map(([op, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line px-3 text-sm",
					onClick: () => runVec(op),
					children: label
				}, op))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 overflow-auto rounded-xl border border-line bg-bg/40 p-3 font-mono text-sm",
				"aria-live": "polite",
				children: out
			})
		]
	});
}
//#endregion
export { MatrixPanel as default };
