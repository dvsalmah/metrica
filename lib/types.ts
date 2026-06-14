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

export interface UseFinancialDataReturn {
  inputs: MacroInputs;
  periodType: 'monthly' | 'yearly';
  projectionLength: number;
  cashflows: MonthlyCashflow[];
  results: CalculationResults;
  setInitialInvestment: (value: number) => void;
  setDiscountRate: (value: number) => void;
  setTargetPbp: (value: number) => void;
  updateCashflow: (month: number, netCashflow: number) => void;
  loadSampleData: () => void;
  resetData: () => void;
  setPeriodType: (periodType: 'monthly' | 'yearly') => void;
  setProjectionLength: (projectionLength: number) => void;
}
