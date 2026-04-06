import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  toolName: string;
  isPending: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  toolName,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        style={{
          background: "oklch(0.24 0.012 240)",
          border: "1px solid oklch(0.32 0.01 240)",
          color: "oklch(0.94 0.005 240)",
        }}
        data-ocid="delete_tool.dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "oklch(0.94 0.005 240)" }}>
            Delete Tool
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "oklch(0.72 0.01 240)" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "oklch(0.94 0.005 240)" }}>
              {toolName}
            </strong>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            style={{
              background: "oklch(0.30 0.012 240)",
              border: "1px solid oklch(0.32 0.01 240)",
              color: "oklch(0.94 0.005 240)",
            }}
            data-ocid="delete_tool.cancel.button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            style={{ background: "oklch(0.577 0.245 27)", color: "#fff" }}
            data-ocid="delete_tool.confirm.button"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
