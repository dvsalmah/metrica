import Topbar from '@/components/layout/topbar';
import LeftPanel from '@/components/dashboard/left-panel/page';
import RightPanel from '@/components/dashboard/right-panel/page';

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col transition-colors duration-300">
      <Topbar />
      <main className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        <LeftPanel />
        <RightPanel />
      </main>
    </div>
  );
}
