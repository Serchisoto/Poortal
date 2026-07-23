import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getProviderNotifications, getUnreadNotificationCount } from '@/queries/notifications'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { NotificationList } from '@/components/provider/notification-list'

export const metadata = { title: 'Notificaciones' }

export default async function ProviderNotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const [notifications, unreadCount] = await Promise.all([
    getProviderNotifications(provider.user_id),
    getUnreadNotificationCount(provider.user_id),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-primary" />
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Actividad reciente de tu cuenta</p>
        </div>
      </div>

      <NotificationList notifications={notifications} unreadCount={unreadCount} />
    </div>
  )
}
