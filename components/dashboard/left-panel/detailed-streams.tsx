'use client';

import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { UseFormRegister } from 'react-hook-form';
import type { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import type { ProjectPayload, RevenueItem, OpexItem } from '@/lib/types';

interface StreamSectionProps<T> {
  title: string;
  icon: React.ReactNode;
  fields: FieldArrayWithId<ProjectPayload, any>[];
  onAdd: () => void;
  onRemove: UseFieldArrayRemove;
  emptyMessage: string;
  children: (field: FieldArrayWithId<ProjectPayload, any>, index: number) => React.ReactNode;
}

function StreamSection<T>({ title, icon, fields, onAdd, onRemove, emptyMessage, children }: StreamSectionProps<T>) {
  return (
    <section className="shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl relative group">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 gap-2 pr-6">
              {children(field, index)}
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-4">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}

interface DetailedStreamsProps {
  register: UseFormRegister<ProjectPayload>;
  revenueFields: FieldArrayWithId<ProjectPayload, 'revenues'>[];
  appendRevenue: UseFieldArrayAppend<ProjectPayload, 'revenues'>;
  removeRevenue: UseFieldArrayRemove;
  opexFields: FieldArrayWithId<ProjectPayload, 'opex'>[];
  appendOpex: UseFieldArrayAppend<ProjectPayload, 'opex'>;
  removeOpex: UseFieldArrayRemove;
}

export function DetailedStreams({
  register,
  revenueFields,
  appendRevenue,
  removeRevenue,
  opexFields,
  appendOpex,
  removeOpex,
}: DetailedStreamsProps) {
  return (
    <>
      <Separator className="bg-slate-200 dark:bg-slate-800/60" />

      <StreamSection
        title="Revenue Streams"
        icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
        fields={revenueFields}
        onAdd={() => appendRevenue({ id: crypto.randomUUID(), name: '', monthlyRevenue: 0, growthRate: 0 })}
        onRemove={removeRevenue}
        emptyMessage="No revenue streams added."
      >
        {(_, index) => (
          <>
            <Input
              placeholder="Revenue Name (e.g. Subscriptions)"
              {...register(`revenues.${index}.name` as const)}
              className="h-8 text-sm border-transparent bg-transparent px-1 focus-visible:ring-1 focus-visible:bg-white dark:focus-visible:bg-slate-900 font-medium"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Monthly (IDR)</span>
                <Input type="number" {...register(`revenues.${index}.monthlyRevenue` as const, { valueAsNumber: true })} className="h-9 text-sm" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Ann. Growth (%)</span>
                <Input type="number" {...register(`revenues.${index}.growthRate` as const, { valueAsNumber: true })} className="h-9 text-sm" />
              </div>
            </div>
          </>
        )}
      </StreamSection>

      <Separator className="bg-slate-200 dark:bg-slate-800" />

      <StreamSection
        title="Operational Expenses"
        icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
        fields={opexFields}
        onAdd={() => appendOpex({ id: crypto.randomUUID(), name: '', monthlyCost: 0, escalationRate: 0 })}
        onRemove={removeOpex}
        emptyMessage="No operational expenses added."
      >
        {(_, index) => (
          <>
            <Input
              placeholder="Expense Name (e.g. Server Cost)"
              {...register(`opex.${index}.name` as const)}
              className="h-8 text-sm border-transparent bg-transparent px-1 focus-visible:ring-1 focus-visible:bg-white dark:focus-visible:bg-slate-900 font-medium"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Monthly (IDR)</span>
                <Input type="number" {...register(`opex.${index}.monthlyCost` as const, { valueAsNumber: true })} className="h-9 text-sm" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Escalation (%)</span>
                <Input type="number" {...register(`opex.${index}.escalationRate` as const, { valueAsNumber: true })} className="h-9 text-sm" />
              </div>
            </div>
          </>
        )}
      </StreamSection>
    </>
  );
}
