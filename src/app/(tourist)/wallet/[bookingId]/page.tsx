import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { headers, cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ROUTES } from '@/lib/constants'
import { QrCodeDisplay } from './qr-code-display'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(date: Date) {
  return `${date.getUTCDate()} ${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

function formatTime(time: Date) {
  const h = time.getUTCHours()
  const m = time.getUTCMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

const TICKET_SELECT = {
  id: true,
  qr_code: true,
  status: true,
  service_date: true,
  service_time: true,
  quantity: true,
  experiences: { select: { title: true, short_description: true } },
  provider_profiles: { select: { business_name: true } },
} as const

export const metadata = { title: 'Ticket QR' }

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  let ticket: Awaited<ReturnType<typeof prisma.tickets.findFirst<{ select: typeof TICKET_SELECT }>>> = null

  if (session?.user) {
    const profile = await prisma.profiles.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    })
    if (profile) {
      ticket = await prisma.tickets.findFirst({
        where: { id: bookingId, user_id: profile.id },
        select: TICKET_SELECT,
      })
    }
  } else {
    // Guest: look up ticket via guest_tokens cookie
    const cookieStore = await cookies()
    const raw = cookieStore.get('guest_tokens')?.value
    const guestTokens: string[] = raw ? JSON.parse(raw) : []

    if (guestTokens.length > 0) {
      const booking = await prisma.bookings.findFirst({
        where: {
          guest_token: { in: guestTokens },
          booking_items: { some: { tickets: { id: bookingId } } },
        },
        select: {
          booking_items: {
            where: { tickets: { id: bookingId } },
            select: { tickets: { select: TICKET_SELECT } },
          },
        },
      })
      ticket = booking?.booking_items[0]?.tickets ?? null
    }
  }

  if (!ticket) notFound()

  return (
    <div className="bg-background pb-20">

      {/* Back */}
      <div className="container mx-auto max-w-sm md:max-w-lg px-6 pt-4">
        <Link
          href={ROUTES.wallet}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-full px-4 py-2 mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Wallet
        </Link>
      </div>

      <div className="flex flex-col gap-6 max-w-sm md:max-w-lg mx-auto px-6">

        {/* Ticket card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header strip */}
        <div className="bg-primary px-6 py-5 text-white">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-70 mb-1">
            {ticket.provider_profiles?.business_name || 'Proveedor'}
          </p>
          <h1 className="text-lg font-bold leading-tight">
            {ticket.experiences?.title || 'Experiencia'}
          </h1>
          {ticket.experiences?.short_description && (
            <p className="text-xs opacity-70 mt-1 line-clamp-2">
              {ticket.experiences.short_description}
            </p>
          )}
        </div>

        {/* Dashed divider */}
        <div className="flex items-center px-4">
          <div className="w-5 h-5 -ml-7 rounded-full bg-slate-100 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-5 -mr-7 rounded-full bg-slate-100 border border-slate-200" />
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center py-8 px-6">
          <QrCodeDisplay value={ticket.qr_code} />
          <p className="text-[10px] text-slate-400 mt-3 font-mono tracking-wider">
            {ticket.qr_code.substring(0, 8).toUpperCase()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Presenta este código al proveedor
          </p>
        </div>

        {/* Dashed divider */}
        <div className="flex items-center px-4">
          <div className="w-5 h-5 -ml-7 rounded-full bg-slate-100 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-5 h-5 -mr-7 rounded-full bg-slate-100 border border-slate-200" />
        </div>

        {/* Details */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Fecha</span>
            <span className="text-xs font-bold text-slate-800">{formatDate(ticket.service_date)}</span>
          </div>
          {ticket.service_time && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Hora</span>
              <span className="text-xs font-bold text-slate-800">{formatTime(ticket.service_time)}</span>
            </div>
          )}
          {ticket.quantity > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Personas</span>
              <span className="text-xs font-bold text-slate-800">×{ticket.quantity}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Estado</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ticket.status === 'active'
                  ? 'bg-teal-100 text-primary'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {ticket.status === 'active' ? 'ACTIVO' : ticket.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
