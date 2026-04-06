import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { useActor } from "../hooks/useActor";

interface AdminAuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("gearflow_admin_session") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (!actor) return false;
      setIsLoading(true);
      try {
        const success = await actor.verifyAdminLogin(username, password);
        if (success) {
          sessionStorage.setItem("gearflow_admin_session", "true");
          setIsLoggedIn(true);
        }
        return success;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("gearflow_admin_session");
    setIsLoggedIn(false);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      if (!actor) return false;
      try {
        return await actor.changeAdminPassword(currentPassword, newPassword);
      } catch {
        return false;
      }
    },
    [actor],
  );

  return (
    <AdminAuthContext.Provider
      value={{ isLoggedIn, isLoading, login, logout, changePassword }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error(
      "useAdminAuthContext must be used within AdminAuthProvider",
    );
  return ctx;
}
