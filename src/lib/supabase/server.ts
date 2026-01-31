import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function createClient() {
  if (!isSupabaseConfigured) {
    // Return a mock client for development without Supabase
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Supabase not configured") }),
            order: () => ({
              limit: async () => ({ data: null, error: new Error("Supabase not configured") }),
            }),
          }),
          in: () => ({
            order: async () => ({ data: null, error: new Error("Supabase not configured") }),
          }),
          order: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
        insert: async () => ({ data: null, error: new Error("Supabase not configured") }),
        update: () => ({
          eq: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: new Error("Supabase not configured") }),
        }),
      }),
    } as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
