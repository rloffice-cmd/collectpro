import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  onSignOut: () => void;
}

export function AppLayout({ onSignOut }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar onSignOut={onSignOut} />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
