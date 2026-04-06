import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Tool } from "../backend.d";
import { ConditionBadge, StatusBadge } from "../components/StatusBadge";
import {
  useAllTools,
  useDashboardStats,
  useToolIssueHistory,
} from "../hooks/useQueries";

interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  loading: boolean;
  index: number;
}

function KpiCard({
  label,
  value,
  icon,
  accentColor,
  loading,
  index,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="kpi-card rounded-lg p-5 flex items-start gap-4"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
        }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "oklch(0.72 0.01 240)" }}
        >
          {label}
        </p>
        {loading ? (
          <Skeleton
            className="h-7 w-16 mt-1"
            style={{ background: "oklch(0.32 0.01 240)" }}
          />
        ) : (
          <p
            className="text-2xl font-bold mt-0.5"
            style={{ color: "oklch(0.94 0.005 240)" }}
          >
            {value}
          </p>
        )}
      </div>
    </motion.div>
  );
}

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5"];
const SKELETON_COLS = ["c1", "c2", "c3", "c4", "c5", "c6"];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: tools, isLoading: toolsLoading } = useAllTools();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { data: history, isLoading: historyLoading } = useToolIssueHistory(
    selectedTool?.id ?? null,
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const kpis = [
    {
      label: "Total Tools",
      value: stats ? Number(stats.totalTools) : 0,
      icon: <Package className="w-5 h-5" />,
      accentColor: "oklch(0.67 0.16 55)",
    },
    {
      label: "Available",
      value: stats ? Number(stats.availableTools) : 0,
      icon: <CheckCircle className="w-5 h-5" />,
      accentColor: "oklch(0.64 0.16 155)",
    },
    {
      label: "Issued Out",
      value: stats ? Number(stats.issuedTools) : 0,
      icon: <AlertCircle className="w-5 h-5" />,
      accentColor: "oklch(0.69 0.15 65)",
    },
  ];

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <div data-ocid="dashboard.page">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "oklch(0.94 0.005 240)" }}
        >
          Dashboard
        </h1>
        <p className="text-xs mt-1" style={{ color: "oklch(0.60 0.01 240)" }}>
          {today}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} loading={statsLoading} index={i} />
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Left: Tool Inventory */}
        <div className="glass-panel rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: "oklch(0.94 0.005 240)" }}
            >
              Tool Inventory
            </h2>
            <span className="text-xs" style={{ color: "oklch(0.60 0.01 240)" }}>
              {tools?.length ?? 0} tools
            </span>
          </div>
          <ScrollArea className="max-h-[480px]">
            <table className="w-full" data-ocid="dashboard.tools.table">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}>
                  {[
                    "Status",
                    "Tool Name",
                    "Category",
                    "Location",
                    "Qty",
                    "Condition",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.60 0.01 240)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {toolsLoading ? (
                  SKELETON_ROWS.map((rk) => (
                    <tr key={rk}>
                      {SKELETON_COLS.map((ck) => (
                        <td key={ck} className="px-4 py-3">
                          <Skeleton
                            className="h-4 w-full"
                            style={{ background: "oklch(0.32 0.01 240)" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : tools?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm"
                      style={{ color: "oklch(0.50 0.01 240)" }}
                      data-ocid="dashboard.tools.empty_state"
                    >
                      No tools added yet. Go to Inventory to add tools.
                    </td>
                  </tr>
                ) : (
                  tools?.map((tool, idx) => (
                    <tr
                      key={tool.id.toString()}
                      tabIndex={0}
                      className={`tool-row ${
                        selectedTool?.id === tool.id ? "selected" : ""
                      }`}
                      onClick={() => handleToolSelect(tool)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleToolSelect(tool);
                        }
                      }}
                      data-ocid={`dashboard.tools.item.${idx + 1}`}
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
                          className="text-xs font-medium tabular-nums"
                          style={{ color: "oklch(0.72 0.01 240)" }}
                        >
                          {Number(tool.availableQuantity)}/
                          {Number(tool.totalQuantity)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ConditionBadge condition={tool.condition} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>

        {/* Right: Tool Details + History */}
        <div className="flex flex-col gap-4">
          {/* Tool Details */}
          <div className="glass-panel rounded-lg overflow-hidden">
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.60 0.01 240)" }}
              >
                Quick View: Tool Details
              </h3>
            </div>
            <div className="p-4">
              {!selectedTool ? (
                <div
                  className="py-6 text-center"
                  data-ocid="dashboard.tool_detail.empty_state"
                >
                  <Package
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: "oklch(0.40 0.01 240)" }}
                  />
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.01 240)" }}
                  >
                    Click a row to view tool details
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-3"
                  data-ocid="dashboard.tool_detail.card"
                >
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.94 0.005 240)" }}
                    >
                      {selectedTool.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedTool.status} />
                      <ConditionBadge condition={selectedTool.condition} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Category", value: selectedTool.category },
                      {
                        label: "Location",
                        value: selectedTool.location || "—",
                      },
                      {
                        label: "Purchase Date",
                        value: selectedTool.purchaseDate || "—",
                      },
                      {
                        label: "Warranty",
                        value: selectedTool.warrantyExpiry || "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-start gap-2"
                      >
                        <span
                          className="text-xs"
                          style={{ color: "oklch(0.60 0.01 240)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-xs text-right"
                          style={{ color: "oklch(0.85 0.005 240)" }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                    {/* Stock row */}
                    <div className="flex justify-between items-start gap-2">
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.60 0.01 240)" }}
                      >
                        Stock
                      </span>
                      <span
                        className="text-xs text-right font-medium tabular-nums"
                        style={{ color: "oklch(0.75 0.14 155)" }}
                      >
                        {Number(selectedTool.availableQuantity)} /{" "}
                        {Number(selectedTool.totalQuantity)} available
                      </span>
                    </div>
                  </div>
                  {selectedTool.description && (
                    <p
                      className="text-xs pt-2"
                      style={{
                        color: "oklch(0.72 0.01 240)",
                        borderTop: "1px solid oklch(0.32 0.01 240)",
                      }}
                    >
                      {selectedTool.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Issue History */}
          <div className="glass-panel rounded-lg overflow-hidden flex-1">
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid oklch(0.32 0.01 240)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.60 0.01 240)" }}
              >
                Issue History
              </h3>
            </div>
            <div className="p-3">
              {!selectedTool ? (
                <div
                  className="py-4 text-center"
                  data-ocid="dashboard.issue_history.empty_state"
                >
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.01 240)" }}
                  >
                    Select a tool to view history
                  </p>
                </div>
              ) : historyLoading ? (
                <div
                  className="space-y-2"
                  data-ocid="dashboard.issue_history.loading_state"
                >
                  {["sh1", "sh2", "sh3"].map((k) => (
                    <Skeleton
                      key={k}
                      className="h-12 w-full rounded"
                      style={{ background: "oklch(0.32 0.01 240)" }}
                    />
                  ))}
                </div>
              ) : history?.length === 0 ? (
                <div
                  className="py-4 text-center"
                  data-ocid="dashboard.issue_history.empty_state"
                >
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.01 240)" }}
                  >
                    No issue history for this tool
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-[200px]">
                  <div className="space-y-2">
                    {history?.map((issue, idx) => (
                      <div
                        key={issue.id.toString()}
                        className="rounded-md p-3"
                        style={{
                          background: "oklch(0.22 0.01 240)",
                          border: "1px solid oklch(0.32 0.01 240)",
                        }}
                        data-ocid={`dashboard.issue_history.item.${idx + 1}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "oklch(0.94 0.005 240)" }}
                          >
                            {issue.issuedTo}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-xs tabular-nums"
                              style={{ color: "oklch(0.72 0.01 240)" }}
                            >
                              {Number(issue.quantity)} pcs
                            </span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{
                                background: issue.isReturned
                                  ? "oklch(0.64 0.16 155 / 0.15)"
                                  : "oklch(0.67 0.16 55 / 0.15)",
                                color: issue.isReturned
                                  ? "oklch(0.75 0.14 155)"
                                  : "oklch(0.75 0.14 55)",
                              }}
                            >
                              {issue.isReturned ? "Returned" : "Active"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock
                            className="w-3 h-3"
                            style={{ color: "oklch(0.50 0.01 240)" }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.60 0.01 240)" }}
                          >
                            {issue.issuedDate}
                            {issue.isReturned && issue.returnDate
                              ? ` → ${issue.returnDate}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
