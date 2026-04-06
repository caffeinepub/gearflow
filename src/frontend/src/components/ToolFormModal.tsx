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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tool, ToolCondition } from "../backend.d";

const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Measuring",
  "Electrical",
  "Plumbing",
  "Safety",
];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

interface ToolFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    condition: ToolCondition;
    description: string;
    location: string;
    purchaseDate: string;
    warrantyExpiry: string;
    totalQuantity: bigint;
  }) => Promise<void>;
  initialData?: Tool;
  isPending: boolean;
}

export default function ToolFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ToolFormModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState<string>("Good");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
        setCondition(initialData.condition as unknown as string);
        setDescription(initialData.description);
        setLocation(initialData.location);
        setPurchaseDate(initialData.purchaseDate);
        setWarrantyExpiry(initialData.warrantyExpiry);
        setTotalQuantity(Number(initialData.totalQuantity) || 1);
      } else {
        setName("");
        setCategory(CATEGORIES[0]);
        setCondition("Good");
        setDescription("");
        setLocation("");
        setPurchaseDate(today);
        setWarrantyExpiry("");
        setTotalQuantity(1);
      }
    }
  }, [open, initialData, today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      category,
      condition: condition as unknown as ToolCondition,
      description,
      location,
      purchaseDate,
      warrantyExpiry,
      totalQuantity: BigInt(totalQuantity),
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
    fontWeight: "500",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg"
        style={{
          background: "oklch(0.24 0.012 240)",
          border: "1px solid oklch(0.32 0.01 240)",
          color: "oklch(0.94 0.005 240)",
        }}
        data-ocid="tool_form.dialog"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "oklch(0.94 0.005 240)" }}>
            {initialData ? "Edit Tool" : "Add New Tool"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label style={labelStyle}>Tool Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bosch Drill"
                required
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label style={labelStyle}>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  style={inputStyle}
                  className="text-sm"
                  data-ocid="tool_form.category.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.24 0.012 240)",
                    border: "1px solid oklch(0.32 0.01 240)",
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      style={{ color: "oklch(0.94 0.005 240)" }}
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label style={labelStyle}>Condition</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v)}>
                <SelectTrigger
                  style={inputStyle}
                  className="text-sm"
                  data-ocid="tool_form.condition.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "oklch(0.24 0.012 240)",
                    border: "1px solid oklch(0.32 0.01 240)",
                  }}
                >
                  {CONDITIONS.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      style={{ color: "oklch(0.94 0.005 240)" }}
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label style={labelStyle}>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Workshop Shelf A"
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.location.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label style={labelStyle}>Quantity *</Label>
              <Input
                type="number"
                min={1}
                value={totalQuantity}
                onChange={(e) =>
                  setTotalQuantity(
                    Math.max(1, Number.parseInt(e.target.value) || 1),
                  )
                }
                required
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.quantity.input"
              />
            </div>
            <div className="space-y-1">
              <Label style={labelStyle}>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes..."
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.description.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label style={labelStyle}>Purchase Date</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.purchase_date.input"
              />
            </div>
            <div className="space-y-1">
              <Label style={labelStyle}>Warranty Expiry</Label>
              <Input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                style={inputStyle}
                className="text-sm"
                data-ocid="tool_form.warranty.input"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              style={{ color: "oklch(0.72 0.01 240)" }}
              data-ocid="tool_form.cancel.button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              style={{
                background: "oklch(0.67 0.16 55)",
                color: "#fff",
              }}
              data-ocid="tool_form.submit.button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Add Tool"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
