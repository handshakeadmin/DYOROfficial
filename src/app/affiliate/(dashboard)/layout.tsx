import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { AffiliateHeader } from "@/components/affiliate/AffiliateHeader";

export const metadata = {
  title: "Affiliate Dashboard - DYORWellness",
  description: "Manage your affiliate account and track commissions",
};

export default async function AffiliateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/affiliate/login");
  }

  // Verify user is an affiliate
  const { data: affiliateCode } = await supabase
    .from("discount_codes")
    .select("id")
    .eq("affiliate_email", user.email)
    .eq("is_affiliate", true)
    .single();

  if (!affiliateCode) {
    redirect("/affiliate/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AffiliateHeader userEmail={user.email || ""} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
