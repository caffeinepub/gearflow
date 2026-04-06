// Augments the auto-generated backend.ts stub to expose the full API surface.
// This is necessary because the generated backend.ts has an empty backendInterface.
import type {
  DashboardStats,
  Issue,
  Option,
  Tool,
  ToolCondition,
} from "./backend.d";

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<
      { __kind__: "admin" } | { __kind__: "user" } | { __kind__: "guest" }
    >;
    isCallerAdmin(): Promise<boolean>;
    addTool(
      name: string,
      category: string,
      condition: ToolCondition,
      description: string,
      location: string,
      purchaseDate: string,
      warrantyExpiry: string,
    ): Promise<Tool>;
    updateTool(
      id: bigint,
      name: string,
      category: string,
      condition: ToolCondition,
      description: string,
      location: string,
      purchaseDate: string,
      warrantyExpiry: string,
    ): Promise<Option<Tool>>;
    deleteTool(id: bigint): Promise<boolean>;
    getTool(id: bigint): Promise<Option<Tool>>;
    getAllTools(): Promise<Tool[]>;
    getToolsByCategory(category: string): Promise<Tool[]>;
    getToolsByStatus(available: boolean): Promise<Tool[]>;
    issueTool(
      toolId: bigint,
      issuedTo: string,
      issuedDate: string,
      expectedReturnDate: string,
      notes: string,
    ): Promise<Option<Issue>>;
    returnTool(issueId: bigint, returnDate: string): Promise<Option<Issue>>;
    getToolIssueHistory(toolId: bigint): Promise<Issue[]>;
    getActiveIssues(): Promise<Issue[]>;
    getDashboardStats(): Promise<DashboardStats>;
  }

  interface Backend {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<
      { __kind__: "admin" } | { __kind__: "user" } | { __kind__: "guest" }
    >;
    isCallerAdmin(): Promise<boolean>;
    addTool(
      name: string,
      category: string,
      condition: ToolCondition,
      description: string,
      location: string,
      purchaseDate: string,
      warrantyExpiry: string,
    ): Promise<Tool>;
    updateTool(
      id: bigint,
      name: string,
      category: string,
      condition: ToolCondition,
      description: string,
      location: string,
      purchaseDate: string,
      warrantyExpiry: string,
    ): Promise<Option<Tool>>;
    deleteTool(id: bigint): Promise<boolean>;
    getTool(id: bigint): Promise<Option<Tool>>;
    getAllTools(): Promise<Tool[]>;
    getToolsByCategory(category: string): Promise<Tool[]>;
    getToolsByStatus(available: boolean): Promise<Tool[]>;
    issueTool(
      toolId: bigint,
      issuedTo: string,
      issuedDate: string,
      expectedReturnDate: string,
      notes: string,
    ): Promise<Option<Issue>>;
    returnTool(issueId: bigint, returnDate: string): Promise<Option<Issue>>;
    getToolIssueHistory(toolId: bigint): Promise<Issue[]>;
    getActiveIssues(): Promise<Issue[]>;
    getDashboardStats(): Promise<DashboardStats>;
  }
}
