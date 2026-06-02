'use client';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Clock, TrendingUp, DollarSign, Activity } from 'lucide-react';
import type { CalculationResults, MacroInputs, MonthlyCashflow } from '@/lib/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

function formatPercent(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return `${value.toFixed(2)}%`;
}

function formatPBP(value: number | null): string {
  if (value === null) return 'Never';
  return `${value.toFixed(1)} mo`;
}

// ---------------------------------------------------------------------------
// Metric Card
// ---------------------------------------------------------------------------
interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  highlight?: 'green' | 'red' | 'amber' | null;
}

function MetricCard({ id, label, value, icon, accent, highlight }: MetricCardProps) {
  const valueColor =
    highlight === 'green'
      ? 'text-emerald-400'
      : highlight === 'red'
      ? 'text-rose-400'
      : highlight === 'amber'
      ? 'text-amber-400'
      : 'text-slate-100';

  return (
    <div
      id={id}
      className="
        relative overflow-hidden
        rounded-2xl p-5
        bg-slate-900/70 border border-slate-800/60
        backdrop-blur-sm
        transition-transform duration-200 hover:-translate-y-0.5
        group
      "
    >
      <div
        className={`
          absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10
          blur-2xl group-hover:opacity-20 transition-opacity duration-300
          ${accent}
        `}
      />
      <div
        className={`
          flex items-center justify-center
          w-10 h-10 rounded-xl mb-4
          ${accent} opacity-90
        `}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Tooltip for Chart
// ---------------------------------------------------------------------------
interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">Month {label}</p>
      <p
        className={`text-sm font-bold ${
          value >= 0 ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {value >= 0 ? '+' : ''}
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RightPanel Component
// ---------------------------------------------------------------------------
interface RightPanelProps {
  results: CalculationResults;
  cashflows: MonthlyCashflow[];
  inputs: MacroInputs;
}

export default function RightPanel({
  results,
  cashflows,
  inputs,
}: RightPanelProps) {
  let cumulative = -Math.abs(inputs.initialInvestment);
  const chartData = cashflows.map(({ month, netCashflow }) => {
    cumulative += netCashflow;
    return { month, cumulative };
  });

  const pbpHighlight: 'green' | 'red' | 'amber' | null =
    results.pbp === null
      ? 'red'
      : results.pbpIsIdeal
      ? 'green'
      : 'amber';

  const npvHighlight: 'green' | 'red' | null =
    results.npv > 0 ? 'green' : results.npv < 0 ? 'red' : null;

  return (
    <div
      id="right-panel"
      className="flex flex-col gap-6 flex-1 p-6 overflow-y-auto"
    >
      {/* ── Metric Cards Grid ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Key Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            id="metric-pbp"
            label="Payback Period"
            value={formatPBP(results.pbp)}
            icon={<Clock className="w-5 h-5 text-white" />}
            accent="bg-gradient-to-br from-violet-500 to-purple-600"
            highlight={pbpHighlight}
          />
          <MetricCard
            id="metric-roi"
            label="ROI"
            value={formatPercent(results.roi)}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            accent="bg-gradient-to-br from-emerald-500 to-teal-600"
            highlight={results.roi > 0 ? 'green' : results.roi < 0 ? 'red' : null}
          />
          <MetricCard
            id="metric-npv"
            label="NPV"
            value={
              isNaN(results.npv)
                ? '—'
                : `${results.npv >= 0 ? '+' : ''}${formatCurrency(results.npv)}`
            }
            icon={<DollarSign className="w-5 h-5 text-white" />}
            accent="bg-gradient-to-br from-sky-500 to-blue-600"
            highlight={npvHighlight}
          />
          <MetricCard
            id="metric-irr"
            label="IRR (Annual)"
            value={isNaN(results.irr) ? '—' : formatPercent(results.irr)}
            icon={<Activity className="w-5 h-5 text-white" />}
            accent="bg-gradient-to-br from-orange-500 to-rose-600"
            highlight={results.irr > 0 ? 'green' : results.irr < 0 ? 'red' : null}
          />
        </div>

        {results.pbp !== null && (
          <p
            className={`mt-3 text-xs font-medium ${
              results.pbpIsIdeal ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {results.pbpIsIdeal
              ? `✓ PBP of ${results.pbp.toFixed(1)} months is within the ${inputs.targetPbp}-month target.`
              : `⚠ PBP of ${results.pbp.toFixed(1)} months exceeds the ${inputs.targetPbp}-month ideal target.`}
          </p>
        )}
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* ── Cumulative Cashflow Chart ── */}
      <section className="flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-sky-400 to-blue-500" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Cumulative Cashflow
          </h2>
          <span className="ml-auto text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
            Break-even at Y = 0
          </span>
        </div>

        <div
          id="cashflow-chart"
          className="
            rounded-2xl p-4
            bg-slate-900/60 border border-slate-800/60
            backdrop-blur-sm
            min-h-[280px] flex-1
          "
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1e293b' }}
                label={{
                  value: 'Month',
                  position: 'insideBottomRight',
                  offset: -5,
                  fill: '#475569',
                  fontSize: 11,
                }}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v as number)}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={0}
                stroke="#7c3aed"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{
                  value: 'Break-even',
                  position: 'insideTopRight',
                  fill: '#7c3aed',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#positiveGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#6366f1',
                  stroke: '#1e293b',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
