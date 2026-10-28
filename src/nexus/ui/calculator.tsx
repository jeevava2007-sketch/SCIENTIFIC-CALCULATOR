import { Copy } from "lucide-react";
import { useState } from "react";
import { KEYS } from "../engine/calc";
import { useNexus } from "../store";

export function Calculator() {
  const expression = useNexus((s) => s.expression);
  const resultText = useNexus((s) => s.resultText);
  const error = useNexus((s) => s.error);
  const memory = useNexus((s) => s.memory);
  const angle = useNexus((s) => s.angle);
  const dispatch = useNexus((s) => s.dispatch);
  const [second, setSecond] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyResult() {
    const text = error ? "" : resultText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">Scientific</p>
        <p className="text-xs text-muted">
          {angle === "deg" ? "Degrees" : "Radians"}
          {memory !== 0 ? " · M" : ""}
        </p>
      </div>
      <label className="block">
        <span className="sr-only">Expression</span>
        <input
          value={expression}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="sin(30)+2^3"
          aria-label="Expression"
          className="w-full bg-transparent font-mono text-lg text-fg outline-none placeholder:text-muted"
          onChange={(event) => dispatch({ type: "load", expression: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              dispatch({ type: "equals" });
            } else if (event.key === "Escape") {
              event.preventDefault();
              dispatch({ type: "ac" });
            }
          }}
        />
      </label>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className={`min-h-8 flex-1 text-right font-mono text-4xl tracking-tight sm:text-5xl ${error ? "text-danger text-xl sm:text-2xl" : "text-fg"}`} role="status" aria-live="polite">
          {error ?? resultText}
        </p>
        <button type="button" className="mb-1 grid size-11 place-items-center rounded-xl border border-line text-muted" aria-label="Copy result" onClick={() => void copyResult()}>
          <Copy className="size-4" />
        </button>
      </div>
      {copied ? <p className="text-right text-xs text-ok">Copied</p> : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          aria-pressed={second}
          className={`min-h-11 rounded-xl border px-3 text-sm ${second ? "border-accent text-accent" : "border-line text-muted"}`}
          onClick={() => setSecond((value) => !value)}
        >
          2nd
        </button>
        <p className="self-center text-xs text-muted">EE inserts ×10^( so it never types Euler’s e. % follows calculator percent: 200+10% = 220.</p>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-1.5">
        {KEYS.map((key) => {
          const face = second && key.second ? key.second : key;
          const variant =
            key.variant === "eq"
              ? "bg-accent text-bg font-semibold"
              : key.variant === "fn"
                ? "border border-line text-accent"
                : key.variant === "mem"
                  ? "border border-line text-muted text-xs"
                  : key.variant === "op"
                    ? "border border-line text-fg"
                    : "border border-line bg-bg/40 text-fg";
          return (
            <button
              key={key.id}
              type="button"
              aria-label={face.aria}
              className={`min-h-11 rounded-xl text-sm ${variant}`}
              onClick={() => dispatch(face.action)}
            >
              {face.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
