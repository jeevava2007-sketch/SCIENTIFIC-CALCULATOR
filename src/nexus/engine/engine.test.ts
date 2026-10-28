import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeUsage } from "./analytics.ts";
import { parseBackup } from "./backup.ts";
import { initialCalc, reduceCalc } from "./calc.ts";
import { differentiate, integrate } from "./calculus.ts";
import { evaluateExpression, formatNumber } from "./evaluate.ts";
import { approximateRoots, sampleExpression, splitSegments } from "./graph.ts";
import { add, cross, determinant, dot, inverse, magnitude, multiply, rrefSolve, transpose } from "./matrix.ts";
import { solveInput } from "./solver.ts";
import { binomialPmf, combination, normalPdf, permutation, summarize } from "./stats.ts";
import { convertBase, convertTemperature, convertUnit } from "./units.ts";

const deg = { angle: "deg" as const, precision: 12 };
const rad = { angle: "rad" as const, precision: 12 };

function valueOf(input: string, ctx: { angle: "deg" | "rad"; precision: number; ans?: number; memory?: number } = deg) {
  const result = evaluateExpression(input, ctx);
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

describe("evaluate", () => {
  it("respects precedence and parentheses", () => {
    assert.equal(valueOf("2+3*4"), 14);
    assert.equal(valueOf("(2+3)*4"), 20);
  });

  it("converts trig angles and leaves hyperbolic functions unscaled", () => {
    const s = evaluateExpression("sin(30)", deg);
    assert.ok(s.ok && Math.abs(s.value - 0.5) < 1e-12);
    const r = evaluateExpression("sin(pi/2)", rad);
    assert.ok(r.ok && Math.abs(r.value - 1) < 1e-12);
    const h = evaluateExpression("sinh(0)", deg);
    assert.ok(h.ok && h.value === 0);
  });

  it("evaluates powers, roots, logs, factorial, and combinatorics", () => {
    assert.equal(valueOf("2^10"), 1024);
    assert.equal(valueOf("sqrt(9)"), 3);
    assert.equal(valueOf("5!"), 120);
    const ln = evaluateExpression("log(e)", deg);
    assert.ok(ln.ok && Math.abs(ln.value - 1) < 1e-12);
    assert.equal(valueOf("log10(1000)"), 3);
    assert.equal(valueOf("combinations(5,2)"), 10);
    assert.equal(valueOf("permutations(5,2)"), 20);
    assert.equal(valueOf("abs(-3)"), 3);
  });

  it("supports scientific notation without confusing EE and Euler's constant", () => {
    const avo = evaluateExpression("6.02*10^(23)", deg);
    assert.ok(avo.ok && Math.abs(avo.value - 6.02e23) / 6.02e23 < 1e-12);
    const typed = evaluateExpression("6.02e23", deg);
    assert.ok(typed.ok && typed.value === 6.02e23);
    const euler = evaluateExpression("e", deg);
    assert.ok(euler.ok && Math.abs(euler.value - Math.E) < 1e-12);
  });

  it("applies percent as mathjs percent, not as Euler or modulo-only", () => {
    const half = evaluateExpression("50%", deg);
    assert.ok(half.ok && Math.abs(half.value - 0.5) < 1e-12);
    const tip = evaluateExpression("200+10%", deg);
    assert.ok(tip.ok && Math.abs(tip.value - 220) < 1e-9);
  });

  it("uses Ans and memory", () => {
    const next = evaluateExpression("Ans+M", { ...deg, ans: 4, memory: 1.5 });
    assert.ok(next.ok && next.value === 5.5);
  });

  it("rejects division by zero, domain errors, overflow, and unsafe syntax", () => {
    assert.equal(evaluateExpression("1/0", deg).ok, false);
    assert.equal(evaluateExpression("sqrt(-1)", deg).ok, false);
    assert.equal(evaluateExpression("asin(2)", deg).ok, false);
    assert.equal(evaluateExpression("log(0)", deg).ok, false);
    assert.equal(evaluateExpression("200!", deg).ok, false);
    assert.equal(evaluateExpression("a.b", deg).ok, false);
    assert.equal(evaluateExpression("constructor", deg).ok, false);
    assert.equal(evaluateExpression("[1,2]", deg).ok, false);
    assert.equal(evaluateExpression("f(x)=x", deg).ok, false);
    assert.equal(evaluateExpression("sin(", deg).ok, false);
    assert.equal(evaluateExpression("x".repeat(500), deg).ok, false);
  });

  it("formats with the requested precision", () => {
    assert.equal(formatNumber(1 / 3, 4), "0.3333");
    assert.equal(formatNumber(0, 6), "0");
    assert.match(formatNumber(6.02e23, 3), /^6\.02e\+23$/);
  });
});

describe("calculator actions", () => {
  it("inserts scientific notation from EE and keeps Euler on the e key", () => {
    let state = initialCalc();
    for (const text of ["6", ".", "0", "2"]) state = reduceCalc(state, { type: "insert", text }).state;
    state = reduceCalc(state, { type: "ee" }).state;
    state = reduceCalc(state, { type: "insert", text: "23)" }).state;
    const done = reduceCalc(state, { type: "equals" });
    assert.ok(done.committed);
    assert.ok(Math.abs(done.committed.value - 6.02e23) / 6.02e23 < 1e-9);
    const euler = reduceCalc(initialCalc(), { type: "insert", text: "e" }).state;
    assert.equal(euler.expression, "e");
  });

  it("toggles sign, clears entry, backspaces, and stores memory", () => {
    let state = reduceCalc(initialCalc(), { type: "insert", text: "12" }).state;
    state = reduceCalc(state, { type: "negate" }).state;
    assert.equal(state.expression, "-(12)");
    state = reduceCalc(state, { type: "negate" }).state;
    assert.equal(state.expression, "12");
    state = reduceCalc(state, { type: "backspace" }).state;
    assert.equal(state.expression, "1");
    state = reduceCalc(state, { type: "insert", text: "2+3" }).state;
    state = reduceCalc(state, { type: "ce" }).state;
    assert.equal(state.expression, "12+");
    state = reduceCalc(initialCalc({ expression: "8" }), { type: "memory", op: "store" }).state;
    assert.equal(state.memory, 8);
    state = reduceCalc(state, { type: "memory", op: "add" }).state;
    assert.equal(state.memory, 16);
    state = reduceCalc(state, { type: "memory", op: "sub" }).state;
    assert.equal(state.memory, 8);
    state = reduceCalc(state, { type: "ac" }).state;
    state = reduceCalc(state, { type: "memory", op: "recall" }).state;
    assert.match(state.expression, /^8/);
    state = reduceCalc(state, { type: "memory", op: "clear" }).state;
    assert.equal(state.memory, 0);
  });

  it("continues from the previous answer after equals", () => {
    let state = reduceCalc(initialCalc(), { type: "insert", text: "2+3" }).state;
    const done = reduceCalc(state, { type: "equals" });
    state = reduceCalc(done.state, { type: "insert", text: "*2" }).state;
    const again = reduceCalc(state, { type: "equals" });
    assert.equal(again.committed?.value, 10);
  });
});

describe("graph", () => {
  it("does not connect samples across a tangent asymptote", () => {
    const sampled = sampleExpression("tan(x)", "rad", 0, 3, 300);
    const segments = splitSegments(sampled.points, 8);
    assert.ok(segments.length >= 2);
  });

  it("approximates roots of x^2-1", () => {
    const roots = approximateRoots("x^2-1", "rad", -2, 2, 200).sort((a, b) => a - b);
    assert.equal(roots.length, 2);
    assert.ok(Math.abs(roots[0] + 1) < 1e-3);
    assert.ok(Math.abs(roots[1] - 1) < 1e-3);
  });
});

describe("solver", () => {
  it("solves a quadratic, a linear equation, and reports complex roots", () => {
    const quad = solveInput("x^2-5x+6=0", "rad");
    assert.equal(quad.kind, "unique");
    const reals = quad.roots.map((root) => root.real).sort((a, b) => a - b);
    assert.ok(Math.abs(reals[0] - 2) < 1e-8);
    assert.ok(Math.abs(reals[1] - 3) < 1e-8);
    const linear = solveInput("2x+4=0", "rad");
    assert.ok(Math.abs(linear.roots[0].real + 2) < 1e-8);
    const complex = solveInput("x^2+1=0", "rad");
    assert.ok(complex.lines.some((line) => line.includes("Complex")));
    assert.ok(complex.roots.every((root) => Math.abs(root.imag) > 0));
  });

  it("detects identities, contradictions, unique systems, and singular systems", () => {
    assert.equal(solveInput("0=0", "rad").kind, "infinite");
    assert.equal(solveInput("1=2", "rad").kind, "none");
    const sys = solveInput("x+y=3; x-y=1", "rad");
    assert.equal(sys.kind, "unique");
    assert.ok(Math.abs(sys.roots[0].real - 2) < 1e-8);
    assert.ok(Math.abs(sys.roots[1].real - 1) < 1e-8);
    assert.equal(solveInput("x+y=1; 2x+2y=3", "rad").kind, "none");
    assert.equal(solveInput("x+y=2; 2x+2y=4", "rad").kind, "infinite");
  });
});

describe("matrices and vectors", () => {
  const A = [
    [1, 2],
    [3, 4],
  ];
  it("computes det, inverse, product, and transpose", () => {
    assert.ok(Math.abs(determinant(A) + 2) < 1e-9);
    const inv = inverse(A);
    const product = multiply(A, inv);
    assert.ok(Math.abs(product[0][0] - 1) < 1e-8);
    assert.ok(Math.abs(product[0][1]) < 1e-8);
    assert.deepEqual(transpose([[1, 2, 3]]), [[1], [2], [3]]);
    assert.throws(() => inverse([[1, 2], [2, 4]]), /singular/);
    assert.throws(() => add(A, [[1]]), /same size/);
  });

  it("computes vector operations and stable linear solves", () => {
    assert.equal(dot([1, 2, 3], [4, 5, 6]), 32);
    assert.deepEqual(cross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
    assert.ok(Math.abs(magnitude([3, 4]) - 5) < 1e-12);
    const solved = rrefSolve(
      [
        [1e-12, 1],
        [1, 1],
      ],
      [1, 2],
    );
    assert.equal(solved.kind, "unique");
    if (solved.kind === "unique") {
      assert.ok(Math.abs(solved.x[0] - 1) < 1e-6);
      assert.ok(Math.abs(solved.x[1] - 1) < 1e-6);
    }
  });
});

describe("statistics", () => {
  it("separates sample and population spread and computes quartiles", () => {
    const summary = summarize([1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(summary.mean, 4.5);
    assert.equal(summary.median, 4.5);
    assert.equal(summary.q1, 2.5);
    assert.equal(summary.q3, 6.5);
    assert.equal(summary.iqr, 4);
    assert.ok(Math.abs(summary.populationVariance - 5.25) < 1e-12);
    assert.ok(summary.sampleVariance !== null && Math.abs(summary.sampleVariance - 6) < 1e-12);
    assert.deepEqual(summarize([1, 2, 2, 3]).modes, [2]);
    assert.equal(combination(5, 2), 10);
    assert.equal(permutation(5, 2), 20);
    assert.ok(Math.abs(binomialPmf(2, 4, 0.5) - 0.375) < 1e-12);
    assert.ok(normalPdf(0, 0, 1) > 0.39 && normalPdf(0, 0, 1) < 0.4);
  });
});

describe("units and bases", () => {
  it("converts measures, temperature, and integer bases", () => {
    assert.ok(Math.abs(convertUnit("length", 1, "km", "m") - 1000) < 1e-9);
    assert.ok(Math.abs(convertTemperature(0, "C", "F") - 32) < 1e-12);
    assert.ok(Math.abs(convertTemperature(32, "F", "C")) < 1e-12);
    assert.equal(convertBase("1010", 2, 10), "10");
    assert.equal(convertBase("FF", 16, 10), "255");
    assert.equal(convertBase("10", 10, 2), "1010");
    assert.throws(() => convertBase("2", 2, 10), /not valid/);
    assert.throws(() => convertTemperature(-1, "K", "C"), /negative/);
  });
});

describe("numerical calculus", () => {
  it("approximates a derivative and a definite integral", () => {
    const slope = differentiate("x^2", 3, "rad");
    assert.ok(Math.abs(slope.value - 6) < 1e-4);
    assert.match(slope.method, /numerical approximation/i);
    const area = integrate("x", 0, 1, "rad");
    assert.ok(Math.abs(area.value - 0.5) < 1e-6);
    assert.equal(area.converged, true);
    const sine = integrate("sin(x)", 0, Math.PI, "rad");
    assert.ok(Math.abs(sine.value - 2) < 1e-4);
  });
});

describe("analytics and backup", () => {
  it("summarizes only supplied records", () => {
    const empty = summarizeUsage([]);
    assert.equal(empty.total, 0);
    assert.deepEqual(empty.days, []);
    assert.deepEqual(empty.functionUsage, []);
    const used = summarizeUsage([{ expression: "sin(30)+log(2)", at: Date.parse("2026-03-02T12:00:00") }]);
    assert.equal(used.total, 1);
    assert.deepEqual(
      used.functionUsage.map((item) => item.name).sort(),
      ["ln", "sin"],
    );
  });

  it("rejects malformed backups", () => {
    assert.throws(() => parseBackup({ version: 2, history: [] }));
    const ok = parseBackup({
      version: 1,
      history: [{ id: "a", expression: "1+1", result: "2", at: 1 }],
    });
    assert.equal(ok.history.length, 1);
  });
});
