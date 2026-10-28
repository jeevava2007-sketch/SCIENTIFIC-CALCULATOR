import { compileReal, type AngleMode } from "./evaluate.ts";

export type NumericResult = {
  value: number;
  errorEstimate: number;
  converged: boolean;
  method: string;
};

/**
 * Numerical derivative at a point.
 * Central differences at h and h/2, then Richardson extrapolation.
 * The result is an approximation, not a symbolic derivative.
 */
export function differentiate(expression: string, x: number, angle: AngleMode): NumericResult {
  const fn = compileReal(expression, ["x"], angle);
  const f = (t: number) => {
    const y = fn({ x: t });
    if (!Number.isFinite(y)) throw new Error("Function is not finite near the point");
    return y;
  };
  f(x);
  const h = 1e-3 * Math.max(1, Math.abs(x));
  const d = (step: number) => (f(x + step) - f(x - step)) / (2 * step);
  const d1 = d(h);
  const d2 = d(h / 2);
  const value = (4 * d2 - d1) / 3;
  if (!Number.isFinite(value)) throw new Error("Derivative did not converge to a finite value");
  return {
    value,
    errorEstimate: Math.abs(value - d2),
    converged: Math.abs(value - d2) <= 1e-4 * (1 + Math.abs(value)),
    method: "Richardson extrapolation of the central difference. This is a numerical approximation, not a symbolic derivative.",
  };
}

/**
 * Definite integral on [a, b] by adaptive Simpson's rule.
 * The result is an approximation, not an exact antiderivative.
 */
export function integrate(
  expression: string,
  a: number,
  b: number,
  angle: AngleMode,
  tolerance = 1e-7,
): NumericResult {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Limits must be finite");
  if (a === b) {
    return {
      value: 0,
      errorEstimate: 0,
      converged: true,
      method: "Integral over a zero-width interval is 0.",
    };
  }
  const fn = compileReal(expression, ["x"], angle);
  const f = (t: number) => {
    try {
      const y = fn({ x: t });
      if (!Number.isFinite(y)) throw new Error("non-finite");
      return y;
    } catch {
      throw new Error("Integrand is undefined or non-finite inside the interval");
    }
  };
  const left = Math.min(a, b);
  const right = Math.max(a, b);
  const sign = a <= b ? 1 : -1;
  const probe = 32;
  let previous: number | null = null;
  for (let i = 0; i <= probe; i++) {
    const x = left + ((right - left) * i) / probe;
    const y = f(x);
    if (previous !== null && Math.abs(y - previous) > 1e6 * (1 + Math.abs(previous))) {
      throw new Error("Integrand appears discontinuous on this interval. The approximation was not attempted.");
    }
    previous = y;
  }
  const whole = simpson(f, left, right);
  const result = adaptive(f, left, right, tolerance, whole, 12);
  return {
    value: sign * result.value,
    errorEstimate: result.error,
    converged: result.ok,
    method: "Adaptive Simpson's rule. This is a numerical approximation, not an exact symbolic integral.",
  };
}

function simpson(f: (x: number) => number, a: number, b: number): number {
  const c = (a + b) / 2;
  return ((b - a) / 6) * (f(a) + 4 * f(c) + f(b));
}

function adaptive(
  f: (x: number) => number,
  a: number,
  b: number,
  eps: number,
  whole: number,
  depth: number,
): { value: number; error: number; ok: boolean } {
  const c = (a + b) / 2;
  const left = simpson(f, a, c);
  const right = simpson(f, c, b);
  const delta = left + right - whole;
  if (depth <= 0) return { value: left + right, error: Math.abs(delta), ok: false };
  if (Math.abs(delta) <= 15 * eps) {
    return { value: left + right + delta / 15, error: Math.abs(delta) / 15, ok: true };
  }
  const L = adaptive(f, a, c, eps / 2, left, depth - 1);
  const R = adaptive(f, c, b, eps / 2, right, depth - 1);
  return { value: L.value + R.value, error: L.error + R.error, ok: L.ok && R.ok };
}
