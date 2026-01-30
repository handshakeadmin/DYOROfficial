/**
 * Type definitions for Admin AI Assistant
 */

export type AdminAIPage =
  | "dashboard"
  | "products"
  | "product-edit"
  | "orders"
  | "order-detail"
  | "discount-codes"
  | "affiliates";

export type AdminAIMode = "chat" | "autofill";

export interface AdminAIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AdminAIContext {
  page: AdminAIPage;
  formData?: Record<string, unknown>;
  entityId?: string;
}

export interface AdminAIRequest {
  message: string;
  context: AdminAIContext;
  mode: AdminAIMode;
  history?: AdminAIMessage[];
}

export interface ProductAutofillData {
  shortDescription?: string;
  description?: string;
  longDescription?: string;
  researchApplications?: string[];
  benefits?: string[];
  mechanismOfAction?: string;
  dosage?: string;
  storageInstructions?: string;
  suggestedCategory?: string;
  molecularWeight?: string;
  sequence?: string;
}

export interface AdminAIChatResponse {
  success: true;
  response: string;
  mode: "chat";
}

export interface AdminAIAutofillResponse {
  success: true;
  structuredData: ProductAutofillData;
  mode: "autofill";
}

export interface AdminAIErrorResponse {
  success: false;
  error: string;
}

export type AdminAIResponse =
  | AdminAIChatResponse
  | AdminAIAutofillResponse
  | AdminAIErrorResponse;

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export interface PageQuickActions {
  [key: string]: QuickAction[];
}
