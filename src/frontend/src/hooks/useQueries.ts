import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DashboardStats,
  Issue,
  Tool,
  ToolCondition,
  backendInterface,
} from "../backend.d";
import { useActor } from "./useActor";

// Cast actor to full backend interface since backend.ts is a generated stub
function useBackend() {
  const { actor, isFetching } = useActor();
  return {
    backend: actor as unknown as backendInterface | null,
    isFetching,
    actor,
  };
}

export function useDashboardStats() {
  const { backend, isFetching, actor } = useBackend();
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!backend)
        return {
          totalTools: BigInt(0),
          availableTools: BigInt(0),
          issuedTools: BigInt(0),
        };
      return backend.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTools() {
  const { backend, isFetching, actor } = useBackend();
  return useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.getAllTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveIssues() {
  const { backend, isFetching, actor } = useBackend();
  return useQuery<Issue[]>({
    queryKey: ["activeIssues"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.getActiveIssues();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToolIssueHistory(toolId: bigint | null) {
  const { backend, isFetching, actor } = useBackend();
  return useQuery<Issue[]>({
    queryKey: ["issueHistory", toolId?.toString()],
    queryFn: async () => {
      if (!backend || toolId === null) return [];
      return backend.getToolIssueHistory(toolId);
    },
    enabled: !!actor && !isFetching && toolId !== null,
  });
}

export function useAddTool() {
  const { backend } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      category: string;
      condition: ToolCondition;
      description: string;
      location: string;
      purchaseDate: string;
      warrantyExpiry: string;
      totalQuantity: bigint;
    }) => {
      if (!backend) throw new Error("Not connected");
      return backend.addTool(
        params.name,
        params.category,
        params.condition,
        params.description,
        params.location,
        params.purchaseDate,
        params.warrantyExpiry,
        params.totalQuantity,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateTool() {
  const { backend } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      category: string;
      condition: ToolCondition;
      description: string;
      location: string;
      purchaseDate: string;
      warrantyExpiry: string;
      totalQuantity: bigint;
    }) => {
      if (!backend) throw new Error("Not connected");
      return backend.updateTool(
        params.id,
        params.name,
        params.category,
        params.condition,
        params.description,
        params.location,
        params.purchaseDate,
        params.warrantyExpiry,
        params.totalQuantity,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteTool() {
  const { backend } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!backend) throw new Error("Not connected");
      return backend.deleteTool(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useIssueTool() {
  const { backend } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      toolId: bigint;
      issuedTo: string;
      issuedDate: string;
      expectedReturnDate: string;
      notes: string;
      quantity: bigint;
    }) => {
      if (!backend) throw new Error("Not connected");
      return backend.issueTool(
        params.toolId,
        params.issuedTo,
        params.issuedDate,
        params.expectedReturnDate,
        params.notes,
        params.quantity,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["activeIssues"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["issueHistory"] });
    },
  });
}

export function useReturnTool() {
  const { backend } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      issueId: bigint;
      returnDate: string;
      returnQuantity: bigint;
    }) => {
      if (!backend) throw new Error("Not connected");
      return backend.returnTool(
        params.issueId,
        params.returnDate,
        params.returnQuantity,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["activeIssues"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["issueHistory"] });
    },
  });
}
