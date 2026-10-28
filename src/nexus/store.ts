import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalcAction } from "./engine/calc.ts";
import { initialCalc, reduceCalc } from "./engine/calc.ts";
import type { AngleMode } from "./engine/evaluate.ts";
import { sceneBus } from "./scene-bus.ts";

export type Mode =
  | "calc"
  | "graph"
  | "solve"
  | "matrix"
  | "stats"
  | "units"
  | "calculus"
  | "formulas"
  | "history"
  | "insights";

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  at: number;
  note?: string;
};

export type GraphFn = { id: string; expression: string; enabled: boolean };
export type CustomFormula = {
  id: string;
  name: string;
  expression: string;
  variables: string[];
  note?: string;
};

export type Graphics = "auto" | "high" | "low" | "off";

type NexusState = {
  mode: Mode;
  theme: "dark" | "light";
  angle: AngleMode;
  precision: number;
  graphics: Graphics;
  intro: boolean;
  focus: boolean;
  motion: "full" | "reduced";
  expression: string;
  memory: number;
  ans: number;
  justEvaluated: boolean;
  error: string | null;
  resultText: string;
  history: HistoryItem[];
  functions: GraphFn[];
  formulas: CustomFormula[];
  bookmarks: string[];
  paletteOpen: boolean;
  settingsOpen: boolean;
  setMode: (mode: Mode) => void;
  patch: (partial: Partial<NexusState>) => void;
  dispatch: (action: CalcAction) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  noteHistory: (id: string, note: string) => void;
  importRecords: (history: HistoryItem[], formulas?: CustomFormula[], bookmarks?: string[]) => void;
};

function nid(prefix: string) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

export const useNexus = create<NexusState>()(
  persist(
    (set, get) => ({
      mode: "calc",
      theme: "dark",
      angle: "deg",
      precision: 10,
      graphics: "auto",
      intro: true,
      focus: false,
      motion: "full",
      expression: "",
      memory: 0,
      ans: 0,
      justEvaluated: false,
      error: null,
      resultText: "0",
      history: [],
      functions: [
        { id: "f1", expression: "sin(x)", enabled: true },
        { id: "f2", expression: "x^2/4", enabled: true },
      ],
      formulas: [],
      bookmarks: [],
      paletteOpen: false,
      settingsOpen: false,
      setMode: (mode) => set({ mode }),
      patch: (partial) => set(partial),
      dispatch: (action) => {
        const s = get();
        const snap = initialCalc({
          expression: s.expression,
          memory: s.memory,
          ans: s.ans,
          angle: s.angle,
          precision: s.precision,
          justEvaluated: s.justEvaluated,
          error: s.error,
          resultText: s.resultText,
        });
        const { state, committed } = reduceCalc(snap, action);
        const history = committed
          ? [
              {
                id: nid("h"),
                expression: committed.expression,
                result: committed.result,
                at: Date.now(),
              },
              ...s.history,
            ].slice(0, 500)
          : s.history;
        if (committed) sceneBus.pulse = 1;
        set({
          expression: state.expression,
          memory: state.memory,
          ans: state.ans,
          angle: state.angle,
          precision: state.precision,
          justEvaluated: state.justEvaluated,
          error: state.error,
          resultText: state.resultText,
          history,
        });
      },
      removeHistory: (id) => set({ history: get().history.filter((item) => item.id !== id) }),
      clearHistory: () => set({ history: [] }),
      noteHistory: (id, note) =>
        set({
          history: get().history.map((item) => (item.id === id ? { ...item, note } : item)),
        }),
      importRecords: (history, formulas, bookmarks) =>
        set({
          history: history.slice(0, 500),
          formulas: formulas ? formulas.slice(0, 200) : get().formulas,
          bookmarks: bookmarks ? bookmarks.slice(0, 200) : get().bookmarks,
        }),
    }),
    {
      name: "nexus.v2",
      skipHydration: true,
      partialize: (s) => ({
        theme: s.theme,
        angle: s.angle,
        precision: s.precision,
        graphics: s.graphics,
        intro: s.intro,
        focus: s.focus,
        motion: s.motion,
        expression: s.expression,
        memory: s.memory,
        ans: s.ans,
        resultText: s.resultText,
        history: s.history,
        functions: s.functions,
        formulas: s.formulas,
        bookmarks: s.bookmarks,
        mode: s.mode,
      }),
    },
  ),
);

export const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "calc", label: "Calculate", hint: "Scientific keypad" },
  { id: "graph", label: "Graph", hint: "Plot and inspect" },
  { id: "solve", label: "Solve", hint: "Equations and systems" },
  { id: "matrix", label: "Matrix", hint: "Matrices and vectors" },
  { id: "stats", label: "Statistics", hint: "Data and probability" },
  { id: "units", label: "Convert", hint: "Units and bases" },
  { id: "calculus", label: "Calculus", hint: "Numeric derivative and integral" },
  { id: "formulas", label: "Formulas", hint: "Library and bookmarks" },
  { id: "history", label: "History", hint: "Search past work" },
  { id: "insights", label: "Insights", hint: "Usage from your history" },
];
