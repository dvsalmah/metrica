import type { MacroInputs, MonthlyCashflow, CalculationResults, RevenueItem, OpexItem } from '@/lib/types';

export function generateCompoundingCashflows(revenues: RevenueItem[], opex: OpexItem[], months: number = 24): MonthlyCashflow[] {
  const cashflows: MonthlyCashflow[] = [];

  for (let t = 1; t <= months; t++) {
    const yearIndex = Math.floor((t - 1) / 12);

    let totalRevenue = 0;
    for (const rev of revenues) {
      const compoundedRevenue = rev.monthlyRevenue * Math.pow(1 + rev.growthRate / 100, yearIndex);
      totalRevenue += compoundedRevenue;
    }

    let totalOpex = 0;
    for (const op of opex) {
      const compoundedOpex = op.monthlyCost * Math.pow(1 + op.escalationRate / 100, yearIndex);
      totalOpex += compoundedOpex;
    }

    cashflows.push({
      month: t,
      netCashflow: totalRevenue - totalOpex,
    });
  }

  return cashflows;
}

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
export function calculateROI(
  initialInvestment: number,
  cashflows: MonthlyCashflow[]
): number {
  if (initialInvestment === 0) return 0;
  const totalCashflow = cashflows.reduce((sum, { netCashflow }) => sum + netCashflow, 0);
  return (totalCashflow / Math.abs(initialInvestment)) * 100;
}

// Net Present Value (NPV)
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
export function executeNewtonRaphsonIRR(
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

export function calculateSafeIRR(
  initialInvestment: number,
  cashflows: MonthlyCashflow[],
  periodType: 'monthly' | 'yearly' = 'monthly'
): number {
  const series: number[] = [
    -Math.abs(initialInvestment),
    ...cashflows.map((c) => c.netCashflow),
  ];

  const hasNegative = series.some(val => val < 0);
  const hasPositive = series.some(val => val > 0);
  
  if (!hasNegative || !hasPositive) {
    return 0; // Batasan aman jika data belum valid/kosong
  }
  
  try {
    const irrValue = executeNewtonRaphsonIRR(initialInvestment, cashflows, periodType);
    if (isNaN(irrValue) || !isFinite(irrValue) || irrValue > 10000) {
      return NaN;
    }
    return irrValue;
  } catch (error) {
    return NaN;
  }
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
  const irr = calculateSafeIRR(inputs.initialInvestment, cashflows, periodType);

  return { pbp, pbpIsIdeal, roi, npv, irr };
}
