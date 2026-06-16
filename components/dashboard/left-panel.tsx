'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Coins, Percent, Clock, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectPayloadSchema, type ProjectPayload } from '@/lib/types';
import { useProjectStore } from '@/lib/store/use-project-store';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

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

  const {
    fields: generalFields,
  } = useFieldArray({ control, name: 'generalCashflows' });

  const currentMode = watch('mode');
  const currentPeriodType = watch('periodType');
  const currentLength = watch('projectionLength');

  useEffect(() => {
    if (currentMode === 'detailed') {
      if (currentPeriodType !== 'yearly') {
        form.setValue('periodType', 'yearly', { shouldValidate: true });
      }
    } else if (currentMode === 'general') {
      const requiredLength = currentPeriodType === 'yearly' ? currentLength : currentLength * 12;
      const currentCashflows = form.getValues('generalCashflows') || [];
      if (currentCashflows.length !== requiredLength) {
        const newCashflows = [];
        for (let i = 0; i < requiredLength; i++) {
          newCashflows.push(currentCashflows[i] || { month: i + 1, netCashflow: 0 });
        }
        form.setValue('generalCashflows', newCashflows, { shouldValidate: true });
      }
    }
  }, [currentMode, currentPeriodType, currentLength, form]);

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
        
        {/* ── Mode Selector ── */}
        <section className="shrink-0">


          <Tabs
            defaultValue={currentMode}
            onValueChange={(value) => form.setValue('mode', value as 'detailed' | 'general')}
            className="mb-6 w-full"
          >
            <TabsList variant="line" className="w-full flex justify-start border-b border-slate-200 dark:border-slate-800/60 pb-1">
              <TabsTrigger 
                value="detailed" 
                className="flex-1 relative cursor-pointer after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent bg-transparent"
              >
                Detailed Streams
                {currentMode === 'detailed' && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-slate-100 rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="general" 
                className="flex-1 relative cursor-pointer after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent bg-transparent"
              >
                General Input
                {currentMode === 'general' && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 dark:bg-slate-100 rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
                    disabled={currentMode === 'detailed'}
                    {...register('periodType')}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm disabled:opacity-70 disabled:cursor-not-allowed appearance-none"
                  >
                    {currentMode === 'general' && <option value="monthly">Monthly</option>}
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

        {currentMode === 'detailed' ? (
          <>
            <Separator className="bg-slate-200 dark:bg-slate-800/60" />

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
          </>
        ) : (
          <>
            <Separator className="bg-slate-200 dark:bg-slate-800/60" />
            
            {/* ── Section: General Cashflows ── */}
            <section className="shrink-0 pb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  {currentPeriodType === 'yearly' ? 'Yearly' : 'Monthly'} Net Cashflows
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {generalFields.map((field, index) => (
                  <div key={field.id} className="group relative bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {currentPeriodType === 'yearly' ? 'Year ' : 'Month '} {index + 1}
                      </h3>
                    </div>
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
        )}
      </div>
    </aside>
  );
}
