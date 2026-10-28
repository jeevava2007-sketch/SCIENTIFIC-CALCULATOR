export type Matrix = number[][];

export function parseGrid(text: string): Matrix {
  const rows = text
    .trim()
    .split(/\n|;/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) =>
      row
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((cell) => {
          const value = Number(cell);
          if (!Number.isFinite(value)) throw new Error(`Invalid entry: ${cell}`);
          return value;
        }),
    );
  if (!rows.length) throw new Error("Matrix is empty");
  const width = rows[0].length;
  if (!width || rows.some((row) => row.length !== width)) throw new Error("Rows must have the same length");
  if (rows.length > 8 || width > 8) throw new Error("Matrices are limited to 8×8");
  return rows;
}

export function formatMatrix(matrix: Matrix): string {
  return matrix.map((row) => row.map((value) => formatCell(value)).join("\t")).join("\n");
}

function formatCell(value: number): string {
  if (!Number.isFinite(value)) return "undefined";
  const text = Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)
    ? value.toExponential(6)
    : String(Number(value.toPrecision(10)));
  return text;
}

export function add(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b, "Addition");
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

export function subtract(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b, "Subtraction");
  return a.map((row, i) => row.map((value, j) => value - b[i][j]));
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) {
    throw new Error(`Cannot multiply ${a.length}×${a[0].length} by ${b.length}×${b[0].length}`);
  }
  return a.map((row) =>
    b[0].map((_, col) => row.reduce((sum, value, k) => sum + value * b[k][col], 0)),
  );
}

export function transpose(a: Matrix): Matrix {
  return a[0].map((_, col) => a.map((row) => row[col]));
}

export function determinant(a: Matrix): number {
  assertSquare(a, "Determinant");
  const { factor, singular } = eliminate(a.map((row) => [...row]));
  if (singular) return 0;
  return factor;
}

export function inverse(a: Matrix): Matrix {
  assertSquare(a, "Inverse");
  const n = a.length;
  const aug = a.map((row, i) => {
    const extra = Array(n).fill(0);
    extra[i] = 1;
    return [...row, ...extra];
  });
  const { singular } = eliminate(aug);
  if (singular) throw new Error("Matrix is singular and has no inverse");
  return aug.map((row) => row.slice(n));
}

export function magnitude(v: number[]): number {
  return Math.hypot(...v);
}

export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

export function cross(a: number[], b: number[]): number[] {
  if (a.length !== 3 || b.length !== 3) throw new Error("Cross product requires two 3D vectors");
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

export function addVectors(a: number[], b: number[]): number[] {
  if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
  return a.map((value, i) => value + b[i]);
}

export function subtractVectors(a: number[], b: number[]): number[] {
  if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
  return a.map((value, i) => value - b[i]);
}

export type LinearSolve =
  | { kind: "unique"; x: number[] }
  | { kind: "none" }
  | { kind: "infinite" };

/** Gauss-Jordan elimination with partial pivoting. Returns the product of pivots when the matrix is square. */
export function rrefSolve(matrix: Matrix, rhs: number[], tol = 1e-9): LinearSolve {
  const n = matrix.length;
  if (!n || matrix.some((row) => row.length !== n) || rhs.length !== n) {
    throw new Error("System matrix must be square and match the constants");
  }
  const A = matrix.map((row, i) => [...row, rhs[i]]);
  const where = Array(n).fill(-1);
  let row = 0;
  for (let col = 0; col < n && row < n; col++) {
    let sel = row;
    for (let i = row + 1; i < n; i++) if (Math.abs(A[i][col]) > Math.abs(A[sel][col])) sel = i;
    if (Math.abs(A[sel][col]) < tol) continue;
    [A[sel], A[row]] = [A[row], A[sel]];
    const pivot = A[row][col];
    for (let j = col; j <= n; j++) A[row][j] /= pivot;
    for (let i = 0; i < n; i++) {
      if (i === row) continue;
      const factor = A[i][col];
      if (Math.abs(factor) < tol) continue;
      for (let j = col; j <= n; j++) A[i][j] -= factor * A[row][j];
    }
    where[col] = row;
    row += 1;
  }
  for (let i = 0; i < n; i++) {
    const allZero = A[i].slice(0, n).every((value) => Math.abs(value) < tol * 10);
    if (allZero && Math.abs(A[i][n]) > tol * 10) return { kind: "none" };
  }
  if (where.some((index) => index < 0)) return { kind: "infinite" };
  const x = Array(n).fill(0);
  for (let col = 0; col < n; col++) x[col] = A[where[col]][n];
  return { kind: "unique", x };
}

function assertSameShape(a: Matrix, b: Matrix, label: string) {
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error(`${label} requires matrices of the same size`);
  }
}

function assertSquare(a: Matrix, label: string) {
  if (a.length !== a[0].length) throw new Error(`${label} requires a square matrix`);
}

function eliminate(matrix: number[][]): { factor: number; singular: boolean } {
  const n = matrix.length;
  let factor = 1;
  let sign = 1;
  const cols = matrix[0].length;
  let row = 0;
  for (let col = 0; col < n && row < n; col++) {
    let sel = row;
    for (let i = row + 1; i < n; i++) if (Math.abs(matrix[i][col]) > Math.abs(matrix[sel][col])) sel = i;
    if (Math.abs(matrix[sel][col]) < 1e-12) continue;
    if (sel !== row) {
      [matrix[sel], matrix[row]] = [matrix[row], matrix[sel]];
      sign *= -1;
    }
    const pivot = matrix[row][col];
    factor *= pivot * sign;
    sign = 1;
    for (let j = col; j < cols; j++) matrix[row][j] /= pivot;
    for (let i = 0; i < n; i++) {
      if (i === row) continue;
      const scale = matrix[i][col];
      for (let j = col; j < cols; j++) matrix[i][j] -= scale * matrix[row][j];
    }
    row += 1;
  }
  if (row < n) return { factor: 0, singular: true };
  return { factor, singular: false };
}
