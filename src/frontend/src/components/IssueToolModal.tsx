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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tool } from "../backend.d";

interface IssueToolModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    issuedTo: string;
    issuedDate: string;
    expectedReturnDate: string;
    notes: string;
    quantity: bigint;
  }) => Promise<void>;
  tool: Tool | null;
  isPending: boolean;
}

export default function IssueToolModal({
  open,
  onClose,
  onSubmit,
  tool,
  isPending,
}: IssueToolModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [issuedTo, setIssuedTo] = useState("");
  const [issuedDate, setIssuedDate] = useState(today);
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const availableQty = tool ? Number(tool.availableQuantity) : 0;

  useEffect(() => {
    if (open) {
      setIssuedTo("");
      setIssuedDate(today);
      setExpectedReturnDate("");
      setNotes("");
      setQuantity(1);
    }
  }, [open, today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      issuedTo,
      issuedDate,
      expectedReturnDate,
      notes,
      quantity: BigInt(quantity),
    });
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

  const isOverQty = quantity > availableQty;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md"
        style={{
          background: "oklch(0.24 0.012 240)",
          border: "1px solid oklch(0.32 0.01 240)",
          color: "oklch(0.94 0.005 240)",
        }}
        data-ocid="issue_tool.dialog"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "oklch(0.94 0.005 240)" }}>
            Issue Tool
          </DialogTitle>
          {tool && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm" style={{ color: "oklch(0.67 0.16 55)" }}>
                {tool.name}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  background: "oklch(0.64 0.16 155 / 0.15)",
                  color: "oklch(0.75 0.14 155)",
                  border: "1px solid oklch(0.64 0.16 155 / 0.3)",
                }}
              >
                Available: {availableQty} pcs
              </span>
            </div>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label style={labelStyle}>Issued To *</Label>
            <Input
              value={issuedTo}
              onChange={(e) => setIssuedTo(e.target.value)}
              placeholder="Person's name"
              required
              style={inputStyle}
              className="text-sm"
              data-ocid="issue_tool.issued_to.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label style={labelStyle}>Issue Date *</Label>
              <Input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                required
                style={inputStyle}
                className="text-sm"
                data-ocid="issue_tool.issue_date.input"
              />
            </div>
            <div className="space-y-1">
              <Label style={labelStyle}>Expected Return *</Label>
              <Input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
                style={inputStyle}
                className="text-sm"
                data-ocid="issue_tool.return_date.input"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label style={labelStyle}>Quantity *</Label>
            <Input
              type="number"
              min={1}
              max={availableQty}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
              }
              required
              style={{
                ...inputStyle,
                border: isOverQty
                  ? "1px solid oklch(0.577 0.245 27 / 0.7)"
                  : inputStyle.border,
              }}
              className="text-sm"
              data-ocid="issue_tool.quantity.input"
            />
            {isOverQty && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.70 0.18 27)" }}
              >
                Cannot exceed {availableQty} available pcs
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label style={labelStyle}>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
                fontSize: "13px",
                resize: "none",
              }}
              data-ocid="issue_tool.notes.textarea"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              style={{ color: "oklch(0.72 0.01 240)" }}
              data-ocid="issue_tool.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                !issuedTo.trim() ||
                !expectedReturnDate ||
                isOverQty ||
                quantity < 1
              }
              style={{ background: "oklch(0.67 0.16 55)", color: "#fff" }}
              data-ocid="issue_tool.submit.button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Issue Tool
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
