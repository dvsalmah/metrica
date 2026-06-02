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
  const [cashflows, setCashflows] = useState<MonthlyCashflow[]>(generateEmptyCashflows);

  const results = useMemo<CalculationResults>(
    () => runCalculations(inputs, cashflows),
    [inputs, cashflows]
  );

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
    setCashflows(buildSampleCashflows());
  }, []);

  const resetData = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setCashflows(generateEmptyCashflows());
  }, []);

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
  };
}
