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
import { useTheme } from 'next-themes';
import { ChartTooltip } from './chart-tooltip';
import { formatCurrency } from '@/lib/format';
import type { MonthlyCashflow } from '@/lib/types';

interface CashflowChartProps {
  cashflows: MonthlyCashflow[];
  periodType: 'monthly' | 'yearly';
  initialInvestment: number;
  mounted: boolean;
}

/** Expands yearly cashflows into monthly points so the chart always plots smoothly */
function toMonthlySeries(cashflows: MonthlyCashflow[], periodType: 'monthly' | 'yearly'): MonthlyCashflow[] {
  if (periodType !== 'yearly') return cashflows;
  const result: MonthlyCashflow[] = [];
  cashflows.forEach((cf) => {
    const monthlyAmount = cf.netCashflow / 12;
    const startMonth = (cf.month - 1) * 12 + 1;
    for (let i = 0; i < 12; i++) {
      result.push({ month: startMonth + i, netCashflow: monthlyAmount });
    }
  });
  return result;
}

export function CashflowChart({ cashflows, periodType, initialInvestment, mounted }: CashflowChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const series = toMonthlySeries(cashflows, periodType);
  let cumulative = -Math.abs(initialInvestment);
  const chartData = series.map(({ month, netCashflow }) => {
    cumulative += netCashflow;
    return { month, cumulative };
  });

  return (
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
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                label={{ value: 'Month', position: 'insideBottomRight', offset: -5, fill: '#475569', fontSize: 11 }}
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
                label={{ value: 'Break-even', position: 'insideTopRight', fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke={isDark ? '#F8FAFC' : '#0F172A'}
                strokeWidth={2.5}
                fill="url(#positiveGrad)"
                dot={false}
                activeDot={{ r: 5, fill: isDark ? '#0F172A' : '#F8FAFC', stroke: isDark ? '#F8FAFC' : '#0F172A', strokeWidth: 2 }}
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
  );
}
