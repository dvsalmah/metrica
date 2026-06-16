import { create } from 'zustand';
import { ProjectPayload } from '../types';

interface ProjectStore {
  payload: ProjectPayload;
  setPayload: (payload: ProjectPayload) => void;
  resetData: () => void;
  loadSampleData: () => void;
}

const DEFAULT_PAYLOAD: ProjectPayload = {
  mode: 'detailed',
  periodType: 'yearly',
  initialInvestment: 1000000000, // 1 Billion IDR
  discountRate: 10, // 10%
  targetPbp: 36, // 36 months
  projectionLength: 5, // 5 years
  generalCashflows: [],
  revenues: [
    {
      id: 'rev-1',
      name: 'Software Subscriptions',
      monthlyRevenue: 50000000,
      growthRate: 15, // 15% annual growth
    },
    {
      id: 'rev-2',
      name: 'Consulting Services',
      monthlyRevenue: 20000000,
      growthRate: 5, // 5% annual growth
    },
  ],
  opex: [
    {
      id: 'opx-1',
      name: 'Cloud Infrastructure',
      monthlyCost: 10000000,
      escalationRate: 5, // 5% annual escalation
    },
    {
      id: 'opx-2',
      name: 'Marketing & Sales',
      monthlyCost: 15000000,
      escalationRate: 8, // 8% annual escalation
    },
    {
      id: 'opx-3',
      name: 'Payroll & Benefits',
      monthlyCost: 30000000,
      escalationRate: 10, // 10% annual escalation
    },
  ],
};

const emptyPayload: ProjectPayload = {
  mode: 'general',
  periodType: 'yearly',
  initialInvestment: 0,
  discountRate: 10,
  targetPbp: 18,
  projectionLength: 5,
  generalCashflows: [],
  revenues: [],
  opex: [],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  payload: DEFAULT_PAYLOAD,
  setPayload: (payload) => set({ payload }),
  resetData: () => set({ payload: emptyPayload }),
  loadSampleData: () => set({ payload: DEFAULT_PAYLOAD }),
}));
