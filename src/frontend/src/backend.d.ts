import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Issue {
    id: bigint;
    returnedQuantity: bigint;
    isReturned: boolean;
    issuedDate: string;
    expectedReturnDate: string;
    toolId: bigint;
    notes: string;
    quantity: bigint;
    issuedTo: string;
    returnDate: string;
}
export interface Tool {
    id: bigint;
    status: ToolStatus;
    purchaseDate: string;
    availableQuantity: bigint;
    name: string;
    description: string;
    warrantyExpiry: string;
    category: string;
    totalQuantity: bigint;
    location: string;
    condition: ToolCondition;
}
export interface DashboardStats {
    totalTools: bigint;
    issuedTools: bigint;
    availableTools: bigint;
}
export interface UserProfile {
    name: string;
}
export enum ToolCondition {
    Fair = "Fair",
    Good = "Good",
    Poor = "Poor"
}
export enum ToolStatus {
    Available = "Available",
    Issued = "Issued"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTool(name: string, category: string, condition: ToolCondition, description: string, location: string, purchaseDate: string, warrantyExpiry: string, totalQuantity: bigint): Promise<Tool>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(currentPassword: string, newPassword: string): Promise<boolean>;
    deleteTool(id: bigint): Promise<boolean>;
    getActiveIssues(): Promise<Array<Issue>>;
    getAllTools(): Promise<Array<Tool>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getTool(id: bigint): Promise<Tool | null>;
    getToolIssueHistory(toolId: bigint): Promise<Array<Issue>>;
    getToolsByCategory(category: string): Promise<Array<Tool>>;
    getToolsByStatus(available: boolean): Promise<Array<Tool>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    issueTool(toolId: bigint, issuedTo: string, issuedDate: string, expectedReturnDate: string, notes: string, quantity: bigint): Promise<Issue | null>;
    returnTool(issueId: bigint, returnDate: string, returnQuantity: bigint): Promise<Issue | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTool(id: bigint, name: string, category: string, condition: ToolCondition, description: string, location: string, purchaseDate: string, warrantyExpiry: string, totalQuantity: bigint): Promise<Tool | null>;
    verifyAdminLogin(username: string, password: string): Promise<boolean>;
}
