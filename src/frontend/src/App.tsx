import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppShell from "./components/AppShell";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { useAdminAuth } from "./hooks/useAdminAuth";
import ActiveIssuesPage from "./pages/ActiveIssuesPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";

type Page = "dashboard" | "inventory" | "issues";

function AppInner() {
  const { isLoggedIn } = useAdminAuth();
  const [activePage, setActivePage] = useState<Page>("dashboard");

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === "dashboard" && <DashboardPage />}
      {activePage === "inventory" && <InventoryPage />}
      {activePage === "issues" && <ActiveIssuesPage />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppInner />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.26 0.015 240)",
            border: "1px solid oklch(0.32 0.01 240)",
            color: "oklch(0.94 0.005 240)",
          },
        }}
      />
    </AdminAuthProvider>
  );
}
