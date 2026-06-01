'use client';

import { useState, useMemo, useCallback } from 'react';
import type { MacroInputs, MonthlyCashflow, CalculationResults } from '@/src/types';
import { runCalculations } from '@/src/lib/calculations';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MONTH_COUNT = 36;

function generateEmptyCashflows(): MonthlyCashflow[] {
  return Array.from({ length: MONTH_COUNT }, (_, i) => ({
    month: i + 1,
    netCashflow: 0,
  }));
}

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------
export interface UseFinancialDataReturn {
  inputs: MacroInputs;
  cashflows: MonthlyCashflow[];
  results: CalculationResults;
  setInitialInvestment: (value: number) => void;
  setDiscountRate: (value: number) => void;
  setTargetPbp: (value: number) => void;
  updateCashflow: (month: number, netCashflow: number) => void;
  loadSampleData: () => void;
  resetData: () => void;
}

// ---------------------------------------------------------------------------
// Sample data for demonstration
// ---------------------------------------------------------------------------
function buildSampleCashflows(): MonthlyCashflow[] {
  // Ramp-up pattern: slow start → growth → steady state
  const base = [
    500000, 800000, 1000000, 1200000, 1500000, 1800000,
    2000000, 2200000, 2400000, 2500000, 2600000, 2700000,
    2800000, 2900000, 3000000, 3100000, 3100000, 3200000,
    3200000, 3300000, 3300000, 3400000, 3400000, 3500000,
    3500000, 3500000, 3600000, 3600000, 3700000, 3700000,
    3800000, 3800000, 3900000, 3900000, 4000000, 4000000,
  ];
  return base.map((netCashflow, i) => ({ month: i + 1, netCashflow }));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useFinancialData(): UseFinancialDataReturn {
  const [inputs, setInputs] = useState<MacroInputs>({
    initialInvestment: 0,
    discountRate: 10,
    targetPbp: 18,
  });

  const [cashflows, setCashflows] = useState<MonthlyCashflow[]>(
    generateEmptyCashflows
  );

  // Memoised calculation — only re-runs when inputs or cashflows change
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
    setInputs({ initialInvestment: 25000000, discountRate: 12, targetPbp: 18 });
    setCashflows(buildSampleCashflows());
  }, []);

  const resetData = useCallback(() => {
    setInputs({ initialInvestment: 0, discountRate: 10, targetPbp: 18 });
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
