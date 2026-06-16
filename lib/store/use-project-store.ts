import { create } from 'zustand';
import { ProjectPayload } from '../types';

interface ProjectStore {
  payload: ProjectPayload;
  setPayload: (payload: ProjectPayload) => void;
  resetData: () => void;
  loadSampleData: () => void;
}

const defaultPayload: ProjectPayload = {
  initialInvestment: 50000,
  discountRate: 10,
  targetPbp: 18,
  projectionLength: 5,
  revenues: [
    { id: '1', name: 'Software Subscriptions', monthlyRevenue: 10000, growthRate: 5 },
  ],
  opex: [
    { id: '1', name: 'Server Costs', monthlyCost: 2000, escalationRate: 2 },
    { id: '2', name: 'Marketing', monthlyCost: 1500, escalationRate: 3 },
  ],
};

const emptyPayload: ProjectPayload = {
  initialInvestment: 0,
  discountRate: 10,
  targetPbp: 18,
  projectionLength: 5,
  revenues: [],
  opex: [],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  payload: defaultPayload,
  setPayload: (payload) => set({ payload }),
  resetData: () => set({ payload: emptyPayload }),
  loadSampleData: () => set({ payload: defaultPayload }),
}));
