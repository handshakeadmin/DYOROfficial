"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signOut(): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate all paths to clear any cached user data
    revalidatePath("/", "layout");

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to sign out" };
  }
}
