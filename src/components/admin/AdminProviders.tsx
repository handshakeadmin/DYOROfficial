"use client";

import { ReactNode } from "react";
import { AdminAIProvider, AdminAIModal } from "@/components/admin/ai";

interface AdminProvidersProps {
  children: ReactNode;
}

export function AdminProviders({ children }: AdminProvidersProps): React.ReactElement {
  return (
    <AdminAIProvider>
      {children}
      <AdminAIModal />
    </AdminAIProvider>
  );
}
