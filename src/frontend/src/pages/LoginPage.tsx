import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function LoginPage() {
  const { login } = useAdminAuth();
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isFetching || !actor) {
      setError("Connecting to server, please wait and try again...");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isConnecting = isFetching || !actor;

  return (
    <div
      className="industrial-bg min-h-screen flex items-center justify-center px-4"
      data-ocid="login.page"
    >
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel rounded-xl p-8 shadow-glass"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.67 0.16 55), oklch(0.60 0.18 45))",
                boxShadow: "0 8px 32px oklch(0.67 0.16 55 / 0.35)",
              }}
            >
              <Settings
                className="w-8 h-8"
                style={{ color: "#fff" }}
                strokeWidth={2}
              />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "oklch(0.94 0.005 240)" }}
            >
              GearFlow
            </h1>
            <p
              className="text-sm mt-1 text-center"
              style={{ color: "oklch(0.72 0.01 240)" }}
            >
              Hardware Tool Management System
            </p>
          </div>

          {/* Connecting indicator */}
          {isConnecting && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-xs"
              style={{
                background: "oklch(0.67 0.16 55 / 0.08)",
                border: "1px solid oklch(0.67 0.16 55 / 0.25)",
                color: "oklch(0.75 0.14 55)",
              }}
              data-ocid="login.loading_state"
            >
              <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
              Connecting to server...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                style={{ color: "oklch(0.72 0.01 240)", fontSize: "0.8rem" }}
              >
                Username
              </Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                data-ocid="login.input"
                style={{
                  background: "oklch(0.22 0.01 240)",
                  border: "1px solid oklch(0.32 0.01 240)",
                  color: "oklch(0.94 0.005 240)",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                style={{ color: "oklch(0.72 0.01 240)", fontSize: "0.8rem" }}
              >
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                data-ocid="login.password_input"
                style={{
                  background: "oklch(0.22 0.01 240)",
                  border: "1px solid oklch(0.32 0.01 240)",
                  color: "oklch(0.94 0.005 240)",
                }}
              />
            </div>

            {error && (
              <div
                className="p-3 rounded-lg text-xs"
                style={{
                  background: "oklch(0.577 0.245 27 / 0.1)",
                  border: "1px solid oklch(0.577 0.245 27 / 0.3)",
                  color: "oklch(0.70 0.18 27)",
                }}
                data-ocid="login.error_state"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isConnecting}
              className="w-full h-10 font-medium text-sm mt-2"
              style={{
                background:
                  isLoading || isConnecting
                    ? "oklch(0.55 0.12 55)"
                    : "linear-gradient(135deg, oklch(0.67 0.16 55), oklch(0.60 0.18 45))",
                color: "#fff",
                border: "none",
                boxShadow:
                  isLoading || isConnecting
                    ? "none"
                    : "0 4px 16px oklch(0.67 0.16 55 / 0.3)",
              }}
              data-ocid="login.primary_button"
            >
              {isConnecting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <p
            className="text-xs text-center mt-4"
            style={{ color: "oklch(0.50 0.01 240)" }}
          >
            GearFlow Admin Panel
          </p>
        </motion.div>
      </div>
    </div>
  );
}
