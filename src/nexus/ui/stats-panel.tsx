import { useMemo, useState } from "react";
import { formatNumber } from "../engine/evaluate";
import { binomialPmf, normalPdf, parseDataset, poissonPmf, summarize } from "../engine/stats";
import { fieldClass, Panel } from "./panel";

export default function StatsPanel() {
  const [text, setText] = useState("");
  const [spread, setSpread] = useState<"sample" | "population">("sample");
  const [trials, setTrials] = useState("10");
  const [successes, setSuccesses] = useState("3");
  const [p, setP] = useState("0.5");
  const [lambda, setLambda] = useState("2");
  const [k, setK] = useState("1");
  const [zx, setZx] = useState("0");
  const [zmu, setZmu] = useState("0");
  const [zsd, setZsd] = useState("1");

  const summary = useMemo(() => {
    if (!text.trim()) return null;
    try {
      return { ok: true as const, value: summarize(parseDataset(text)) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Invalid data" };
    }
  }, [text]);

  return (
    <Panel eyebrow="Statistics" title="Data and probability">
      <p className="mb-3 text-sm text-muted">
        Quartiles use Tukey hinges. Sample variance divides by n−1. Population variance divides by n. Nothing here is filled with sample data until you type a set.
      </p>
      <textarea className={`${fieldClass} min-h-28 font-mono`} aria-label="Dataset" placeholder="1, 2, 2, 3, 5" value={text} onChange={(event) => setText(event.target.value)} />
      <div className="mt-3 flex gap-2">
        <button type="button" className={`min-h-11 rounded-xl border px-3 text-sm ${spread === "sample" ? "border-accent text-accent" : "border-line"}`} onClick={() => setSpread("sample")}>
          Sample
        </button>
        <button type="button" className={`min-h-11 rounded-xl border px-3 text-sm ${spread === "population" ? "border-accent text-accent" : "border-line"}`} onClick={() => setSpread("population")}>
          Population
        </button>
      </div>
      {!text.trim() ? <p className="mt-4 text-sm text-muted">Enter numbers separated by commas, spaces, or new lines.</p> : null}
      {summary && !summary.ok ? <p className="mt-4 text-sm text-danger">{summary.error}</p> : null}
      {summary?.ok ? (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Stat label="Count" value={String(summary.value.count)} />
          <Stat label="Mean" value={formatNumber(summary.value.mean, 8)} />
          <Stat label="Median" value={formatNumber(summary.value.median, 8)} />
          <Stat label="Mode" value={summary.value.modes.length ? summary.value.modes.map((m) => formatNumber(m, 6)).join(", ") : "none"} />
          <Stat label={spread === "sample" ? "Sample variance" : "Population variance"} value={formatNumber(spread === "sample" ? summary.value.sampleVariance ?? NaN : summary.value.populationVariance, 8)} />
          <Stat label={spread === "sample" ? "Sample std. dev." : "Population std. dev."} value={formatNumber(spread === "sample" ? summary.value.sampleStd ?? NaN : summary.value.populationStd, 8)} />
          <Stat label="Q1" value={formatNumber(summary.value.q1, 8)} />
          <Stat label="Q3" value={formatNumber(summary.value.q3, 8)} />
          <Stat label="IQR" value={formatNumber(summary.value.iqr, 8)} />
        </dl>
      ) : null}
      <h3 className="mt-6 text-sm font-semibold">Distributions</h3>
      <p className="text-sm text-muted">Binomial and Poisson values are probability masses. The normal value is a density, not a probability.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Num label="Binomial n" value={trials} set={setTrials} />
        <Num label="k" value={successes} set={setSuccesses} />
        <Num label="p" value={p} set={setP} />
      </div>
      <Prob
        run={() => formatNumber(binomialPmf(Number(successes), Number(trials), Number(p)), 8)}
        label="Binomial P(K = k)"
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Num label="Poisson k" value={k} set={setK} />
        <Num label="lambda" value={lambda} set={setLambda} />
      </div>
      <Prob run={() => formatNumber(poissonPmf(Number(k), Number(lambda)), 8)} label="Poisson P(K = k)" />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Num label="Normal x" value={zx} set={setZx} />
        <Num label="mean" value={zmu} set={setZmu} />
        <Num label="std. dev." value={zsd} set={setZsd} />
      </div>
      <Prob run={() => formatNumber(normalPdf(Number(zx), Number(zmu), Number(zsd)), 8)} label="Normal density" />
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono text-fg">{value}</dd>
    </div>
  );
}

function Num({ label, value, set }: { label: string; value: string; set: (value: string) => void }) {
  return (
    <label className="text-xs text-muted">
      {label}
      <input className={`${fieldClass} mt-1 font-mono`} value={value} onChange={(event) => set(event.target.value)} />
    </label>
  );
}

function Prob({ run, label }: { run: () => string; label: string }) {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="min-h-11 rounded-xl border border-line px-3 text-sm"
        onClick={() => {
          try {
            setError(null);
            setText(run());
          } catch (caught) {
            setText(null);
            setError(caught instanceof Error ? caught.message : "Invalid input");
          }
        }}
      >
        {label}
      </button>
      {text ? <span className="font-mono text-sm">{text}</span> : null}
      {error ? <span className="text-sm text-danger">{error}</span> : null}
    </div>
  );
}
