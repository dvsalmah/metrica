'use client';

import { Coins, Percent, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { UseFormRegister } from 'react-hook-form';
import type { ProjectPayload } from '@/lib/types';

const inputBase = 'w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 text-sm';

interface MacroInputsProps {
  register: UseFormRegister<ProjectPayload>;
  currentMode: 'general' | 'detailed';
}

export function MacroInputs({ register, currentMode }: MacroInputsProps) {
  return (
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
            className={`${inputBase} pl-9 pr-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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
              className={`${inputBase} pl-8 pr-2 [appearance:textfield]`}
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
              className={`${inputBase} pl-8 pr-2 [appearance:textfield]`}
            />
          </div>
        </div>

        {/* Period Type */}
        <div className="group">
          <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Period Type
          </label>
          <select
            disabled={currentMode === 'detailed'}
            {...register('periodType')}
            className={`${inputBase} px-3 disabled:opacity-70 disabled:cursor-not-allowed appearance-none`}
          >
            {currentMode === 'general' && <option value="monthly">Monthly</option>}
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Projection Length */}
        <div className="group">
          <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Length (Yrs)
          </label>
          <Input
            type="number"
            step={1}
            {...register('projectionLength', { valueAsNumber: true })}
            className={`${inputBase} px-3`}
          />
        </div>
      </div>
    </div>
  );
}
