import { useMemo, useState } from "react";
import { parseBackup } from "../engine/backup";
import { useNexus } from "../store";
import { fieldClass, Panel } from "./panel";

export default function HistoryPanel() {
  const history = useNexus((s) => s.history);
  const dispatch = useNexus((s) => s.dispatch);
  const setMode = useNexus((s) => s.setMode);
  const removeHistory = useNexus((s) => s.removeHistory);
  const clearHistory = useNexus((s) => s.clearHistory);
  const noteHistory = useNexus((s) => s.noteHistory);
  const formulas = useNexus((s) => s.formulas);
  const bookmarks = useNexus((s) => s.bookmarks);
  const importRecords = useNexus((s) => s.importRecords);
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((item) => !q || `${item.expression} ${item.result} ${item.note ?? ""}`.toLowerCase().includes(q));
  }, [history, query]);

  function exportJson() {
    const blob = new Blob(
      [JSON.stringify({ version: 1, history, formulas, bookmarks }, null, 2)],
      { type: "application/json" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nexus-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <Panel
      eyebrow="History"
      title="On this device"
      actions={
        <div className="flex flex-wrap gap-2">
          <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={exportJson}>
            Export
          </button>
          <label className="min-h-11 cursor-pointer rounded-xl border border-line px-3 py-2 text-sm">
            Import
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
                  setMessage(`Imported ${parsed.history.length} calculations.`);
                } catch {
                  setMessage("That file is not a NEXUS backup.");
                }
              }}
            />
          </label>
          <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => setConfirm(true)}>
            Clear
          </button>
        </div>
      }
    >
      <input className={fieldClass} aria-label="Search history" placeholder="Search expressions or results" value={query} onChange={(event) => setQuery(event.target.value)} />
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
      <div className="mt-3 space-y-2">
        {rows.length === 0 ? <p className="text-sm text-muted">No calculations yet. Press = on the keypad and they will show up here.</p> : null}
        {rows.map((item) => (
          <article key={item.id} className="rounded-xl border border-line p-3">
            <button
              type="button"
              className="w-full text-left font-mono text-sm"
              onClick={() => {
                dispatch({ type: "load", expression: item.expression });
                setMode("calc");
              }}
            >
              {item.expression} = {item.result}
            </button>
            <p className="mt-1 text-xs text-muted">{new Date(item.at).toLocaleString()}</p>
            <input
              className={`${fieldClass} mt-2`}
              aria-label={`Note for ${item.expression}`}
              placeholder="Add a note"
              value={item.note ?? ""}
              onChange={(event) => noteHistory(item.id, event.target.value)}
            />
            <button type="button" className="mt-2 min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => removeHistory(item.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
      {confirm ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-title">
          <div className="glass w-full max-w-sm rounded-2xl p-4">
            <h3 id="clear-title" className="text-lg font-semibold">
              Clear history?
            </h3>
            <p className="mt-1 text-sm text-muted">This removes saved calculations on this device. It does not change formulas.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="min-h-11 rounded-xl border border-line px-3" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl bg-danger px-3 text-bg"
                onClick={() => {
                  clearHistory();
                  setConfirm(false);
                }}
              >
                Clear history
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
