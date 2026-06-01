'use client';

import Topbar from '@/src/components/layout/topbar';
import LeftPanel from '@/src/components/dashboard/left-panel';
import RightPanel from '@/src/components/dashboard/right-panel';
import { useFinancialData } from '@/src/hooks/use-financial-data';

export default function DashboardPage() {
  const hook = useFinancialData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Topbar */}
      <Topbar onLoadSampleData={hook.loadSampleData} />

      {/* Main content */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Panel — inputs */}
        <LeftPanel hook={hook} />

        {/* Right Panel — visualizations */}
        <RightPanel
          results={hook.results}
          cashflows={hook.cashflows}
          inputs={hook.inputs}
        />
      </main>
    </div>
  );
}
