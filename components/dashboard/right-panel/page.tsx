'use client';

import { useState, useEffect } from 'react';
import { Separator } from '../../ui/separator';
import { useFinancialData } from '@/lib/hooks/use-financial-data';
import { MetricsSection } from './metrics-section';
import { CashflowChart } from './cashflow-chart';

export default function RightPanel() {
  const { results, cashflows, payload, periodType } = useFinancialData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      id="right-panel"
      className="flex flex-col gap-6 flex-none lg:flex-1 h-auto lg:h-full overflow-visible lg:overflow-y-auto p-8"
    >
      <MetricsSection results={results} targetPbp={payload.targetPbp} />
      <Separator />
      <CashflowChart
        cashflows={cashflows}
        periodType={periodType}
        initialInvestment={payload.initialInvestment}
        mounted={mounted}
      />
    </div>
  );
}
