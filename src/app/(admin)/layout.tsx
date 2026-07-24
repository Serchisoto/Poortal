import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AdminHeader } from '@/components/layout/admin-header'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminBottomNav } from '@/components/layout/admin-bottom-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/login?redirectTo=/admin/dashboard')
  }

  // Single source of truth: user.role in Better Auth (mirrors the edge middleware)
  if ((session.user as { role?: string }).role !== 'admin') {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
      <AdminBottomNav />
    </div>
  )
}
