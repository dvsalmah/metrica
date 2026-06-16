'use client';

import { useMemo } from 'react';
import type { CalculationResults, MonthlyCashflow } from '@/lib/types';
import { runCalculations, generateCompoundingCashflows } from '@/lib/calculations';
import { useProjectStore } from '../store/use-project-store';

export function useFinancialData() {
  const { payload, setPayload, resetData, loadSampleData } = useProjectStore();

  const cashflows = useMemo<MonthlyCashflow[]>(() => {
    // Generate actual monthly data
    const totalMonths = (payload.projectionLength || 1) * 12;
    const monthlyCFs = generateCompoundingCashflows(payload.revenues, payload.opex, totalMonths);

    // Aggregate into yearly cashflows
    const yearlyCFs: MonthlyCashflow[] = [];
    for (let year = 0; year < (payload.projectionLength || 1); year++) {
      let yearlySum = 0;
      for (let m = 0; m < 12; m++) {
        yearlySum += monthlyCFs[year * 12 + m].netCashflow;
      }
      yearlyCFs.push({
        month: year + 1, // Representing Year 1, Year 2, etc.
        netCashflow: yearlySum,
      });
    }

    return yearlyCFs;
  }, [payload.revenues, payload.opex, payload.projectionLength]);

  const results = useMemo<CalculationResults>(() => {
    const macroInputs = {
      initialInvestment: payload.initialInvestment,
      discountRate: payload.discountRate,
      targetPbp: payload.targetPbp,
    };
    return runCalculations(macroInputs, cashflows, 'yearly');
  }, [payload.initialInvestment, payload.discountRate, payload.targetPbp, cashflows]);

  return {
    payload,
    inputs: {
      initialInvestment: payload.initialInvestment,
      discountRate: payload.discountRate,
      targetPbp: payload.targetPbp,
    },
    cashflows,
    results,
    setPayload,
    resetData,
    loadSampleData,
    periodType: 'yearly' as const,
  };
}
