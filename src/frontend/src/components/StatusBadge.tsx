import type { ToolCondition, ToolStatus } from "../backend.d";

export function StatusBadge({ status }: { status: ToolStatus }) {
  const isAvailable = (status as unknown as string) === "Available";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isAvailable ? "badge-available" : "badge-issued"
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{
          background: isAvailable
            ? "oklch(0.64 0.16 155)"
            : "oklch(0.67 0.16 55)",
        }}
      />
      {isAvailable ? "Available" : "Issued"}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: ToolCondition }) {
  const labels: Record<
    string,
    { label: string; bg: string; color: string; dot: string }
  > = {
    Good: {
      label: "Good",
      bg: "oklch(0.64 0.16 155 / 0.15)",
      color: "oklch(0.75 0.14 155)",
      dot: "oklch(0.64 0.16 155)",
    },
    Fair: {
      label: "Fair",
      bg: "oklch(0.80 0.14 80 / 0.15)",
      color: "oklch(0.78 0.12 80)",
      dot: "oklch(0.80 0.14 80)",
    },
    Poor: {
      label: "Poor",
      bg: "oklch(0.577 0.245 27 / 0.15)",
      color: "oklch(0.70 0.18 27)",
      dot: "oklch(0.577 0.245 27)",
    },
  };
  const conditionKey = condition as unknown as string;
  const style = labels[conditionKey] ?? labels.Good;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.dot}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ background: style.dot }}
      />
      {style.label}
    </span>
  );
}
