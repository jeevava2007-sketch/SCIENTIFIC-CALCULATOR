export type UnitCategory = "length" | "mass" | "time" | "area" | "volume" | "temperature";

export const UNIT_GROUPS: Record<Exclude<UnitCategory, "temperature">, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, um: 1e-6, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  mass: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.028349523125, t: 1000 },
  time: { s: 1, ms: 0.001, min: 60, h: 3600, day: 86400, week: 604800 },
  area: { "m^2": 1, "km^2": 1e6, "cm^2": 1e-4, "ft^2": 0.09290304, "in^2": 0.00064516, acre: 4046.8564224 },
  volume: { "m^3": 1, L: 0.001, mL: 1e-6, "ft^3": 0.028316846592, "in^3": 1.6387064e-5, gal: 0.003785411784 },
};

export const TEMPERATURES = ["C", "F", "K"] as const;

export function convertUnit(category: UnitCategory, value: number, from: string, to: string): number {
  if (!Number.isFinite(value)) throw new Error("Value must be a finite number");
  if (category === "temperature") return convertTemperature(value, from, to);
  const table = UNIT_GROUPS[category];
  if (!(from in table) || !(to in table)) throw new Error("Unknown unit");
  return (value * table[from]) / table[to];
}

export function convertTemperature(value: number, from: string, to: string): number {
  const celsius = toCelsius(value, from);
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  if (to === "K") {
    const k = celsius + 273.15;
    if (k < 0) throw new Error("Temperature is below absolute zero");
    return k;
  }
  throw new Error("Unknown temperature unit");
}

function toCelsius(value: number, from: string): number {
  if (from === "C") return value;
  if (from === "F") return ((value - 32) * 5) / 9;
  if (from === "K") {
    if (value < 0) throw new Error("Kelvin cannot be negative");
    return value - 273.15;
  }
  throw new Error("Unknown temperature unit");
}

const DIGITS = "0123456789ABCDEF";

export function convertBase(raw: string, from: 2 | 8 | 10 | 16, to: 2 | 8 | 10 | 16): string {
  const text = raw.trim().toUpperCase();
  if (!text) throw new Error("Enter a value");
  const negative = text.startsWith("-");
  const body = negative ? text.slice(1) : text;
  if (!/^[0-9A-F]+$/.test(body)) throw new Error("Digits are not valid for this base");
  for (const char of body) {
    const digit = DIGITS.indexOf(char);
    if (digit < 0 || digit >= from) throw new Error(`Digit ${char} is not valid in base ${from}`);
  }
  if (body.length > 16) throw new Error("Value is too long");
  const magnitude = parseInt(body, from);
  if (!Number.isSafeInteger(magnitude)) throw new Error("Value does not fit an exact integer");
  const converted = magnitude.toString(to).toUpperCase();
  return negative ? `-${converted}` : converted;
}
