import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowDownLeft, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Issue } from "../backend.d";
import ReturnToolModal from "../components/ReturnToolModal";
import {
  useActiveIssues,
  useAllTools,
  useReturnTool,
} from "../hooks/useQueries";

export default function ActiveIssuesPage() {
  const { data: issues, isLoading } = useActiveIssues();
  const { data: tools } = useAllTools();
  const returnTool = useReturnTool();
  const [returnIssue, setReturnIssue] = useState<{
    issue: Issue;
    toolName: string;
  } | null>(null);

  const getToolName = (toolId: bigint) => {
    return tools?.find((t) => t.id === toolId)?.name ?? `Tool #${toolId}`;
  };

  const isOverdue = (expectedReturnDate: string) => {
    if (!expectedReturnDate) return false;
    return new Date(expectedReturnDate) < new Date();
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div data-ocid="issues.page">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "oklch(0.94 0.005 240)" }}
        >
          Active Issues
        </h1>
        <p className="text-xs mt-1" style={{ color: "oklch(0.60 0.01 240)" }}>
          {today}
        </p>
      </div>

      {/* Stats bar */}
      {!isLoading && issues && (
        <div className="flex items-center gap-4 mb-5">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{
              background: "oklch(0.67 0.16 55 / 0.1)",
              border: "1px solid oklch(0.67 0.16 55 / 0.25)",
              color: "oklch(0.75 0.14 55)",
            }}
          >
            <Clock className="w-4 h-4" />
            <span className="font-medium">{issues.length}</span>
            <span style={{ color: "oklch(0.60 0.01 240)" }}>
              tools currently out
            </span>
          </div>
          {issues.filter((i) => isOverdue(i.expectedReturnDate)).length > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{
                background: "oklch(0.577 0.245 27 / 0.1)",
                border: "1px solid oklch(0.577 0.245 27 / 0.25)",
                color: "oklch(0.70 0.18 27)",
              }}
              data-ocid="issues.overdue.card"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {issues.filter((i) => isOverdue(i.expectedReturnDate)).length}
              </span>
              <span style={{ color: "oklch(0.60 0.01 240)" }}>overdue</span>
            </div>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel rounded-lg overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: "oklch(0.94 0.005 240)" }}
          >
            Currently Issued Tools
          </h2>
          <span className="text-xs" style={{ color: "oklch(0.60 0.01 240)" }}>
            {issues?.length ?? 0} active
          </span>
        </div>

        <ScrollArea className="max-h-[560px]">
          <table className="w-full" data-ocid="issues.table">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}>
                {[
                  "Tool",
                  "Issued To",
                  "Issue Date",
                  "Expected Return",
                  "Notes",
                  "Qty",
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
                ["sk1", "sk2", "sk3", "sk4"].map((rk) => (
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
              ) : issues?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center"
                    data-ocid="issues.table.empty_state"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Clock
                        className="w-8 h-8"
                        style={{ color: "oklch(0.40 0.01 240)" }}
                      />
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.50 0.01 240)" }}
                      >
                        No tools are currently issued
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                issues?.map((issue, idx) => {
                  const toolName = getToolName(issue.toolId);
                  const overdue = isOverdue(issue.expectedReturnDate);
                  const outstanding =
                    Number(issue.quantity) - Number(issue.returnedQuantity);
                  return (
                    <tr
                      key={issue.id.toString()}
                      className="tool-row"
                      style={{
                        borderBottom: "1px solid oklch(0.28 0.01 240)",
                        background: overdue
                          ? "oklch(0.577 0.245 27 / 0.05)"
                          : undefined,
                      }}
                      data-ocid={`issues.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "oklch(0.94 0.005 240)" }}
                        >
                          {toolName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm"
                          style={{ color: "oklch(0.85 0.005 240)" }}
                        >
                          {issue.issuedTo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs"
                          style={{ color: "oklch(0.72 0.01 240)" }}
                        >
                          {issue.issuedDate}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs"
                            style={{
                              color: overdue
                                ? "oklch(0.70 0.18 27)"
                                : "oklch(0.72 0.01 240)",
                            }}
                          >
                            {issue.expectedReturnDate || "—"}
                          </span>
                          {overdue && (
                            <AlertTriangle
                              className="w-3 h-3"
                              style={{ color: "oklch(0.70 0.18 27)" }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[150px]">
                        <span
                          className="text-xs truncate block"
                          style={{ color: "oklch(0.60 0.01 240)" }}
                        >
                          {issue.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <span
                            className="text-xs font-medium tabular-nums block"
                            style={{ color: "oklch(0.75 0.14 55)" }}
                          >
                            {Number(issue.quantity)} pcs
                          </span>
                          {outstanding < Number(issue.quantity) && (
                            <span
                              className="text-xs tabular-nums block"
                              style={{ color: "oklch(0.60 0.01 240)" }}
                            >
                              {outstanding} left
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          onClick={() => setReturnIssue({ issue, toolName })}
                          className="h-7 text-xs px-3"
                          style={{
                            background: "oklch(0.64 0.16 155)",
                            color: "#fff",
                            border: "none",
                          }}
                          data-ocid={`issues.return.button.${idx + 1}`}
                        >
                          <ArrowDownLeft className="w-3 h-3 mr-1" />
                          Return
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </ScrollArea>
      </motion.div>

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
