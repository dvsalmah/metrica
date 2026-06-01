export interface MacroInputs {
  initialInvestment: number;
  discountRate: number;
  targetPbp: number;
}

export interface MonthlyCashflow {
  month: number;
  netCashflow: number;
}

export interface CalculationResults {
  pbp: number | null;
  pbpIsIdeal: boolean;
  roi: number;
  npv: number;
  irr: number;
}
