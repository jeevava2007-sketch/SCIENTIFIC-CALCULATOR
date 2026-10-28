export type Summary = {
  count: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  /** Population variance, divisor n. */
  populationVariance: number;
  /** Sample variance, divisor n−1. Null when n < 2. */
  sampleVariance: number | null;
  populationStd: number;
  sampleStd: number | null;
  q1: number;
  q3: number;
  iqr: number;
};

export function parseDataset(text: string): number[] {
  const values = text
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const value = Number(part);
      if (!Number.isFinite(value)) throw new Error(`Invalid number: ${part}`);
      return value;
    });
  if (!values.length) throw new Error("Enter at least one number");
  if (values.length > 10000) throw new Error("Dataset is limited to 10,000 values");
  return values;
}

export function summarize(values: number[]): Summary {
  if (!values.length) throw new Error("Dataset is empty");
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const mean = sorted.reduce((sum, value) => sum + value, 0) / count;
  const populationVariance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count;
  const sampleVariance = count > 1 ? (populationVariance * count) / (count - 1) : null;
  return {
    count,
    mean,
    median: medianOf(sorted),
    modes: modes(sorted),
    min: sorted[0],
    max: sorted[count - 1],
    populationVariance,
    sampleVariance,
    populationStd: Math.sqrt(populationVariance),
    sampleStd: sampleVariance === null ? null : Math.sqrt(sampleVariance),
    q1: quartile(sorted, 0.25),
    q3: quartile(sorted, 0.75),
    iqr: quartile(sorted, 0.75) - quartile(sorted, 0.25),
  };
}

/** Tukey hinges: median of each half, excluding the median when n is odd. */
function quartile(sorted: number[], q: number): number {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  const lower = sorted.slice(0, mid);
  const upper = sorted.slice(n % 2 === 0 ? mid : mid + 1);
  if (q < 0.5) return medianOf(lower.length ? lower : sorted);
  if (q > 0.5) return medianOf(upper.length ? upper : sorted);
  return medianOf(sorted);
}

function medianOf(sorted: number[]): number {
  const n = sorted.length;
  if (!n) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function modes(sorted: number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of sorted) counts.set(value, (counts.get(value) ?? 0) + 1);
  let best = 1;
  for (const count of counts.values()) best = Math.max(best, count);
  if (best <= 1) return [];
  return [...counts.entries()].filter(([, count]) => count === best).map(([value]) => value);
}

export function combination(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    throw new Error("nCr requires integers with 0 ≤ k ≤ n");
  }
  if (n > 1000) throw new Error("n is too large");
  let result = 1;
  const kk = Math.min(k, n - k);
  for (let i = 1; i <= kk; i++) result = (result * (n - kk + i)) / i;
  return result;
}

export function permutation(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
    throw new Error("nPr requires integers with 0 ≤ k ≤ n");
  }
  if (n > 1000) throw new Error("n is too large");
  let result = 1;
  for (let i = 0; i < k; i++) result *= n - i;
  return result;
}

/** Binomial probability mass function. */
export function binomialPmf(k: number, n: number, p: number): number {
  if (p < 0 || p > 1) throw new Error("Probability must be between 0 and 1");
  if (!Number.isInteger(k) || k < 0 || k > n) throw new Error("k must be an integer from 0 to n");
  return combination(n, k) * p ** k * (1 - p) ** (n - k);
}

/** Poisson probability mass function. */
export function poissonPmf(k: number, lambda: number): number {
  if (lambda < 0) throw new Error("Lambda must be non-negative");
  if (!Number.isInteger(k) || k < 0 || k > 500) throw new Error("k must be an integer from 0 to 500");
  let term = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) term *= lambda / i;
  return term;
}

/** Normal probability density, not a cumulative probability. */
export function normalPdf(x: number, mean: number, std: number): number {
  if (std <= 0) throw new Error("Standard deviation must be positive");
  const z = (x - mean) / std;
  return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
}
