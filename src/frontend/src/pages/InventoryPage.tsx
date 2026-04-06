import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Issue, Tool } from "../backend.d";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import IssueToolModal from "../components/IssueToolModal";
import ReturnToolModal from "../components/ReturnToolModal";
import { ConditionBadge, StatusBadge } from "../components/StatusBadge";
import ToolFormModal from "../components/ToolFormModal";
import {
  useActiveIssues,
  useAddTool,
  useAllTools,
  useDeleteTool,
  useIssueTool,
  useReturnTool,
  useUpdateTool,
} from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Power Tools",
  "Hand Tools",
  "Measuring",
  "Electrical",
  "Plumbing",
  "Safety",
];
const STATUS_OPTIONS = ["All", "Available", "Issued"];

export default function InventoryPage() {
  const { data: tools, isLoading } = useAllTools();
  const { data: activeIssues } = useActiveIssues();
  const addTool = useAddTool();
  const updateTool = useUpdateTool();
  const deleteTool = useDeleteTool();
  const issueTool = useIssueTool();
  const returnTool = useReturnTool();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [deleteTool_, setDeleteTool] = useState<Tool | null>(null);
  const [issueTool_, setIssueTool] = useState<Tool | null>(null);
  const [returnIssue, setReturnIssue] = useState<{
    issue: Issue;
    toolName: string;
  } | null>(null);

  const filtered = useMemo(() => {
    if (!tools) return [];
    return tools.filter((t) => {
      const matchSearch =
        !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Available" &&
          (t.status as unknown as string) === "Available") ||
        (statusFilter === "Issued" &&
          (t.status as unknown as string) === "Issued");
      return matchSearch && matchCategory && matchStatus;
    });
  }, [tools, search, categoryFilter, statusFilter]);

  const getActiveIssueForTool = (toolId: bigint): Issue | undefined => {
    return activeIssues?.find((i) => i.toolId === toolId && !i.isReturned);
  };

  return (
    <div data-ocid="inventory.page">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "oklch(0.94 0.005 240)" }}
        >
          Inventory
        </h1>
        <p className="text-xs mt-1" style={{ color: "oklch(0.60 0.01 240)" }}>
          Manage your hardware tools
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel rounded-lg overflow-hidden"
      >
        {/* Controls */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-wrap"
          style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}
        >
          <div className="relative flex-1 min-w-[180px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "oklch(0.50 0.01 240)" }}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="pl-9 h-9 text-sm"
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
              data-ocid="inventory.search.input"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="h-9 w-[130px] text-sm"
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
              data-ocid="inventory.status.select"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "oklch(0.24 0.012 240)",
                border: "1px solid oklch(0.32 0.01 240)",
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  style={{ color: "oklch(0.94 0.005 240)" }}
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              className="h-9 w-[150px] text-sm"
              style={{
                background: "oklch(0.22 0.01 240)",
                border: "1px solid oklch(0.32 0.01 240)",
                color: "oklch(0.94 0.005 240)",
              }}
              data-ocid="inventory.category.select"
            >
              <SelectValue placeholder="Category" />
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

          <Button
            onClick={() => setAddModalOpen(true)}
            className="h-9 text-sm ml-auto"
            style={{
              background: "oklch(0.67 0.16 55)",
              color: "#fff",
              border: "none",
            }}
            data-ocid="inventory.add.button"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Tool
          </Button>
        </div>

        {/* Table */}
        <div style={{ maxHeight: "540px", overflowY: "auto" }}>
          <table className="w-full" data-ocid="inventory.tools.table">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}>
                {[
                  "Status",
                  "Tool Name",
                  "Category",
                  "Location",
                  "Qty",
                  "Condition",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.60 0.01 240)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((rk) => (
                  <tr key={rk}>
                    {["c1", "c2", "c3", "c4", "c5", "c6", "c7"].map((ck) => (
                      <td key={ck} className="px-4 py-3">
                        <Skeleton
                          className="h-4 w-full"
                          style={{ background: "oklch(0.32 0.01 240)" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm"
                    style={{ color: "oklch(0.50 0.01 240)" }}
                    data-ocid="inventory.tools.empty_state"
                  >
                    {tools?.length === 0
                      ? 'No tools yet. Click "Add Tool" to get started.'
                      : "No tools match your filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((tool, idx) => {
                  const activeIssue = getActiveIssueForTool(tool.id);
                  const availQty = Number(tool.availableQuantity);
                  const isLowStock = availQty <= 1;
                  return (
                    <tr
                      key={tool.id.toString()}
                      className="tool-row"
                      style={{ borderBottom: "1px solid oklch(0.28 0.01 240)" }}
                      data-ocid={`inventory.tools.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <StatusBadge status={tool.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "oklch(0.94 0.005 240)" }}
                        >
                          {tool.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs"
                          style={{ color: "oklch(0.72 0.01 240)" }}
                        >
                          {tool.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs"
                          style={{ color: "oklch(0.72 0.01 240)" }}
                        >
                          {tool.location || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded"
                          style={
                            isLowStock
                              ? {
                                  color: "oklch(0.65 0.22 25)",
                                  background: "oklch(0.577 0.245 27 / 0.15)",
                                  border:
                                    "1px solid oklch(0.577 0.245 27 / 0.35)",
                                }
                              : { color: "oklch(0.72 0.01 240)" }
                          }
                        >
                          {availQty}/{Number(tool.totalQuantity)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ConditionBadge condition={tool.condition} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {(tool.status as unknown as string) ===
                          "Available" ? (
                            <button
                              type="button"
                              onClick={() => setIssueTool(tool)}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                              style={{
                                color: "oklch(0.67 0.16 55)",
                                background: "oklch(0.67 0.16 55 / 0.1)",
                              }}
                              data-ocid={`inventory.issue.button.${idx + 1}`}
                            >
                              <ArrowUpRight className="w-3 h-3" />
                              Issue
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (activeIssue) {
                                  setReturnIssue({
                                    issue: activeIssue,
                                    toolName: tool.name,
                                  });
                                }
                              }}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                              style={{
                                color: "oklch(0.64 0.16 155)",
                                background: "oklch(0.64 0.16 155 / 0.1)",
                              }}
                              data-ocid={`inventory.return.button.${idx + 1}`}
                            >
                              <ArrowDownLeft className="w-3 h-3" />
                              Return
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditTool(tool)}
                            className="p-1.5 rounded transition-colors"
                            style={{ color: "oklch(0.72 0.01 240)" }}
                            data-ocid={`inventory.edit.button.${idx + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTool(tool)}
                            className="p-1.5 rounded transition-colors"
                            style={{ color: "oklch(0.577 0.245 27)" }}
                            data-ocid={`inventory.delete.button.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && (
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid oklch(0.32 0.01 240)" }}
          >
            <span className="text-xs" style={{ color: "oklch(0.50 0.01 240)" }}>
              Showing {filtered.length} of {tools?.length ?? 0} tools
            </span>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <ToolFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        isPending={addTool.isPending}
        onSubmit={async (data) => {
          try {
            await addTool.mutateAsync(data);
            toast.success("Tool added successfully");
            setAddModalOpen(false);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed to add tool",
            );
          }
        }}
      />

      <ToolFormModal
        open={!!editTool}
        onClose={() => setEditTool(null)}
        initialData={editTool ?? undefined}
        isPending={updateTool.isPending}
        onSubmit={async (data) => {
          if (!editTool) return;
          try {
            await updateTool.mutateAsync({ id: editTool.id, ...data });
            toast.success("Tool updated successfully");
            setEditTool(null);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed to update tool",
            );
          }
        }}
      />

      <DeleteConfirmModal
        open={!!deleteTool_}
        onClose={() => setDeleteTool(null)}
        toolName={deleteTool_?.name ?? ""}
        isPending={deleteTool.isPending}
        onConfirm={async () => {
          if (!deleteTool_) return;
          try {
            await deleteTool.mutateAsync(deleteTool_.id);
            toast.success("Tool deleted");
            setDeleteTool(null);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed to delete tool",
            );
          }
        }}
      />

      <IssueToolModal
        open={!!issueTool_}
        onClose={() => setIssueTool(null)}
        tool={issueTool_}
        isPending={issueTool.isPending}
        onSubmit={async (data) => {
          if (!issueTool_) return;
          try {
            await issueTool.mutateAsync({ toolId: issueTool_.id, ...data });
            toast.success(`${issueTool_.name} issued to ${data.issuedTo}`);
            setIssueTool(null);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed to issue tool",
            );
          }
        }}
      />

      <ReturnToolModal
        open={!!returnIssue}
        onClose={() => setReturnIssue(null)}
        issue={returnIssue?.issue ?? null}
        toolName={returnIssue?.toolName}
        isPending={returnTool.isPending}
        onSubmit={async (returnDate, returnQuantity) => {
          if (!returnIssue) return;
          try {
            await returnTool.mutateAsync({
              issueId: returnIssue.issue.id,
              returnDate,
              returnQuantity,
            });
            toast.success(`${returnIssue.toolName} returned successfully`);
            setReturnIssue(null);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Failed to return tool",
            );
          }
        }}
      />
    </div>
  );
}
