import { useState } from "react";
import { solveInput } from "../engine/solver";
import { useNexus } from "../store";
import { fieldClass, Panel } from "./panel";

export default function SolverPanel() {
  const angle = useNexus((s) => s.angle);
  const [text, setText] = useState("x^2-5x+6=0");
  const [result, setResult] = useState<ReturnType<typeof solveInput> | null>(null);

  return (
    <Panel eyebrow="Solver" title="Supported equation classes">
      <p className="mb-3 text-sm text-muted">
        One linear or quadratic equation in a single variable, or a square linear system separated by semicolons. Other equations get an approximate scan on [−20, 20], clearly labeled as numeric. Arbitrary symbolic equations are not solved.
      </p>
      <textarea className={`${fieldClass} min-h-24 font-mono`} aria-label="Equation" value={text} onChange={(event) => setText(event.target.value)} />
      <button
        type="button"
        className="mt-3 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg"
        onClick={() => setResult(solveInput(text, angle))}
      >
        Solve
      </button>
      {result ? (
        <div className="mt-4" aria-live="polite">
          <h3 className="font-semibold">{result.title}</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
            {result.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Steps come from the method that actually ran: coefficient fit, the quadratic formula, or Gaussian elimination.</p>
      )}
    </Panel>
  );
}
