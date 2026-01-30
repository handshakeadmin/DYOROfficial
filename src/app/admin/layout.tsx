import { requireAdmin } from "@/lib/admin";
import { AdminSidebar, AdminHeader } from "@/components/admin/layout";
import { AdminProviders } from "@/components/admin/AdminProviders";

export const metadata = {
  title: "Admin Dashboard | DYORWellness",
  description: "DYORWellness Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const adminUser = await requireAdmin();

  return (
    <AdminProviders>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader user={adminUser} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
