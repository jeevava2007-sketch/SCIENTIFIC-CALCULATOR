import { useState } from "react";
import {
  add,
  addVectors,
  cross,
  determinant,
  dot,
  formatMatrix,
  inverse,
  magnitude,
  multiply,
  parseGrid,
  subtract,
  subtractVectors,
  transpose,
} from "../engine/matrix";
import { fieldClass, Panel } from "./panel";

export default function MatrixPanel() {
  const [a, setA] = useState("1 2\n3 4");
  const [b, setB] = useState("5 6\n7 8");
  const [out, setOut] = useState("Results appear here.");
  const [va, setVa] = useState("1, 0, 0");
  const [vb, setVb] = useState("0, 1, 0");

  function run(op: "add" | "sub" | "mul" | "det" | "inv" | "transpose") {
    try {
      const A = parseGrid(a);
      const B = op === "det" || op === "inv" || op === "transpose" ? A : parseGrid(b);
      if (op === "add") setOut(formatMatrix(add(A, B)));
      if (op === "sub") setOut(formatMatrix(subtract(A, B)));
      if (op === "mul") setOut(formatMatrix(multiply(A, B)));
      if (op === "det") setOut(String(determinant(A)));
      if (op === "inv") setOut(formatMatrix(inverse(A)));
      if (op === "transpose") setOut(formatMatrix(transpose(A)));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "Invalid matrix");
    }
  }

  function runVec(op: "add" | "sub" | "dot" | "cross" | "mag") {
    try {
      const A = parseGrid(va.replace(/,/g, " "));
      const B = parseGrid(vb.replace(/,/g, " "));
      const u = A[0];
      const v = B[0];
      if (op === "add") setOut(addVectors(u, v).join(", "));
      if (op === "sub") setOut(subtractVectors(u, v).join(", "));
      if (op === "dot") setOut(String(dot(u, v)));
      if (op === "cross") setOut(cross(u, v).join(", "));
      if (op === "mag") setOut(`|u| = ${magnitude(u)}, |v| = ${magnitude(v)}`);
    } catch (error) {
      setOut(error instanceof Error ? error.message : "Invalid vector");
    }
  }

  return (
    <Panel eyebrow="Linear algebra" title="Matrices and vectors">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-muted">
          Matrix A
          <textarea className={`${fieldClass} mt-1 min-h-28 font-mono`} value={a} onChange={(event) => setA(event.target.value)} />
        </label>
        <label className="text-sm text-muted">
          Matrix B
          <textarea className={`${fieldClass} mt-1 min-h-28 font-mono`} value={b} onChange={(event) => setB(event.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["add", "A + B"],
            ["sub", "A − B"],
            ["mul", "A × B"],
            ["det", "det A"],
            ["inv", "A inverse"],
            ["transpose", "A transpose"],
          ] as const
        ).map(([op, label]) => (
          <button key={op} type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => run(op)}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-muted">
          Vector u
          <input className={`${fieldClass} mt-1 font-mono`} value={va} onChange={(event) => setVa(event.target.value)} />
        </label>
        <label className="text-sm text-muted">
          Vector v
          <input className={`${fieldClass} mt-1 font-mono`} value={vb} onChange={(event) => setVb(event.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["add", "u + v"],
            ["sub", "u − v"],
            ["dot", "Dot"],
            ["cross", "Cross"],
            ["mag", "Magnitude"],
          ] as const
        ).map(([op, label]) => (
          <button key={op} type="button" className="min-h-11 rounded-xl border border-line px-3 text-sm" onClick={() => runVec(op)}>
            {label}
          </button>
        ))}
      </div>
      <pre className="mt-4 overflow-auto rounded-xl border border-line bg-bg/40 p-3 font-mono text-sm" aria-live="polite">
        {out}
      </pre>
    </Panel>
  );
}
