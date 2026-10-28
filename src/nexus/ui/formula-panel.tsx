import katex from "katex";
import { useMemo, useState } from "react";
import { evaluateExpression } from "../engine/evaluate";
import { FORMULA_CATEGORIES, LIBRARY, type FormulaCategory } from "../engine/formulas";
import { useNexus } from "../store";
import { fieldClass, Panel } from "./panel";

export default function FormulaPanel() {
  const angle = useNexus((s) => s.angle);
  const precision = useNexus((s) => s.precision);
  const bookmarks = useNexus((s) => s.bookmarks);
  const formulas = useNexus((s) => s.formulas);
  const patch = useNexus((s) => s.patch);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FormulaCategory | "All" | "Saved">("All");
  const [name, setName] = useState("");
  const [expression, setExpression] = useState("m*a");
  const [vars, setVars] = useState("m,a");

  const custom = formulas.filter((item) => {
    if (category !== "All" && category !== "Saved") return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${item.name} ${item.expression}`.toLowerCase().includes(q);
  });
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY.filter((item) => {
      if (category === "Saved") return bookmarks.includes(item.id);
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      return `${item.name} ${item.category} ${item.about}`.toLowerCase().includes(q);
    });
  }, [bookmarks, category, query]);

  return (
    <Panel eyebrow="Library" title="Formulas">
      <input className={fieldClass} aria-label="Search formulas" placeholder="Search algebra, physics, engineering…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(["All", "Saved", ...FORMULA_CATEGORIES] as const).map((item) => (
          <button key={item} type="button" className={`min-h-11 shrink-0 rounded-xl border px-3 text-sm ${category === item ? "border-accent text-accent" : "border-line"}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {visible.length === 0 && custom.length === 0 ? <p className="text-sm text-muted">No formulas match.</p> : null}
        {visible.map((item) => (
          <FormulaCard
            key={item.id}
            bookmarked={bookmarks.includes(item.id)}
            onBookmark={() =>
              patch({
                bookmarks: bookmarks.includes(item.id) ? bookmarks.filter((id) => id !== item.id) : [...bookmarks, item.id],
              })
            }
            name={item.name}
            category={item.category}
            latex={item.latex}
            about={item.about}
            note={item.note}
            expression={item.expression}
            variables={item.variables}
            angle={angle}
            precision={precision}
          />
        ))}
        {custom.map((item) => (
          <FormulaCard
            key={item.id}
            bookmarked={bookmarks.includes(item.id)}
            onBookmark={() =>
              patch({
                bookmarks: bookmarks.includes(item.id) ? bookmarks.filter((id) => id !== item.id) : [...bookmarks, item.id],
              })
            }
            name={item.name}
            category="Saved"
            about={item.note || "Custom formula stored on this device."}
            expression={item.expression}
            variables={item.variables.map((symbol) => ({ symbol, label: symbol }))}
            angle={angle}
            precision={precision}
            onDelete={() => patch({ formulas: formulas.filter((formula) => formula.id !== item.id) })}
          />
        ))}
      </div>
      <form
        className="mt-6 grid gap-2 border-t border-line pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          const variables = vars
            .split(/[\s,]+/)
            .map((part) => part.trim())
            .filter(Boolean);
          if (!name.trim() || !expression.trim()) return;
          patch({
            formulas: [
              ...formulas,
              { id: `c-${Date.now()}`, name: name.trim(), expression: expression.trim(), variables, note: "Custom" },
            ],
          });
          setName("");
        }}
      >
        <h3 className="text-sm font-semibold">Save a formula</h3>
        <input className={fieldClass} aria-label="Formula name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className={`${fieldClass} font-mono`} aria-label="Formula expression" placeholder="Expression" value={expression} onChange={(event) => setExpression(event.target.value)} />
        <input className={fieldClass} aria-label="Formula variables" placeholder="Variables, comma separated" value={vars} onChange={(event) => setVars(event.target.value)} />
        <button type="submit" className="min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg">
          Save on this device
        </button>
      </form>
    </Panel>
  );
}

function FormulaCard({
  name,
  category,
  latex,
  about,
  note,
  expression,
  variables,
  angle,
  precision,
  bookmarked,
  onBookmark,
  onDelete,
}: {
  name: string;
  category: string;
  latex?: string;
  about: string;
  note?: string;
  expression?: string;
  variables: { symbol: string; label: string }[];
  angle: "deg" | "rad";
  precision: number;
  bookmarked: boolean;
  onBookmark: () => void;
  onDelete?: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const html = latex ? katex.renderToString(latex, { throwOnError: false, displayMode: true }) : "";
  return (
    <article className="rounded-xl border border-line p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-accent uppercase">{category}</p>
          <h3 className="font-semibold">{name}</h3>
        </div>
        <div className="flex gap-2">
          <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={onBookmark}>
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          {onDelete ? (
            <button type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={onDelete}>
              Delete
            </button>
          ) : null}
        </div>
      </div>
      {html ? <div className="mt-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} /> : null}
      <p className="mt-2 text-sm text-muted">{about}</p>
      {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
      {expression && variables.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {variables.map((variable) => (
            <label key={variable.symbol} className="text-xs text-muted">
              {variable.label}
              <input
                className={`${fieldClass} mt-1 font-mono`}
                value={values[variable.symbol] ?? ""}
                onChange={(event) => setValues({ ...values, [variable.symbol]: event.target.value })}
              />
            </label>
          ))}
          <button
            type="button"
            className="min-h-11 self-end rounded-xl border border-line px-3 text-sm"
            onClick={() => {
              const symbols: Record<string, number> = {};
              for (const variable of variables) {
                const n = Number(values[variable.symbol]);
                if (!Number.isFinite(n)) {
                  setResult(`Enter a number for ${variable.label}.`);
                  return;
                }
                symbols[variable.symbol] = n;
              }
              const evaluated = evaluateExpression(expression, { angle, precision, symbols });
              setResult(evaluated.ok ? evaluated.formatted : evaluated.error);
            }}
          >
            Substitute
          </button>
          {result ? <p className="self-end font-mono text-sm">{result}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
