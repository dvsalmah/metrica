import { z } from 'zod';

export const revenueItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  monthlyRevenue: z.coerce.number().catch(0),
  growthRate: z.coerce.number().catch(0),
});

export const opexItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  monthlyCost: z.coerce.number().catch(0),
  escalationRate: z.coerce.number().catch(0),
});

export const projectPayloadSchema = z.object({
  initialInvestment: z.coerce.number().catch(0),
  discountRate: z.coerce.number().catch(0),
  targetPbp: z.coerce.number().catch(0),
  projectionLength: z.coerce.number().catch(0),
  revenues: z.array(revenueItemSchema),
  opex: z.array(opexItemSchema),
});

export type RevenueItem = z.infer<typeof revenueItemSchema>;
export type OpexItem = z.infer<typeof opexItemSchema>;
export type ProjectPayload = z.infer<typeof projectPayloadSchema>;

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
