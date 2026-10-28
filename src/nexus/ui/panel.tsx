import type { ReactNode } from "react";

export function Panel({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-sm text-muted">
      {label}
      {children}
    </label>
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-xl border border-line bg-bg/50 px-3 text-fg outline-none";
