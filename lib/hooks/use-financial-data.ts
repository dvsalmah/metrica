'use client';

import { useState, useMemo, useCallback } from 'react';
import type { MacroInputs, MonthlyCashflow, CalculationResults, UseFinancialDataReturn } from '@/lib/types';
import { runCalculations } from '@/lib/calculations';
import {
  generateEmptyCashflows,
  buildSampleCashflows,
  DEFAULT_INPUTS,
  SAMPLE_INPUTS,
} from '@/lib/services/financial';

export function useFinancialData(): UseFinancialDataReturn {
  const [inputs, setInputs] = useState<MacroInputs>(DEFAULT_INPUTS);
  const [periodType, setPeriodTypeState] = useState<'monthly' | 'yearly'>('monthly');
  const [projectionLength, setProjectionLengthState] = useState<number>(3);
  const [cashflows, setCashflows] = useState<MonthlyCashflow[]>(() => generateEmptyCashflows('monthly', 3));

  const results = useMemo<CalculationResults>(
    () => runCalculations(inputs, cashflows, periodType),
    [inputs, cashflows, periodType]
  );

  const setPeriodType = useCallback((type: 'monthly' | 'yearly') => {
    setPeriodTypeState(type);
    setCashflows(generateEmptyCashflows(type, projectionLength));
  }, [projectionLength]);

  const setProjectionLength = useCallback((length: number) => {
    setProjectionLengthState(length);
    setCashflows((prev) => {
      const empty = generateEmptyCashflows(periodType, length);
      return empty.map(cf => {
        const existing = prev.find(p => p.month === cf.month);
        return existing ? existing : cf;
      });
    });
  }, [periodType]);

  const setInitialInvestment = useCallback((value: number) => {
    setInputs((prev) => ({ ...prev, initialInvestment: value }));
  }, []);

  const setDiscountRate = useCallback((value: number) => {
    setInputs((prev) => ({ ...prev, discountRate: value }));
  }, []);

  const setTargetPbp = useCallback((value: number) => {
    setInputs((prev) => ({ ...prev, targetPbp: value }));
  }, []);

  const updateCashflow = useCallback((month: number, netCashflow: number) => {
    setCashflows((prev) =>
      prev.map((cf) => (cf.month === month ? { ...cf, netCashflow } : cf))
    );
  }, []);

  const loadSampleData = useCallback(() => {
    setInputs(SAMPLE_INPUTS);
    setPeriodTypeState('monthly');
    setProjectionLengthState(3);
    setCashflows(buildSampleCashflows('monthly', 3));
  }, []);

  const resetData = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setCashflows(generateEmptyCashflows(periodType, projectionLength));
  }, [periodType, projectionLength]);

  return {
    inputs,
    cashflows,
    results,
    setInitialInvestment,
    setDiscountRate,
    setTargetPbp,
    updateCashflow,
    loadSampleData,
    resetData,
    periodType,
    projectionLength,
    setPeriodType,
    setProjectionLength,
  };
}
