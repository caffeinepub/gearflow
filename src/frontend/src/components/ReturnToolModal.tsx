import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Issue } from "../backend.d";

interface ReturnToolModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (returnDate: string, returnQuantity: bigint) => Promise<void>;
  issue: Issue | null;
  toolName?: string;
  isPending: boolean;
}

export default function ReturnToolModal({
  open,
  onClose,
  onSubmit,
  issue,
  toolName,
  isPending,
}: ReturnToolModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [returnDate, setReturnDate] = useState(today);
  const [returnQuantity, setReturnQuantity] = useState(1);

  const outstandingQty = issue
    ? Number(issue.quantity) - Number(issue.returnedQuantity)
    : 1;

  useEffect(() => {
    if (open) {
      setReturnDate(today);
      setReturnQuantity(1);
    }
  }, [open, today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(returnDate, BigInt(returnQuantity));
  };

  const inputStyle = {
    background: "oklch(0.22 0.01 240)",
    border: "1px solid oklch(0.32 0.01 240)",
    color: "oklch(0.94 0.005 240)",
    height: "36px",
  };
  const labelStyle = {
    color: "oklch(0.72 0.01 240)",
    fontSize: "12px",
    fontWeight: "500" as const,
  };

  const isOverQty = returnQuantity > outstandingQty;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: "oklch(0.24 0.012 240)",
          border: "1px solid oklch(0.32 0.01 240)",
          color: "oklch(0.94 0.005 240)",
        }}
        data-ocid="return_tool.dialog"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "oklch(0.94 0.005 240)" }}>
            Return Tool
          </DialogTitle>
          {toolName && (
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.67 0.16 55)" }}
            >
              {toolName}
            </p>
          )}
          {issue && (
            <div className="mt-1 space-y-0.5">
              <p className="text-xs" style={{ color: "oklch(0.72 0.01 240)" }}>
                Issued to: {issue.issuedTo} on {issue.issuedDate}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.72 0.01 240)" }}>
                Outstanding:{" "}
                <span style={{ color: "oklch(0.75 0.14 55)" }}>
                  {outstandingQty} pcs
                </span>
              </p>
            </div>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label style={labelStyle}>Return Quantity *</Label>
            <Input
              type="number"
              min={1}
              max={outstandingQty}
              value={returnQuantity}
              onChange={(e) =>
                setReturnQuantity(
                  Math.max(1, Number.parseInt(e.target.value) || 1),
                )
              }
              required
              style={{
                ...inputStyle,
                border: isOverQty
                  ? "1px solid oklch(0.577 0.245 27 / 0.7)"
                  : inputStyle.border,
              }}
              className="text-sm"
              data-ocid="return_tool.quantity.input"
            />
            {isOverQty && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.70 0.18 27)" }}
              >
                Cannot exceed {outstandingQty} outstanding pcs
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label style={labelStyle}>Return Date</Label>
            <Input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              style={inputStyle}
              className="text-sm"
              data-ocid="return_tool.date.input"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              style={{ color: "oklch(0.72 0.01 240)" }}
              data-ocid="return_tool.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending || !returnDate || isOverQty || returnQuantity < 1
              }
              style={{ background: "oklch(0.64 0.16 155)", color: "#fff" }}
              data-ocid="return_tool.submit.button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Return
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
