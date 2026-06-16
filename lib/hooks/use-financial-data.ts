'use client';

import { useMemo } from 'react';
import type { CalculationResults, MonthlyCashflow } from '@/lib/types';
import { runCalculations, generateCompoundingCashflows } from '@/lib/calculations';
import { useProjectStore } from '../store/use-project-store';

export function useFinancialData() {
  const { payload, setPayload, resetData, loadSampleData } = useProjectStore();

  const cashflows = useMemo<MonthlyCashflow[]>(() => {
    if (payload.mode === 'general') {
      return payload.generalCashflows.map((c) => ({
        month: c.month,
        netCashflow: c.netCashflow,
      }));
    }

    // Detailed mode
    const totalMonths = (payload.projectionLength || 1) * 12;
    const monthlyCFs = generateCompoundingCashflows(payload.revenues, payload.opex, totalMonths);

    const yearlyCFs: MonthlyCashflow[] = [];
    for (let year = 0; year < (payload.projectionLength || 1); year++) {
      let yearlySum = 0;
      for (let m = 0; m < 12; m++) {
        yearlySum += monthlyCFs[year * 12 + m].netCashflow;
      }
      yearlyCFs.push({
        month: year + 1,
        netCashflow: yearlySum,
      });
    }

    return yearlyCFs;
  }, [payload.mode, payload.generalCashflows, payload.revenues, payload.opex, payload.projectionLength]);

  const results = useMemo<CalculationResults>(() => {
    const macroInputs = {
      initialInvestment: payload.initialInvestment,
      discountRate: payload.discountRate,
      targetPbp: payload.targetPbp,
    };
    return runCalculations(macroInputs, cashflows, payload.periodType);
  }, [payload.initialInvestment, payload.discountRate, payload.targetPbp, cashflows, payload.periodType]);

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
    periodType: payload.periodType,
  };
}
