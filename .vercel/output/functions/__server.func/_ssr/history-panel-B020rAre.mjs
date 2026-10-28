import { i as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@react-three/fiber+[...].mjs";
import { a as useNexus, i as fieldClass, n as parseBackup, r as Panel } from "./routes-l7g4NdBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-panel-B020rAre.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPanel() {
	const history = useNexus((s) => s.history);
	const dispatch = useNexus((s) => s.dispatch);
	const setMode = useNexus((s) => s.setMode);
	const removeHistory = useNexus((s) => s.removeHistory);
	const clearHistory = useNexus((s) => s.clearHistory);
	const noteHistory = useNexus((s) => s.noteHistory);
	const formulas = useNexus((s) => s.formulas);
	const bookmarks = useNexus((s) => s.bookmarks);
	const importRecords = useNexus((s) => s.importRecords);
	const [query, setQuery] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return history.filter((item) => !q || `${item.expression} ${item.result} ${item.note ?? ""}`.toLowerCase().includes(q));
	}, [history, query]);
	function exportJson() {
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
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		eyebrow: "History",
		title: "On this device",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line px-3 text-sm",
					onClick: exportJson,
					children: "Export"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "min-h-11 cursor-pointer rounded-xl border border-line px-3 py-2 text-sm",
					children: ["Import", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
								setMessage(`Imported ${parsed.history.length} calculations.`);
							} catch {
								setMessage("That file is not a NEXUS backup.");
							}
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-xl border border-line px-3 text-sm",
					onClick: () => setConfirm(true),
					children: "Clear"
				})
			]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				"aria-label": "Search history",
				placeholder: "Search expressions or results",
				value: query,
				onChange: (event) => setQuery(event.target.value)
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No calculations yet. Press = on the keypad and they will show up here."
				}) : null, rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "w-full text-left font-mono text-sm",
							onClick: () => {
								dispatch({
									type: "load",
									expression: item.expression
								});
								setMode("calc");
							},
							children: [
								item.expression,
								" = ",
								item.result
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: new Date(item.at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${fieldClass} mt-2`,
							"aria-label": `Note for ${item.expression}`,
							placeholder: "Add a note",
							value: item.note ?? "",
							onChange: (event) => noteHistory(item.id, event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 min-h-11 rounded-xl border border-line px-3 text-sm",
							onClick: () => removeHistory(item.id),
							children: "Delete"
						})
					]
				}, item.id))]
			}),
			confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "clear-title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass w-full max-w-sm rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							id: "clear-title",
							className: "text-lg font-semibold",
							children: "Clear history?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "This removes saved calculations on this device. It does not change formulas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl border border-line px-3",
								onClick: () => setConfirm(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 rounded-xl bg-danger px-3 text-bg",
								onClick: () => {
									clearHistory();
									setConfirm(false);
								},
								children: "Clear history"
							})]
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { HistoryPanel as default };
