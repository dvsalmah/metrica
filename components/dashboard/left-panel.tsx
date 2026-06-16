'use client';

import { useEffect, useRef } from 'react';
import { Coins, Percent, Clock, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectPayloadSchema, type ProjectPayload } from '@/lib/types';
import { useProjectStore } from '@/lib/store/use-project-store';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

export default function LeftPanel() {
  const { payload, setPayload } = useProjectStore();

  const form = useForm<ProjectPayload>({
    resolver: zodResolver(projectPayloadSchema),
    defaultValues: payload,
    mode: 'onChange',
  });

  const { control, register, watch, reset } = form;

  const {
    fields: revenueFields,
    append: appendRevenue,
    remove: removeRevenue,
  } = useFieldArray({ control, name: 'revenues' });

  const {
    fields: opexFields,
    append: appendOpex,
    remove: removeOpex,
  } = useFieldArray({ control, name: 'opex' });

  const formValues = watch();
  const prevFormValues = useRef<ProjectPayload>(payload);

  useEffect(() => {
    if (JSON.stringify(payload) !== JSON.stringify(prevFormValues.current)) {
      reset(payload);
      prevFormValues.current = payload;
    }
  }, [payload, reset]);

  // Sync from Form to Zustand
  useEffect(() => {
    const result = projectPayloadSchema.safeParse(formValues);
    if (result.success) {
      if (JSON.stringify(result.data) !== JSON.stringify(payload)) {
        prevFormValues.current = result.data;
        setPayload(result.data);
      }
    }
  }, [formValues, payload, setPayload]);

  return (
    <aside
      id="left-panel"
      className="
        flex flex-col gap-6
        w-full lg:w-105 xl:w-115 shrink-0
        flex-none h-auto lg:h-full lg:overflow-hidden
        bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
        border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/60
        shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]
        transition-colors duration-300
        p-6 relative z-10
      "
    >
      <div className="flex flex-col gap-6 h-auto lg:h-full overflow-visible lg:overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
        
        {/* ── Section: Macro Inputs ── */}
        <section className="shrink-0">
          <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b " />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Macro Data
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Initial Investment */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Initial Investment (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Coins className="w-4 h-4" />
                </span>
                <Input
                  type="number"
                  step={1000000}
                  {...register('initialInvestment', { valueAsNumber: true })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Discount Rate */}
              <div className="group">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Discount (%)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Percent className="w-3.5 h-3.5" />
                  </span>
                  <Input
                    type="number"
                    step={0.5}
                    {...register('discountRate', { valueAsNumber: true })}
                    className="w-full pl-8 pr-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm [appearance:textfield]"
                  />
                </div>
              </div>

              {/* Target PBP */}
              <div className="group">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Target (Mo)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  <Input
                    type="number"
                    step={1}
                    {...register('targetPbp', { valueAsNumber: true })}
                    className="w-full pl-8 pr-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm [appearance:textfield]"
                  />
                </div>
              </div>

              {/* Period Type */}
              <div className="group">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Period Type
                </label>
                <div className="relative">
                  <select
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm opacity-70 cursor-not-allowed appearance-none"
                  >
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Projection Length */}
              <div className="group">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Length (Yrs)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step={1}
                    {...register('projectionLength', { valueAsNumber: true })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-slate-200 dark:bg-slate-800" />

        {/* ── Section: Revenue Streams ── */}
        <section className="shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                Revenue Streams
              </h2>
            </div>
            <button
              type="button"
              onClick={() => appendRevenue({ id: crypto.randomUUID(), name: '', monthlyRevenue: 0, growthRate: 0 })}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {revenueFields.map((field, index) => (
              <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl relative group">
                <button
                  type="button"
                  onClick={() => removeRevenue(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 gap-2 pr-6">
                  <Input
                    placeholder="Revenue Name (e.g. Subscriptions)"
                    {...register(`revenues.${index}.name` as const)}
                    className="h-8 text-sm border-transparent bg-transparent px-1 focus-visible:ring-1 focus-visible:bg-white dark:focus-visible:bg-slate-900 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Monthly (IDR)</span>
                      <Input
                        type="number"
                        {...register(`revenues.${index}.monthlyRevenue` as const, { valueAsNumber: true })}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Ann. Growth (%)</span>
                      <Input
                        type="number"
                        {...register(`revenues.${index}.growthRate` as const, { valueAsNumber: true })}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {revenueFields.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">No revenue streams added.</p>
            )}
          </div>
        </section>

        <Separator className="bg-slate-200 dark:bg-slate-800" />

        {/* ── Section: OPEX Items ── */}
        <section className="shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                Operational Expenses
              </h2>
            </div>
            <button
              type="button"
              onClick={() => appendOpex({ id: crypto.randomUUID(), name: '', monthlyCost: 0, escalationRate: 0 })}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {opexFields.map((field, index) => (
              <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl relative group">
                <button
                  type="button"
                  onClick={() => removeOpex(index)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 gap-2 pr-6">
                  <Input
                    placeholder="Expense Name (e.g. Server Cost)"
                    {...register(`opex.${index}.name` as const)}
                    className="h-8 text-sm border-transparent bg-transparent px-1 focus-visible:ring-1 focus-visible:bg-white dark:focus-visible:bg-slate-900 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Monthly (IDR)</span>
                      <Input
                        type="number"
                        {...register(`opex.${index}.monthlyCost` as const, { valueAsNumber: true })}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Escalation (%)</span>
                      <Input
                        type="number"
                        {...register(`opex.${index}.escalationRate` as const, { valueAsNumber: true })}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {opexFields.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">No operational expenses added.</p>
            )}
          </div>
        </section>

      </div>
    </aside>
  );
}
