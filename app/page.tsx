'use client';

import Topbar from '@/components/layout/topbar';
import LeftPanel from '@/components/dashboard/left-panel';
import RightPanel from '@/components/dashboard/right-panel';
import { useFinancialData } from '@/lib/hooks/use-financial-data';

export default function DashboardPage() {
  const hook = useFinancialData();

  return (
    <div className="h-screen flex flex-col transition-colors duration-300">
      <Topbar onLoadSampleData={hook.loadSampleData} />
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <LeftPanel />
        <RightPanel
          results={hook.results}
          cashflows={hook.cashflows}
          inputs={hook.inputs}
          periodType={hook.periodType}
        />
      </main>
    </div>
  );
}
