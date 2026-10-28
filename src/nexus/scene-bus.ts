import type { Mode } from "./store.ts";

export const sceneBus = {
  mode: "calc" as Mode,
  pointer: { x: 0, y: 0 },
  pulse: 0,
  theme: "dark" as "dark" | "light",
  focus: false,
  reduced: false,
  intro: 1,
};
