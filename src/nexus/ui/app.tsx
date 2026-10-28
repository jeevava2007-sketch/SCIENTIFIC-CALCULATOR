import { Command, Focus, Moon, Settings2, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { MODES, useNexus, type Mode } from "../store";
import { sceneBus } from "../scene-bus";
import { Background } from "./background";
import { Calculator } from "./calculator";
import { Intro } from "./intro";
import { parseBackup } from "../engine/backup";
import { fieldClass } from "./panel";

const GraphPanel = lazy(() => import("./graph-panel"));
const SolverPanel = lazy(() => import("./solver-panel"));
const MatrixPanel = lazy(() => import("./matrix-panel"));
const StatsPanel = lazy(() => import("./stats-panel"));
const UnitsPanel = lazy(() => import("./units-panel"));
const CalculusPanel = lazy(() => import("./calculus-panel"));
const FormulaPanel = lazy(() => import("./formula-panel"));
const HistoryPanel = lazy(() => import("./history-panel"));
const InsightsPanel = lazy(() => import("./insights-panel"));

export function NexusApp() {
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
  const [online, setOnline] = useState(true);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void useNexus.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    sceneBus.theme = theme;
    sceneBus.mode = mode;
    sceneBus.focus = focus;
    sceneBus.reduced = motionSetting === "reduced" || reduce === true || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [focus, mode, motionSetting, reduce, theme]);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
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

  return (
    <div className="relative min-h-screen">
      <Background />
      <Intro />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-3 py-3 sm:px-5">
        <header className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4">
          <div>
            <p className="text-lg font-semibold tracking-[0.28em]">NEXUS</p>
            <p className="text-xs text-muted">{online ? "Ready on this device" : "Offline — calculations still run here"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => dispatch({ type: "angle", angle: angle === "deg" ? "rad" : "deg" })}>
              {angle === "deg" ? "DEG" : "RAD"}
            </button>
            <label className="text-xs text-muted">
              <span className="sr-only">Precision</span>
              <select className="min-h-11 rounded-xl border border-line bg-transparent px-2 text-fg" aria-label="Precision" value={precision} onChange={(event) => dispatch({ type: "precision", precision: Number(event.target.value) })}>
                {[6, 8, 10, 12, 14].map((value) => (
                  <option key={value} value={value}>
                    {value} digits
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Toggle theme" onClick={() => patch({ theme: theme === "dark" ? "light" : "dark" })}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button type="button" className={`grid size-11 place-items-center rounded-xl border ${focus ? "border-accent text-accent" : "border-line"}`} aria-pressed={focus} aria-label="Focus mode" onClick={() => patch({ focus: !focus })}>
              <Focus className="size-4" />
            </button>
            <button type="button" className="grid size-11 place-items-center rounded-xl border border-line" aria-label="Settings" onClick={() => patch({ settingsOpen: true })}>
              <Settings2 className="size-4" />
            </button>
            <button type="button" className="hidden min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm sm:flex" onClick={() => patch({ paletteOpen: true })}>
              <Command className="size-4" />
              Search
            </button>
          </div>
        </header>
        <div className={`mt-3 grid flex-1 gap-3 ${focus ? "" : "lg:grid-cols-[220px_minmax(0,1fr)]"}`}>
          {focus ? null : (
            <nav className="glass flex gap-2 overflow-x-auto rounded-2xl p-2 lg:flex-col" aria-label="Tools">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={mode === item.id ? "page" : undefined}
                  className={`min-h-11 shrink-0 rounded-xl px-3 text-left text-sm ${mode === item.id ? "bg-accent text-bg" : "text-fg"}`}
                  onClick={() => setMode(item.id)}
                >
                  <span className="block font-medium">{item.label}</span>
                  <span className={`block text-xs ${mode === item.id ? "text-bg/80" : "text-muted"}`}>{item.hint}</span>
                </button>
              ))}
            </nav>
          )}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Suspense fallback={<p className="glass rounded-2xl p-6 text-sm text-muted">Loading tool…</p>}>
                  <Tool mode={mode} />
                </Suspense>
              </motion.div>
            </AnimatePresence>
            <p className="mt-3 px-1 text-xs text-muted">
              Guest mode keeps history, formulas, and settings in local storage on this device. Expressions are not uploaded.
            </p>
          </main>
        </div>
      </div>
      {paletteOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-start justify-center bg-bg/70 p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <div className="glass w-full max-w-lg rounded-2xl p-3">
            <input
              autoFocus
              className={fieldClass}
              placeholder="Jump to a tool"
              aria-label="Command search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") patch({ paletteOpen: false });
              }}
            />
            <div className="mt-2 max-h-80 overflow-auto">
              {commands.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-bg/40"
                  onClick={() => {
                    setMode(item.id);
                    patch({ paletteOpen: false });
                    setQuery("");
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-muted">{item.hint}</span>
                </button>
              ))}
              <button type="button" className="min-h-11 w-full rounded-xl px-3 text-left text-sm" onClick={() => patch({ theme: theme === "dark" ? "light" : "dark", paletteOpen: false })}>
                Toggle theme
              </button>
              <button type="button" className="min-h-11 w-full rounded-xl px-3 text-left text-sm" onClick={() => patch({ focus: !focus, paletteOpen: false })}>
                Toggle focus mode
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {settingsOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="glass max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl p-4">
            <h2 id="settings-title" className="text-lg font-semibold">
              Settings
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center justify-between gap-3">
                Graphics
                <select className="min-h-11 rounded-xl border border-line bg-transparent px-2" value={graphics} onChange={(event) => patch({ graphics: event.target.value as typeof graphics })}>
                  <option value="auto">Auto</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                  <option value="off">Off</option>
                </select>
              </label>
              <label className="flex items-center justify-between gap-3">
                Motion
                <select className="min-h-11 rounded-xl border border-line bg-transparent px-2" value={motionSetting} onChange={(event) => patch({ motion: event.target.value as "full" | "reduced" })}>
                  <option value="full">Full</option>
                  <option value="reduced">Reduced</option>
                </select>
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Play intro</span>
                <input type="checkbox" checked={intro} onChange={(event) => patch({ intro: event.target.checked })} />
              </label>
              <p className="text-muted">
                Reduced motion from the operating system is always respected. The intro never covers the keypad. Turning graphics off leaves every calculation available.
              </p>
              <p className="text-muted">Keyboard: Ctrl or Cmd K opens this search. Enter evaluates. Escape clears the expression.</p>
              {notice ? <p>{notice}</p> : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="min-h-11 rounded-xl border border-line px-3"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ version: 1, history, formulas, bookmarks }, null, 2)], { type: "application/json" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "nexus-backup.json";
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }}
                >
                  Export data
                </button>
                <label className="min-h-11 cursor-pointer rounded-xl border border-line px-3 py-2">
                  Import data
                  <input
                    type="file"
                    accept="application/json"
                    className="sr-only"
                    onChange={async (event) => {
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
                    }}
                  />
                </label>
              </div>
            </div>
            <button type="button" className="mt-4 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg" onClick={() => patch({ settingsOpen: false })}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Tool({ mode }: { mode: Mode }) {
  if (mode === "calc") return <Calculator />;
  if (mode === "graph") return <GraphPanel />;
  if (mode === "solve") return <SolverPanel />;
  if (mode === "matrix") return <MatrixPanel />;
  if (mode === "stats") return <StatsPanel />;
  if (mode === "units") return <UnitsPanel />;
  if (mode === "calculus") return <CalculusPanel />;
  if (mode === "formulas") return <FormulaPanel />;
  if (mode === "history") return <HistoryPanel />;
  return <InsightsPanel />;
}
