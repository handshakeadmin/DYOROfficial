"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  AdminAIPage,
  AdminAIMessage,
  AdminAIContext as AIContextType,
  AdminAIResponse,
  ProductAutofillData,
} from "@/types/admin-ai";

interface AdminAIState {
  isOpen: boolean;
  isLoading: boolean;
  messages: AdminAIMessage[];
  currentPage: AdminAIPage;
  formData: Record<string, unknown>;
  entityId?: string;
  error: string | null;
}

interface AdminAIContextValue extends AdminAIState {
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  setCurrentPage: (page: AdminAIPage) => void;
  setFormData: (data: Record<string, unknown>) => void;
  setEntityId: (id?: string) => void;
  sendMessage: (message: string) => Promise<string | null>;
  requestAutofill: (peptideName: string, formData?: Record<string, unknown>) => Promise<ProductAutofillData | null>;
  clearMessages: () => void;
  clearError: () => void;
}

const AdminAIContext = createContext<AdminAIContextValue | null>(null);

interface AdminAIProviderProps {
  children: ReactNode;
}

export function AdminAIProvider({ children }: AdminAIProviderProps): React.ReactElement {
  const [state, setState] = useState<AdminAIState>({
    isOpen: false,
    isLoading: false,
    messages: [],
    currentPage: "dashboard",
    formData: {},
    error: null,
  });

  const openAssistant = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeAssistant = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggleAssistant = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setCurrentPage = useCallback((page: AdminAIPage) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setFormData = useCallback((data: Record<string, unknown>) => {
    setState((prev) => ({ ...prev, formData: data }));
  }, []);

  const setEntityId = useCallback((id?: string) => {
    setState((prev) => ({ ...prev, entityId: id }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [] }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const sendMessage = useCallback(
    async (message: string): Promise<string | null> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        messages: [
          ...prev.messages,
          { role: "user" as const, content: message },
        ],
      }));

      try {
        const context: AIContextType = {
          page: state.currentPage,
          formData: state.formData,
          entityId: state.entityId,
        };

        const response = await fetch("/api/admin/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context,
            mode: "chat",
            history: state.messages,
          }),
        });

        const data: AdminAIResponse = await response.json();

        if (!data.success) {
          const errorMessage = "error" in data ? data.error : "Unknown error";
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return null;
        }

        if (data.mode === "chat") {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            messages: [
              ...prev.messages,
              { role: "assistant" as const, content: data.response },
            ],
          }));
          return data.response;
        }

        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    [state.currentPage, state.formData, state.entityId, state.messages]
  );

  const requestAutofill = useCallback(
    async (
      peptideName: string,
      formData?: Record<string, unknown>
    ): Promise<ProductAutofillData | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const context: AIContextType = {
          page: "product-edit",
          formData: formData || { name: peptideName },
        };

        const response = await fetch("/api/admin/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: peptideName,
            context,
            mode: "autofill",
          }),
        });

        const data: AdminAIResponse = await response.json();

        if (!data.success) {
          const errorMessage = "error" in data ? data.error : "Unknown error";
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return null;
        }

        if (data.mode === "autofill") {
          setState((prev) => ({ ...prev, isLoading: false }));
          return data.structuredData;
        }

        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to request autofill";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    []
  );

  const value: AdminAIContextValue = {
    ...state,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    setCurrentPage,
    setFormData,
    setEntityId,
    sendMessage,
    requestAutofill,
    clearMessages,
    clearError,
  };

  return (
    <AdminAIContext.Provider value={value}>{children}</AdminAIContext.Provider>
  );
}

export function useAdminAI(): AdminAIContextValue {
  const context = useContext(AdminAIContext);
  if (!context) {
    throw new Error("useAdminAI must be used within an AdminAIProvider");
  }
  return context;
}
