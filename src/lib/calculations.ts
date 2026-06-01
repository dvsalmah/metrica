import type { MacroInputs, MonthlyCashflow, CalculationResults } from '@/src/types';

// ---------------------------------------------------------------------------
// Payback Period (PBP)
// ---------------------------------------------------------------------------
// Returns the interpolated month at which cumulative cashflow first becomes
// zero or positive.  Returns null if it never recovers within the data window.
// Flags pbpIsIdeal when PBP <= 18 months.
export function calculatePBP(
  initialInvestment: number,
  cashflows: MonthlyCashflow[],
  targetPbp: number
): { pbp: number | null; pbpIsIdeal: boolean } {
  let cumulative = -Math.abs(initialInvestment);

  for (const { month, netCashflow } of cashflows) {
    const previous = cumulative;
    cumulative += netCashflow;

    if (cumulative >= 0) {
      // Linear interpolation for a more precise crossover month
      const fraction = previous < 0 ? Math.abs(previous) / netCashflow : 0;
      const pbp = month - 1 + fraction;
      return { pbp, pbpIsIdeal: pbp <= targetPbp };
    }
  }

  return { pbp: null, pbpIsIdeal: false };
}

// ---------------------------------------------------------------------------
// Return on Investment (ROI)
// ---------------------------------------------------------------------------
// ROI = (Total Net Cashflow / Initial Investment) × 100
export function calculateROI(
  initialInvestment: number,
  cashflows: MonthlyCashflow[]
): number {
  if (initialInvestment === 0) return 0;
  const totalCashflow = cashflows.reduce((sum, { netCashflow }) => sum + netCashflow, 0);
  return (totalCashflow / Math.abs(initialInvestment)) * 100;
}

// ---------------------------------------------------------------------------
// Net Present Value (NPV)
// ---------------------------------------------------------------------------
// NPV = Σ [Cashflow_t / (1 + r)^t] − Initial Investment
// discountRate is supplied as a percentage (e.g. 10 for 10%).
// We convert the annual rate to a monthly rate: r_monthly = (1 + r_annual)^(1/12) - 1
export function calculateNPV(
  inputs: MacroInputs,
  cashflows: MonthlyCashflow[]
): number {
  const annualRate = inputs.discountRate / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

  const pvOfCashflows = cashflows.reduce((sum, { month, netCashflow }) => {
    return sum + netCashflow / Math.pow(1 + monthlyRate, month);
  }, 0);

  return pvOfCashflows - Math.abs(inputs.initialInvestment);
}

// ---------------------------------------------------------------------------
// Internal Rate of Return (IRR)
// ---------------------------------------------------------------------------
// Solved numerically via bisection.  Returns the monthly IRR annualised as a
// percentage: IRR_annual = ((1 + IRR_monthly)^12 − 1) × 100.
// Returns NaN when the cashflow profile makes it unsolvable.
export function calculateIRR(
  initialInvestment: number,
  cashflows: MonthlyCashflow[]
): number {
  // Build the full cashflow series: CF_0 is the negative initial investment.
  const series: number[] = [
    -Math.abs(initialInvestment),
    ...cashflows.map((c) => c.netCashflow),
  ];

  // NPV at a given monthly rate
  const npvAtRate = (r: number): number =>
    series.reduce((sum, cf, t) => sum + cf / Math.pow(1 + r, t), 0);

  // Bisection within a reasonable monthly rate range [−99.9%, +999%]
  let low = -0.999;
  let high = 9.99;
  const ITERATIONS = 200;
  const TOLERANCE = 1e-8;

  // Ensure opposite signs at the boundaries (otherwise IRR is undefined)
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

  const annualIRR = (Math.pow(1 + mid, 12) - 1) * 100;
  return annualIRR;
}

// ---------------------------------------------------------------------------
// Master calculation runner
// ---------------------------------------------------------------------------
export function runCalculations(
  inputs: MacroInputs,
  cashflows: MonthlyCashflow[]
): CalculationResults {
  const { pbp, pbpIsIdeal } = calculatePBP(inputs.initialInvestment, cashflows, inputs.targetPbp);
  const roi = calculateROI(inputs.initialInvestment, cashflows);
  const npv = calculateNPV(inputs, cashflows);
  const irr = calculateIRR(inputs.initialInvestment, cashflows);

  return { pbp, pbpIsIdeal, roi, npv, irr };
}
