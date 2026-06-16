'use client';

import { Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { UseFormRegister } from 'react-hook-form';
import type { FieldArrayWithId } from 'react-hook-form';
import type { ProjectPayload } from '@/lib/types';

interface GeneralCashflowsProps {
  register: UseFormRegister<ProjectPayload>;
  fields: FieldArrayWithId<ProjectPayload, 'generalCashflows'>[];
  periodType: 'monthly' | 'yearly';
}

export function GeneralCashflows({ register, fields, periodType }: GeneralCashflowsProps) {
  const label = periodType === 'yearly' ? 'Yearly' : 'Monthly';
  const periodLabel = periodType === 'yearly' ? 'Year' : 'Month';

  return (
    <>
      <Separator className="bg-slate-200 dark:bg-slate-800/60" />

      <section className="shrink-0 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {label} Net Cashflows
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="group relative bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors"
            >
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                {periodLabel} {index + 1}
              </h3>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Net Cashflow
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Coins className="w-3.5 h-3.5" />
                  </span>
                  <Input
                    type="number"
                    step={10000}
                    {...register(`generalCashflows.${index}.netCashflow`, { valueAsNumber: true })}
                    className="w-full pl-8 pr-2 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm [appearance:textfield]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
