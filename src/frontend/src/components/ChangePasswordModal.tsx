import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const { changePassword } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsLoading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(currentPassword, newPassword);
      if (success) {
        toast.success("Password changed successfully!");
        handleClose(false);
      } else {
        setError("Current password is incorrect.");
      }
    } catch {
      setError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "oklch(0.26 0.015 240)",
          border: "1px solid oklch(0.32 0.01 240)",
          color: "oklch(0.94 0.005 240)",
        }}
        data-ocid="change_password.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: "oklch(0.67 0.16 55 / 0.15)" }}
            >
              <KeyRound
                className="w-4 h-4"
                style={{ color: "oklch(0.67 0.16 55)" }}
              />
            </div>
            <span style={{ color: "oklch(0.94 0.005 240)" }}>
              Change Password
            </span>
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.60 0.01 240)" }}>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="current-password"
              style={{ color: "oklch(0.72 0.01 240)", fontSize: "0.8rem" }}
            >
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              data-ocid="change_password.input"
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="new-password"
              style={{ color: "oklch(0.72 0.01 240)", fontSize: "0.8rem" }}
            >
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
              data-ocid="change_password.password_input"
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="confirm-password"
              style={{ color: "oklch(0.72 0.01 240)", fontSize: "0.8rem" }}
            >
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              data-ocid="change_password.textarea"
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
              data-ocid="change_password.error_state"
            >
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={isLoading}
              className="flex-1"
              style={{
                color: "oklch(0.72 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
              }}
              data-ocid="change_password.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
              style={{
                background: isLoading
                  ? "oklch(0.55 0.12 55)"
                  : "linear-gradient(135deg, oklch(0.67 0.16 55), oklch(0.60 0.18 45))",
                color: "#fff",
                border: "none",
                boxShadow: isLoading
                  ? "none"
                  : "0 4px 16px oklch(0.67 0.16 55 / 0.25)",
              }}
              data-ocid="change_password.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
