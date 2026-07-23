'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
} from '@/actions/notifications'
import { toast } from 'sonner'
import {
  CalendarCheck,
  DollarSign,
  Star,
  AlertTriangle,
  Bell,
  Trash2,
  CheckCheck,
} from 'lucide-react'
import type { notifications } from '@/generated/prisma/client'

const typeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  booking_created: { icon: CalendarCheck, color: 'text-blue-600', label: 'Nueva reserva' },
  booking_confirmed: { icon: CalendarCheck, color: 'text-green-600', label: 'Reserva confirmada' },
  booking_rejected: { icon: CalendarCheck, color: 'text-red-600', label: 'Reserva rechazada' },
  booking_cancelled: { icon: AlertTriangle, color: 'text-amber-600', label: 'Reserva cancelada' },
  payment_received: { icon: DollarSign, color: 'text-green-600', label: 'Pago recibido' },
  payment_transferred: { icon: DollarSign, color: 'text-green-700', label: 'Pago transferido' },
  review_received: { icon: Star, color: 'text-amber-500', label: 'Nueva reseña' },
  provider_approved: { icon: Bell, color: 'text-green-600', label: 'Proveedor aprobado' },
  provider_rejected: { icon: Bell, color: 'text-red-600', label: 'Proveedor rechazado' },
  experience_approved: { icon: Bell, color: 'text-green-600', label: 'Experiencia aprobada' },
  experience_rejected: { icon: Bell, color: 'text-red-600', label: 'Experiencia rechazada' },
  general: { icon: Bell, color: 'text-muted-foreground', label: 'Notificación' },
}

type Props = {
  notifications: notifications[]
  unreadCount: number
}

export function NotificationList({ notifications, unreadCount }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleMarkRead(id: string) {
    startTransition(async () => {
      const result = await markNotificationReadAction(id)
      if (result.error) toast.error(result.error)
    })
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      const result = await markAllNotificationsReadAction()
      if (result.error) toast.error(result.error)
      else toast.success('Todas marcadas como leídas')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteNotificationAction(id)
      if (result.error) toast.error(result.error)
    })
  }

  function formatRelative(date: Date) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60_000)
    const hrs = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `Hace ${mins}m`
    if (hrs < 24) return `Hace ${hrs}h`
    return `Hace ${days}d`
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={handleMarkAllRead} disabled={isPending}>
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como leídas
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Sin notificaciones</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const cfg = typeConfig[notif.type] ?? typeConfig.general
            const Icon = cfg.icon
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                  !notif.is_read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                }`}
              >
                <div className={`mt-0.5 shrink-0 ${cfg.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{notif.title}</p>
                      {notif.body && (
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">{formatRelative(notif.created_at)}</span>
                    <div className="flex items-center gap-1">
                      {notif.link && (
                        <Button size="sm" variant="ghost" className="h-6 text-xs px-2" asChild>
                          <Link href={notif.link}>Ver</Link>
                        </Button>
                      )}
                      {!notif.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs px-2"
                          onClick={() => handleMarkRead(notif.id)}
                          disabled={isPending}
                        >
                          Marcar leída
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(notif.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
