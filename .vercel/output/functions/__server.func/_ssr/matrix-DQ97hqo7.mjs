//#region node_modules/.nitro/vite/services/ssr/assets/matrix-DQ97hqo7.js
function parseGrid(text) {
	const rows = text.trim().split(/\n|;/).map((row) => row.trim()).filter(Boolean).map((row) => row.split(/[,\s]+/).filter(Boolean).map((cell) => {
		const value = Number(cell);
		if (!Number.isFinite(value)) throw new Error(`Invalid entry: ${cell}`);
		return value;
	}));
	if (!rows.length) throw new Error("Matrix is empty");
	const width = rows[0].length;
	if (!width || rows.some((row) => row.length !== width)) throw new Error("Rows must have the same length");
	if (rows.length > 8 || width > 8) throw new Error("Matrices are limited to 8×8");
	return rows;
}
function formatMatrix(matrix) {
	return matrix.map((row) => row.map((value) => formatCell(value)).join("	")).join("\n");
}
function formatCell(value) {
	if (!Number.isFinite(value)) return "undefined";
	return Math.abs(value) >= 1e10 || Math.abs(value) > 0 && Math.abs(value) < 1e-8 ? value.toExponential(6) : String(Number(value.toPrecision(10)));
}
function add(a, b) {
	assertSameShape(a, b, "Addition");
	return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}
function subtract(a, b) {
	assertSameShape(a, b, "Subtraction");
	return a.map((row, i) => row.map((value, j) => value - b[i][j]));
}
function multiply(a, b) {
	if (a[0].length !== b.length) throw new Error(`Cannot multiply ${a.length}×${a[0].length} by ${b.length}×${b[0].length}`);
	return a.map((row) => b[0].map((_, col) => row.reduce((sum, value, k) => sum + value * b[k][col], 0)));
}
function transpose(a) {
	return a[0].map((_, col) => a.map((row) => row[col]));
}
function determinant(a) {
	assertSquare(a, "Determinant");
	const { factor, singular } = eliminate(a.map((row) => [...row]));
	if (singular) return 0;
	return factor;
}
function inverse(a) {
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
function magnitude(v) {
	return Math.hypot(...v);
}
function dot(a, b) {
	if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
	return a.reduce((sum, value, i) => sum + value * b[i], 0);
}
function cross(a, b) {
	if (a.length !== 3 || b.length !== 3) throw new Error("Cross product requires two 3D vectors");
	return [
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	];
}
function addVectors(a, b) {
	if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
	return a.map((value, i) => value + b[i]);
}
function subtractVectors(a, b) {
	if (a.length !== b.length || !a.length) throw new Error("Vectors must have the same non-zero length");
	return a.map((value, i) => value - b[i]);
}
/** Gauss-Jordan elimination with partial pivoting. Returns the product of pivots when the matrix is square. */
function rrefSolve(matrix, rhs, tol = 1e-9) {
	const n = matrix.length;
	if (!n || matrix.some((row) => row.length !== n) || rhs.length !== n) throw new Error("System matrix must be square and match the constants");
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
	for (let i = 0; i < n; i++) if (A[i].slice(0, n).every((value) => Math.abs(value) < tol * 10) && Math.abs(A[i][n]) > tol * 10) return { kind: "none" };
	if (where.some((index) => index < 0)) return { kind: "infinite" };
	const x = Array(n).fill(0);
	for (let col = 0; col < n; col++) x[col] = A[where[col]][n];
	return {
		kind: "unique",
		x
	};
}
function assertSameShape(a, b, label) {
	if (a.length !== b.length || a[0].length !== b[0].length) throw new Error(`${label} requires matrices of the same size`);
}
function assertSquare(a, label) {
	if (a.length !== a[0].length) throw new Error(`${label} requires a square matrix`);
}
function eliminate(matrix) {
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
	if (row < n) return {
		factor: 0,
		singular: true
	};
	return {
		factor,
		singular: false
	};
}
//#endregion
export { dot as a, magnitude as c, rrefSolve as d, subtract as f, determinant as i, multiply as l, transpose as m, addVectors as n, formatMatrix as o, subtractVectors as p, cross as r, inverse as s, add as t, parseGrid as u };
