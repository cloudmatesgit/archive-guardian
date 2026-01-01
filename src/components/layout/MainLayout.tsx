import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
