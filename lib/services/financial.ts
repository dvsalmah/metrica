import type { MacroInputs, MonthlyCashflow } from '@/lib/types';

export const MONTH_COUNT = 36;

/**
 * Generates an empty cashflow array for all months.
 * Used as the default state when no data has been entered.
 */
export function generateEmptyCashflows(): MonthlyCashflow[] {
  return Array.from({ length: MONTH_COUNT }, (_, i) => ({
    month: i + 1,
    netCashflow: 0,
  }));
}

/**
 * Returns a realistic ramp-up cashflow pattern for demonstration purposes.
 * Pattern: slow start → growth phase → steady state.
 */
export function buildSampleCashflows(): MonthlyCashflow[] {
  const base = [
    500000,  800000,  1000000, 1200000, 1500000, 1800000,
    2000000, 2200000, 2400000, 2500000, 2600000, 2700000,
    2800000, 2900000, 3000000, 3100000, 3100000, 3200000,
    3200000, 3300000, 3300000, 3400000, 3400000, 3500000,
    3500000, 3500000, 3600000, 3600000, 3700000, 3700000,
    3800000, 3800000, 3900000, 3900000, 4000000, 4000000,
  ];
  return base.map((netCashflow, i) => ({ month: i + 1, netCashflow }));
}

/**
 * Default macro input values used on initial load and reset.
 */
export const DEFAULT_INPUTS: MacroInputs = {
  initialInvestment: 0,
  discountRate: 10,
  targetPbp: 18,
};

/**
 * Sample macro input values used when loading demo data.
 */
export const SAMPLE_INPUTS: MacroInputs = {
  initialInvestment: 25000000,
  discountRate: 12,
  targetPbp: 18,
};
