import { compileReal, type AngleMode } from "./evaluate.ts";

export type PlotPoint = { x: number; y: number | null };

export function sampleExpression(
  expression: string,
  angle: AngleMode,
  xmin: number,
  xmax: number,
  samples: number,
): { points: PlotPoint[]; error?: string } {
  let fn: (vars: Record<string, number>) => number;
  try {
    fn = compileReal(expression, ["x"], angle);
  } catch (error) {
    return {
      points: [],
      error: error instanceof Error ? error.message : "Invalid function",
    };
  }
  const n = Math.max(2, Math.min(2000, Math.floor(samples)));
  const points: PlotPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const x = xmin + ((xmax - xmin) * i) / n;
    let y: number | null = null;
    try {
      const v = fn({ x });
      y = typeof v === "number" && Number.isFinite(v) ? v : null;
    } catch {
      y = null;
    }
    points.push({ x, y });
  }
  return { points };
}

/** Split a polyline so asymptotes and undefined gaps are not stroked across. */
export function splitSegments(points: PlotPoint[], yJump: number): { x: number; y: number }[][] {
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];
  const jump = Math.max(yJump, 1e-9);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.y === null) {
      if (current.length) segments.push(current);
      current = [];
      continue;
    }
    const prev = current[current.length - 1];
    if (prev && Math.abs(p.y - prev.y) > jump) {
      if (current.length) segments.push(current);
      current = [{ x: p.x, y: p.y }];
      continue;
    }
    current.push({ x: p.x, y: p.y });
  }
  if (current.length) segments.push(current);
  return segments;
}

export function approximateRoots(
  expression: string,
  angle: AngleMode,
  xmin: number,
  xmax: number,
  samples = 600,
): number[] {
  const sampled = sampleExpression(expression, angle, xmin, xmax, samples);
  if (sampled.error) return [];
  const roots: number[] = [];
  const pts = sampled.points;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (a.y === null || b.y === null) continue;
    if (a.y === 0) {
      roots.push(a.x);
      continue;
    }
    if (a.y * b.y > 0) continue;
    // Huge jumps are asymptotes, not roots.
    if (Math.abs(a.y - b.y) > 1e6 * (1 + Math.min(Math.abs(a.y), Math.abs(b.y)))) continue;
    let lo = a.x;
    let hi = b.x;
    let flo = a.y;
    try {
      const fn = compileReal(expression, ["x"], angle);
      for (let k = 0; k < 50; k++) {
        const mid = (lo + hi) / 2;
        const fm = fn({ x: mid });
        if (!Number.isFinite(fm)) break;
        if (flo * fm <= 0) hi = mid;
        else {
          lo = mid;
          flo = fm;
        }
      }
      const root = (lo + hi) / 2;
      const residual = fn({ x: root });
      if (Number.isFinite(residual) && Math.abs(residual) < 1e-4) roots.push(root);
    } catch {
      /* skip this bracket */
    }
  }
  return dedupe(roots, (xmax - xmin) / 1000);
}

export function approximateIntersections(
  a: string,
  b: string,
  angle: AngleMode,
  xmin: number,
  xmax: number,
): number[] {
  return approximateRoots(`(${a})-(${b})`, angle, xmin, xmax);
}

export function yIntercept(expression: string, angle: AngleMode): number | null {
  try {
    const fn = compileReal(expression, ["x"], angle);
    const y = fn({ x: 0 });
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

function dedupe(values: number[], tol: number): number[] {
  const out: number[] = [];
  for (const v of values) {
    if (!out.some((u) => Math.abs(u - v) <= tol)) out.push(v);
  }
  return out;
}
