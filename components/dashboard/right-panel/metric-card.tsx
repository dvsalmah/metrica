'use client';

type Highlight = 'green' | 'red' | 'amber' | null;

interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  highlight?: Highlight;
}

const highlightColors: Record<NonNullable<Highlight>, string> = {
  green: 'text-emerald-400',
  red: 'text-rose-400',
  amber: 'text-amber-500 dark:text-amber-400',
};

export function MetricCard({ id, label, value, highlight }: MetricCardProps) {
  const valueColor = highlight ? highlightColors[highlight] : 'text-slate-900 dark:text-slate-100';

  return (
    <div
      id={id}
      className="
        relative overflow-hidden
        rounded-2xl p-4
        bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/60
        backdrop-blur-sm
        transition-transform duration-200 hover:-translate-y-0.5
        group flex flex-col justify-between
      "
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300" />

      <div className="flex items-center mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400 leading-tight">
          {label}
        </p>
      </div>

      <p className={`text-2xl font-bold tabular-nums ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}
