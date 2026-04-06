import type { ReactNode } from "react";
import Footer from "./Footer";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
  activePage: "dashboard" | "inventory" | "issues";
  onNavigate: (page: "dashboard" | "inventory" | "issues") => void;
}

export default function AppShell({
  children,
  activePage,
  onNavigate,
}: AppShellProps) {
  return (
    <div className="industrial-bg min-h-screen flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav activePage={activePage} onNavigate={onNavigate} />
        <main className="flex-1 relative">
          <div className="max-w-[1200px] mx-auto px-4 py-6">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
