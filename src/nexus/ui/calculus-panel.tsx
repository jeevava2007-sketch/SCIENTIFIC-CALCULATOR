import { useState } from "react";
import { differentiate, integrate } from "../engine/calculus";
import { formatNumber } from "../engine/evaluate";
import { useNexus } from "../store";
import { fieldClass, Panel } from "./panel";

export default function CalculusPanel() {
  const angle = useNexus((s) => s.angle);
  const [expression, setExpression] = useState("x^2");
  const [point, setPoint] = useState("3");
  const [a, setA] = useState("0");
  const [b, setB] = useState("1");
  const [message, setMessage] = useState("Results are numerical approximations.");

  return (
    <Panel eyebrow="Calculus" title="Numerical derivative and integral">
      <p className="mb-3 text-sm text-muted">
        Differentiation uses Richardson extrapolation of a central difference. Integration uses adaptive Simpson’s rule. Angle mode applies to trig functions. These are not symbolic antiderivatives.
      </p>
      <label className="text-sm text-muted">
        f(x)
        <input className={`${fieldClass} mt-1 font-mono`} value={expression} onChange={(event) => setExpression(event.target.value)} />
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted">
          Point
          <input className={`${fieldClass} mt-1 font-mono`} value={point} onChange={(event) => setPoint(event.target.value)} />
        </label>
        <label className="text-xs text-muted">
          Lower limit
          <input className={`${fieldClass} mt-1 font-mono`} value={a} onChange={(event) => setA(event.target.value)} />
        </label>
        <label className="text-xs text-muted">
          Upper limit
          <input className={`${fieldClass} mt-1 font-mono`} value={b} onChange={(event) => setB(event.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-bg"
          onClick={() => {
            try {
              const result = differentiate(expression, Number(point), angle);
              setMessage(`f'(${point}) ≈ ${formatNumber(result.value, 8)}. Error estimate ${result.errorEstimate.toExponential(2)}. ${result.converged ? "The two step sizes agreed." : "The estimate did not settle within tolerance."} ${result.method}`);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Derivative failed");
            }
          }}
        >
          Differentiate
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl border border-line px-4 text-sm"
          onClick={() => {
            try {
              const result = integrate(expression, Number(a), Number(b), angle);
              setMessage(`∫ from ${a} to ${b} ≈ ${formatNumber(result.value, 8)}. Error estimate ${result.errorEstimate.toExponential(2)}. ${result.converged ? "The adaptive rule converged." : "The rule hit its depth limit."} ${result.method}`);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Integral failed");
            }
          }}
        >
          Integrate
        </button>
      </div>
      <p className="mt-4 text-sm" aria-live="polite">
        {message}
      </p>
    </Panel>
  );
}
