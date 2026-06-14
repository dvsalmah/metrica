import type { MacroInputs, MonthlyCashflow, CalculationResults } from '@/lib/types';

// Payback Period (PBP)
export function calculatePBP(
  initialInvestment: number,
  cashflows: MonthlyCashflow[],
  targetPbp: number,
  periodType: 'monthly' | 'yearly' = 'monthly'
): { pbp: number | null; pbpIsIdeal: boolean } {
  let cumulative = -Math.abs(initialInvestment);

  for (const { month, netCashflow } of cashflows) {
    const previous = cumulative;
    cumulative += netCashflow;

    if (cumulative >= 0) {
      const fraction = previous < 0 ? Math.abs(previous) / netCashflow : 0;
      const pbpPeriods = month - 1 + fraction;
      const pbpMonths = periodType === 'yearly' ? pbpPeriods * 12 : pbpPeriods;
      return { pbp: pbpMonths, pbpIsIdeal: pbpMonths <= targetPbp };
    }
  }

  return { pbp: null, pbpIsIdeal: false };
}

// Return on Investment (ROI)
// ROI = (Total Net Cashflow / Initial Investment) × 100
export function calculateROI(
  initialInvestment: number,
  cashflows: MonthlyCashflow[]
): number {
  if (initialInvestment === 0) return 0;
  const totalCashflow = cashflows.reduce((sum, { netCashflow }) => sum + netCashflow, 0);
  return (totalCashflow / Math.abs(initialInvestment)) * 100;
}

// Net Present Value (NPV)
// NPV = Σ [Cashflow_t / (1 + r)^t] − Initial Investment
// Monthly rate: r_monthly = (1 + r_annual)^(1/12) - 1
export function calculateNPV(
  inputs: MacroInputs,
  cashflows: MonthlyCashflow[],
  periodType: 'monthly' | 'yearly' = 'monthly'
): number {
  const annualRate = inputs.discountRate / 100;
  const ratePerPeriod = periodType === 'monthly' 
    ? Math.pow(1 + annualRate, 1 / 12) - 1
    : annualRate;

  const pvOfCashflows = cashflows.reduce((sum, { month, netCashflow }) => {
    return sum + netCashflow / Math.pow(1 + ratePerPeriod, month);
  }, 0);

  return pvOfCashflows - Math.abs(inputs.initialInvestment);
}

// Internal Rate of Return (IRR)
export function calculateIRR(
  initialInvestment: number,
  cashflows: MonthlyCashflow[],
  periodType: 'monthly' | 'yearly' = 'monthly'
): number {
  const series: number[] = [
    -Math.abs(initialInvestment),
    ...cashflows.map((c) => c.netCashflow),
  ];

  const npvAtRate = (r: number): number =>
    series.reduce((sum, cf, t) => sum + cf / Math.pow(1 + r, t), 0);

  let low = -0.999;
  let high = 9.99;
  const ITERATIONS = 200;
  const TOLERANCE = 1e-8;

  if (npvAtRate(low) * npvAtRate(high) > 0) return NaN;

  let mid = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    mid = (low + high) / 2;
    const npvMid = npvAtRate(mid);
    if (Math.abs(npvMid) < TOLERANCE) break;
    if (npvAtRate(low) * npvMid < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return periodType === 'monthly'
    ? (Math.pow(1 + mid, 12) - 1) * 100
    : mid * 100;
}

// Master calculation runner
export function runCalculations(
  inputs: MacroInputs,
  cashflows: MonthlyCashflow[],
  periodType: 'monthly' | 'yearly' = 'monthly'
): CalculationResults {
  const { pbp, pbpIsIdeal } = calculatePBP(inputs.initialInvestment, cashflows, inputs.targetPbp, periodType);
  const roi = calculateROI(inputs.initialInvestment, cashflows);
  const npv = calculateNPV(inputs, cashflows, periodType);
  const irr = calculateIRR(inputs.initialInvestment, cashflows, periodType);

  return { pbp, pbpIsIdeal, roi, npv, irr };
}
