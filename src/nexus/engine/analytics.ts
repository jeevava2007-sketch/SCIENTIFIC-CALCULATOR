export type UsageEntry = {
  expression: string;
  at: number;
};

const FN_RE =
  /\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|log10|log2|log|exp|sqrt|cbrt|nthRoot|abs|factorial|combinations|permutations|gcd|lcm|round|floor|ceil|pow|min|max|sign|mod)\s*\(/g;

export function summarizeUsage(entries: UsageEntry[], now = Date.now()) {
  const byDay = new Map<string, number>();
  const byWeek = new Map<string, number>();
  const functions = new Map<string, number>();
  for (const entry of entries) {
    if (!Number.isFinite(entry.at)) continue;
    const day = isoDay(entry.at);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
    const week = isoWeek(entry.at);
    byWeek.set(week, (byWeek.get(week) ?? 0) + 1);
    for (const match of entry.expression.matchAll(FN_RE)) {
      const name = match[1] === "log" ? "ln" : match[1];
      functions.set(name, (functions.get(name) ?? 0) + 1);
    }
  }
  const days = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
  const weeks = [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));
  const functionUsage = [...functions.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  return {
    total: entries.length,
    last7Days: entries.filter((entry) => entry.at >= weekAgo && entry.at <= now + 1000).length,
    days,
    weeks,
    functionUsage,
  };
}

function isoDay(at: number): string {
  const date = new Date(at);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoWeek(at: number): string {
  const date = new Date(at);
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
