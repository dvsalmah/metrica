'use client';

import { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectPayloadSchema, type ProjectPayload } from '@/lib/types';
import { useProjectStore } from '@/lib/store/use-project-store';
import { ModeSelector } from './mode-selector';
import { MacroInputs } from './macro-inputs';
import { DetailedStreams } from './detailed-streams';
import { GeneralCashflows } from './general-cashflows';

export default function LeftPanel() {
  const { payload, setPayload } = useProjectStore();

  const form = useForm<ProjectPayload>({
    resolver: zodResolver(projectPayloadSchema),
    defaultValues: payload,
    mode: 'onChange',
  });

  const { control, register, watch, reset } = form;

  const { fields: revenueFields, append: appendRevenue, remove: removeRevenue } =
    useFieldArray({ control, name: 'revenues' });
  const { fields: opexFields, append: appendOpex, remove: removeOpex } =
    useFieldArray({ control, name: 'opex' });
  const { fields: generalFields } =
    useFieldArray({ control, name: 'generalCashflows' });

  const currentMode = watch('mode');
  const currentPeriodType = watch('periodType');
  const currentLength = watch('projectionLength');

  // Lock periodType to yearly in detailed mode; auto-size generalCashflows in general mode
  useEffect(() => {
    if (currentMode === 'detailed') {
      if (currentPeriodType !== 'yearly') {
        form.setValue('periodType', 'yearly', { shouldValidate: true });
      }
      return;
    }
    const requiredLength = currentPeriodType === 'yearly' ? currentLength : currentLength * 12;
    const current = form.getValues('generalCashflows') || [];
    if (current.length !== requiredLength) {
      form.setValue(
        'generalCashflows',
        Array.from({ length: requiredLength }, (_, i) => current[i] ?? { month: i + 1, netCashflow: 0 }),
        { shouldValidate: true },
      );
    }
  }, [currentMode, currentPeriodType, currentLength, form]);

  // Sync store → form (external resets / loadSampleData)
  const prevPayload = useRef<ProjectPayload>(payload);
  useEffect(() => {
    if (JSON.stringify(payload) !== JSON.stringify(prevPayload.current)) {
      reset(payload);
      prevPayload.current = payload;
    }
  }, [payload, reset]);

  // Sync form → store
  const formValues = watch();
  useEffect(() => {
    const result = projectPayloadSchema.safeParse(formValues);
    if (result.success && JSON.stringify(result.data) !== JSON.stringify(payload)) {
      prevPayload.current = result.data;
      setPayload(result.data);
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

        <section className="shrink-0">
          <ModeSelector form={form} currentMode={currentMode} />

          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Macro Data
            </h2>
          </div>

          <MacroInputs register={register} currentMode={currentMode} />
        </section>

        {currentMode === 'detailed' ? (
          <DetailedStreams
            register={register}
            revenueFields={revenueFields}
            appendRevenue={appendRevenue}
            removeRevenue={removeRevenue}
            opexFields={opexFields}
            appendOpex={appendOpex}
            removeOpex={removeOpex}
          />
        ) : (
          <GeneralCashflows
            register={register}
            fields={generalFields}
            periodType={currentPeriodType}
          />
        )}
      </div>
    </aside>
  );
}
