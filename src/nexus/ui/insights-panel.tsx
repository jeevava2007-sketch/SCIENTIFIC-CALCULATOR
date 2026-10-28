import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { summarizeUsage } from "../engine/analytics";
import { useNexus } from "../store";
import { Panel } from "./panel";

export default function InsightsPanel() {
  const history = useNexus((s) => s.history);
  const summary = summarizeUsage(history.map((item) => ({ expression: item.expression, at: item.at })));
  return (
    <Panel eyebrow="Insights" title="From your calculations">
      <p className="text-sm text-muted">Charts count only calculations stored in history. There is no sample data.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Calculations" value={String(summary.total)} />
        <Metric label="Last 7 days" value={String(summary.last7Days)} />
        <Metric label="Distinct functions" value={String(summary.functionUsage.length)} />
      </div>
      {summary.days.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Run a calculation with = and the daily chart will use that record.</p>
      ) : (
        <div className="mt-6 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.days}>
              <XAxis dataKey="date" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-accent)" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <h3 className="mt-6 text-sm font-semibold">Function usage</h3>
      {summary.functionUsage.length === 0 ? <p className="text-sm text-muted">No function calls recorded yet.</p> : null}
      <ul className="mt-2 space-y-1 text-sm">
        {summary.functionUsage.map((item) => (
          <li key={item.name} className="flex justify-between border-b border-line py-1 font-mono">
            <span>{item.name}</span>
            <span>{item.count}</span>
          </li>
        ))}
      </ul>
      {summary.weeks.length ? (
        <>
          <h3 className="mt-6 text-sm font-semibold">Weeks</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {summary.weeks.map((week) => (
              <li key={week.week} className="flex justify-between">
                <span>{week.week}</span>
                <span>{week.count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-3 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-mono text-2xl">{value}</p>
    </div>
  );
}
