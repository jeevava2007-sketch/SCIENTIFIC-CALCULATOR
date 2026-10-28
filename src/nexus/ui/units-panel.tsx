import { useMemo, useState } from "react";
import { formatNumber } from "../engine/evaluate";
import { convertBase, convertUnit, TEMPERATURES, UNIT_GROUPS, type UnitCategory } from "../engine/units";
import { fieldClass, Panel } from "./panel";

const CATEGORIES: UnitCategory[] = ["length", "mass", "time", "area", "volume", "temperature"];

export default function UnitsPanel() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const units = useMemo(() => (category === "temperature" ? [...TEMPERATURES] : Object.keys(UNIT_GROUPS[category])), [category]);
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("m");
  const [value, setValue] = useState("1");
  const [baseIn, setBaseIn] = useState("1010");
  const [fromBase, setFromBase] = useState<2 | 8 | 10 | 16>(2);
  const [toBase, setToBase] = useState<2 | 8 | 10 | 16>(10);

  const activeFrom = units.includes(from) ? from : units[0];
  const activeTo = units.includes(to) ? to : units[1] ?? units[0];
  const converted = useMemo(() => {
    const n = Number(value);
    try {
      return { ok: true as const, text: formatNumber(convertUnit(category, n, activeFrom, activeTo), 10) };
    } catch (error) {
      return { ok: false as const, text: error instanceof Error ? error.message : "Invalid conversion" };
    }
  }, [activeFrom, activeTo, category, value]);

  const based = useMemo(() => {
    try {
      return { ok: true as const, text: convertBase(baseIn, fromBase, toBase) };
    } catch (error) {
      return { ok: false as const, text: error instanceof Error ? error.message : "Invalid base" };
    }
  }, [baseIn, fromBase, toBase]);

  return (
    <Panel eyebrow="Convert" title="Units and number bases">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button key={item} type="button" className={`min-h-11 rounded-xl border px-3 text-sm capitalize ${item === category ? "border-accent text-accent" : "border-line"}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-muted">
          Value
          <input className={`${fieldClass} mt-1 font-mono`} value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <Select label="From" value={activeFrom} options={units} onChange={setFrom} />
        <Select label="To" value={activeTo} options={units} onChange={setTo} />
        <p className={`self-end font-mono text-lg ${converted.ok ? "text-fg" : "text-danger"}`} aria-live="polite">
          {converted.text}
        </p>
      </div>
      <h3 className="mt-6 text-sm font-semibold">Integer bases</h3>
      <p className="text-sm text-muted">Binary, octal, decimal, and hexadecimal. Fractional values are not converted.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-muted">
          Value
          <input className={`${fieldClass} mt-1 font-mono`} value={baseIn} onChange={(event) => setBaseIn(event.target.value)} />
        </label>
        <Select label="From base" value={String(fromBase)} options={["2", "8", "10", "16"]} onChange={(v) => setFromBase(Number(v) as 2 | 8 | 10 | 16)} />
        <Select label="To base" value={String(toBase)} options={["2", "8", "10", "16"]} onChange={(v) => setToBase(Number(v) as 2 | 8 | 10 | 16)} />
        <p className={`self-end font-mono text-lg ${based.ok ? "text-fg" : "text-danger"}`}>{based.text}</p>
      </div>
    </Panel>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs text-muted">
      {label}
      <select className={`${fieldClass} mt-1`} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
