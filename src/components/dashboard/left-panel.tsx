'use client';

import { DollarSign, Percent, TrendingUp, Clock } from 'lucide-react';
import type { UseFinancialDataReturn } from '@/src/hooks/use-financial-data';

interface LeftPanelProps {
  hook: UseFinancialDataReturn;
}

function formatNumberInput(value: number): string {
  return value === 0 ? '' : String(value);
}

export default function LeftPanel({ hook }: LeftPanelProps) {
  const {
    inputs,
    cashflows,
    setInitialInvestment,
    setDiscountRate,
    updateCashflow,
  } = hook;

  return (
    <aside
      id="left-panel"
      className="
        flex flex-col gap-6
        w-full lg:w-[380px] xl:w-[420px] shrink-0
        overflow-y-auto
        bg-slate-900/60 backdrop-blur-sm
        border-r border-slate-800/60
        p-6
      "
    >
      {/* ── Section: Macro Inputs ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Macro Data
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Initial Investment */}
          <div className="group">
            <label
              htmlFor="initial-investment-input"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Initial Investment (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                id="initial-investment-input"
                type="number"
                min={0}
                step={1000000}
                placeholder="e.g. 25000000"
                value={formatNumberInput(inputs.initialInvestment)}
                onChange={(e) =>
                  setInitialInvestment(parseFloat(e.target.value) || 0)
                }
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  bg-slate-800/80 border border-slate-700/60
                  text-slate-100 text-sm placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                  transition-all duration-200
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />
            </div>
          </div>

          {/* Discount Rate */}
          <div className="group">
            <label
              htmlFor="discount-rate-input"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Annual Discount Rate (%)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Percent className="w-4 h-4" />
              </span>
              <input
                id="discount-rate-input"
                type="number"
                min={0}
                max={100}
                step={0.5}
                placeholder="e.g. 10"
                value={formatNumberInput(inputs.discountRate)}
                onChange={(e) =>
                  setDiscountRate(parseFloat(e.target.value) || 0)
                }
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  bg-slate-800/80 border border-slate-700/60
                  text-slate-100 text-sm placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                  transition-all duration-200
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />
            </div>
          </div>

          {/* Target PBP */}
          <div className="group">
            <label
              htmlFor="target-pbp-input"
              className="block text-xs font-medium text-slate-400 mb-1.5"
            >
              Target PBP (Months)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Clock className="w-4 h-4" />
              </span>
              <input
                id="target-pbp-input"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 18"
                value={formatNumberInput(inputs.targetPbp)}
                onChange={(e) =>
                  hook.setTargetPbp(parseFloat(e.target.value) || 0)
                }
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  bg-slate-800/80 border border-slate-700/60
                  text-slate-100 text-sm placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                  transition-all duration-200
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* ── Section: Monthly Cashflows ── */}
      <section className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Monthly Net Cashflows
          </h2>
          <span className="ml-auto text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
            36 Months
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[56px_1fr] gap-3 px-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Month
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Net Cashflow (IDR)
          </span>
        </div>

        {/* Scrollable list */}
        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-480px)] pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {cashflows.map(({ month, netCashflow }) => (
            <div
              key={month}
              className="
                grid grid-cols-[56px_1fr] items-center gap-3
                group
              "
            >
              {/* Month badge */}
              <div
                className="
                  flex items-center justify-center
                  h-9 rounded-lg
                  bg-slate-800/60 border border-slate-700/40
                  text-xs font-semibold text-slate-500
                  group-focus-within:border-violet-500/40 group-focus-within:text-violet-400
                  transition-colors duration-150
                "
              >
                <TrendingUp className="w-3 h-3 mr-1 opacity-60" />
                {month}
              </div>

              {/* Cashflow input */}
              <input
                id={`cashflow-month-${month}`}
                type="number"
                step={100000}
                placeholder="0"
                value={netCashflow === 0 ? '' : String(netCashflow)}
                onChange={(e) =>
                  updateCashflow(month, parseFloat(e.target.value) || 0)
                }
                className="
                  w-full px-3 py-2 rounded-lg h-9
                  bg-slate-800/60 border border-slate-700/40
                  text-slate-200 text-sm placeholder-slate-700
                  focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40
                  transition-all duration-150
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
