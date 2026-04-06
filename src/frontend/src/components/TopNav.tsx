import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, KeyRound, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import ChangePasswordModal from "./ChangePasswordModal";

type Page = "dashboard" | "inventory" | "issues";

interface TopNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inventory", label: "Inventory" },
  { id: "issues", label: "Active Issues" },
];

export default function TopNav({ activePage, onNavigate }: TopNavProps) {
  const { logout } = useAdminAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const shortPrincipal = "Admin";

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "oklch(0.22 0.01 240 / 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid oklch(0.32 0.01 240)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-md"
              style={{ background: "oklch(0.67 0.16 55)" }}
            >
              <Settings
                className="w-4.5 h-4.5"
                style={{ color: "#fff" }}
                strokeWidth={2.5}
              />
            </div>
            <span
              className="text-base font-semibold tracking-tight"
              style={{ color: "oklch(0.94 0.005 240)" }}
            >
              GearFlow
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors relative ${
                  activePage === item.id ? "nav-active" : ""
                }`}
                style={{
                  color:
                    activePage === item.id
                      ? "oklch(0.67 0.16 55)"
                      : "oklch(0.72 0.01 240)",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-8 px-3 text-xs"
                style={{ color: "oklch(0.72 0.01 240)" }}
                data-ocid="nav.user.dropdown_menu"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(0.67 0.16 55)",
                    color: "#fff",
                  }}
                >
                  A
                </div>
                <span>{shortPrincipal}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                background: "oklch(0.26 0.015 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
            >
              <DropdownMenuItem
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-2 cursor-pointer"
                data-ocid="nav.change_password.button"
              >
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ background: "oklch(0.32 0.01 240)" }}
              />
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 cursor-pointer"
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </>
  );
}
