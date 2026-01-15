import { auth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminRouteProvider from '@/components/admin/AdminRouteProvider';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
  title: 'Admin Dashboard - Health & Nutrition Hacks',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Don't apply admin layout to login page
  if (!session) {
    return (
      <SessionProvider>
        <AdminRouteProvider>{children}</AdminRouteProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AdminRouteProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <AdminHeader user={session.user} />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 mt-16">
              {children}
            </main>
          </div>
        </div>
      </AdminRouteProvider>
    </SessionProvider>
  );
}
