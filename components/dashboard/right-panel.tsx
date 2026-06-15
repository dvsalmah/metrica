'use client';

import {
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { Clock, BanknoteArrowUp, DollarSign, ArrowUpRight } from 'lucide-react';
import type { CalculationResults, MacroInputs, MonthlyCashflow } from '@/lib/types';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

// Helpers
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

// Metric Card
interface MetricCardProps {
  id: string;
  label: string;
  value: string;
  highlight?: 'green' | 'red' | 'amber' | null;
}

function MetricCard({ id, label, value, highlight }: MetricCardProps) {
  const valueColor =
    highlight === 'green'
      ? 'text-emerald-400'
      : highlight === 'red'
        ? 'text-rose-400'
        : highlight === 'amber'
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-slate-900 dark:text-slate-100';

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
      <div
        className={`
          absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10
          blur-2xl group-hover:opacity-20 transition-opacity duration-300
        `}
      />
      
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

// Custom Tooltip for Chart
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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Month {label}</p>
      <p
        className={`text-sm font-bold ${value >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
      >
        {value >= 0 ? '+' : ''}
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// RightPanel Component
interface RightPanelProps {
  results: CalculationResults;
  cashflows: MonthlyCashflow[];
  inputs: MacroInputs;
  periodType: 'monthly' | 'yearly';
}

export default function RightPanel({
  results,
  cashflows,
  inputs,
  periodType,
}: RightPanelProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  let monthlyCashflows: { month: number; netCashflow: number }[] = [];

  if (periodType === 'yearly') {
    // Expand 1 year into 12 months so the chart always plots monthly points
    cashflows.forEach((cf) => {
      const monthlyAmount = cf.netCashflow / 12;
      const startMonth = (cf.month - 1) * 12 + 1;
      for (let i = 0; i < 12; i++) {
        monthlyCashflows.push({
          month: startMonth + i,
          netCashflow: monthlyAmount,
        });
      }
    });
  } else {
    monthlyCashflows = cashflows;
  }

  let cumulative = -Math.abs(inputs.initialInvestment);
  const chartData = monthlyCashflows.map(({ month, netCashflow }) => {
    cumulative += netCashflow;
    return {
      month,
      cumulative
    };
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
      className="flex flex-col gap-6 flex-1 p-8 overflow-y-auto"
    >
      {/* ── Metric Cards Grid ── */}
      <section>
        <div className="flex items-center mb-2">
          <h2 className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
            KEY METRICS
          </h2>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
          <MetricCard
            id="metric-pbp"
            label="Payback Period"
            value={formatPBP(results.pbp)}
            highlight={pbpHighlight}
          />
          <MetricCard
            id="metric-roi"
            label="ROI"
            value={formatPercent(results.roi)}
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
            highlight={npvHighlight}
          />
          <MetricCard
            id="metric-irr"
            label="IRR (Annual)"
            value={isNaN(results.irr) ? '—' : formatPercent(results.irr)}
            highlight={results.irr > 0 ? 'green' : results.irr < 0 ? 'red' : null}
          />
        </div>

        {results.pbp !== null && (
          <p
            className={`mt-3 text-xs font-medium ${results.pbpIsIdeal ? 'text-emerald-400' : 'text-amber-400'
              }`}
          >
            {results.pbpIsIdeal
              ? `PBP of ${results.pbp.toFixed(1)} months is within the ${inputs.targetPbp}-month target.`
              : `PBP of ${results.pbp.toFixed(1)} months exceeds the ${inputs.targetPbp}-month ideal target.`}
          </p>
        )}
      </section>

      <Separator />

      {/* ── Cumulative Cashflow Chart ── */}
      <section className="flex flex-col gap-4 flex-1">
        <div className="flex items-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            CUMULATIVE CASHFLOW
          </h2>
          <span className="ml-auto text-xs text-slate-700 bg-slate-200 dark:text-slate-300 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Break-even at Y = 0
          </span>
        </div>

        <div
          id="cashflow-chart"
          className="
            rounded-2xl px-2 py-4
            bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60
            backdrop-blur-sm
            min-h-[280px] flex-1
          "
        >
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
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
                  stroke={isDark ? '#475569' : '#94a3b8'}
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{
                    value: 'Break-even',
                    position: 'insideTopRight',
                    fill: isDark ? '#94a3b8' : '#64748b',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke={isDark ? '#F8FAFC' : '#0F172A'}
                  strokeWidth={2.5}
                  fill="url(#positiveGrad)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: isDark ? '#0F172A' : '#F8FAFC', 
                    stroke: isDark ? '#F8FAFC' : '#0F172A',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Loading chart...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
