"use client";

import { createBrowserClient } from "@supabase/ssr";

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a mock client for development without Supabase
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ error: new Error("Supabase not configured") }),
        updateUser: async () => ({ data: { user: null }, error: new Error("Supabase not configured") }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Supabase not configured") }),
          }),
        }),
        update: () => ({
          eq: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
      }),
    } as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
