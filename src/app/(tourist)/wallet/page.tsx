import { Ticket } from 'lucide-react'
import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { WalletTickets } from './wallet-tickets'

export const metadata = { title: 'Mi Wallet' }

interface Props {
  searchParams: Promise<{ confirmed?: string }>
}

export default async function WalletPage({ searchParams }: Props) {
  const { confirmed } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    const cookieStore = await cookies()
    const raw = cookieStore.get('guest_tokens')?.value
    const guestTokens: string[] = raw ? JSON.parse(raw) : []

    if (guestTokens.length > 0) {
      const bookings = await prisma.bookings.findMany({
        where: { guest_token: { in: guestTokens } },
        select: {
          booking_items: {
            select: {
              tickets: {
                select: {
                  id: true,
                  qr_code: true,
                  status: true,
                  service_date: true,
                  service_time: true,
                  quantity: true,
                  experiences: { select: { title: true } },
                  provider_profiles: { select: { business_name: true } },
                },
              },
            },
          },
        },
      })

      const guestTickets = bookings
        .flatMap((b) => b.booking_items.map((i) => i.tickets))
        .filter((t): t is NonNullable<typeof t> => t !== null)
        .map((t) => ({
          ...t,
          service_date: t.service_date.toISOString().split('T')[0],
          service_time: t.service_time
            ? `${t.service_time.getUTCHours().toString().padStart(2, '0')}:${t.service_time.getUTCMinutes().toString().padStart(2, '0')}:${t.service_time.getUTCSeconds().toString().padStart(2, '0')}`
            : null,
        }))

      return (
        <div className="bg-background pb-20">
          {confirmed === '1' && (
            <div className="bg-teal-700 text-white px-6 py-4">
              <div className="max-w-lg mx-auto flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-bold text-sm">¡Reserva confirmada!</p>
                  <p className="text-xs text-white/80">Tus tickets ya están listos aquí abajo.</p>
                </div>
              </div>
            </div>
          )}
          <div className="md:hidden container mx-auto max-w-md px-6 pt-4">
            <WalletTickets tickets={guestTickets} />
          </div>
          <div className="hidden md:block container mx-auto max-w-6xl px-8 pt-8">
            <div className="border-b bg-white">
              <div className="max-w-6xl mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold text-slate-800">My Wallet</h1>
                <p className="text-slate-500 mt-1">All your booked experiences in one place</p>
              </div>
            </div>
            <div className="pt-8">
              <WalletTickets tickets={guestTickets} />
            </div>
          </div>
          {/* Soft invite to register */}
          <div className="container mx-auto max-w-md px-6 mt-8">
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-teal-800">¿Quieres guardar tus tickets para siempre?</p>
              <p className="text-xs text-teal-700">Crea una cuenta gratis y accede a tus reservaciones desde cualquier dispositivo.</p>
              <div className="flex gap-2">
                <Link
                  href="/register"
                  className="flex-1 text-center bg-teal-700 text-white rounded-xl py-2.5 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/login?redirectTo=/wallet"
                  className="flex-1 text-center border border-teal-300 text-teal-700 rounded-xl py-2.5 text-xs font-semibold active:scale-95 transition-transform"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-6">
            <Ticket className="h-9 w-9 text-teal-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tu wallet está vacío</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-xs">
            Crea una cuenta para guardar tus tickets, ver tu historial y acceder a tus reservaciones desde cualquier dispositivo.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link
              href="/register"
              className="block text-center bg-teal-700 text-white rounded-2xl py-3.5 text-sm font-semibold active:scale-95 transition-transform"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/login?redirectTo=/wallet"
              className="block text-center border border-slate-200 text-slate-700 rounded-2xl py-3.5 text-sm font-semibold active:scale-95 transition-transform"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </>
    )
  }

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })

  const ticketRows = profile
    ? await prisma.tickets.findMany({
        where: { user_id: profile.id },
        select: {
          id: true,
          qr_code: true,
          status: true,
          service_date: true,
          service_time: true,
          quantity: true,
          experiences: { select: { title: true } },
          provider_profiles: { select: { business_name: true } },
        },
        orderBy: { created_at: 'desc' },
      })
    : []

  const tickets = ticketRows.map((t) => ({
    ...t,
    service_date: t.service_date.toISOString().split('T')[0],
    service_time: t.service_time
      ? `${t.service_time.getUTCHours().toString().padStart(2, '0')}:${t.service_time.getUTCMinutes().toString().padStart(2, '0')}:${t.service_time.getUTCSeconds().toString().padStart(2, '0')}`
      : null,
  }))

  return (
    <div className="bg-background pb-20">
      {confirmed === '1' && (
        <div className="bg-teal-700 text-white px-6 py-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-sm">¡Reserva confirmada!</p>
              <p className="text-xs text-white/80">Tus tickets ya están listos aquí abajo.</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop page hero */}
      <div className="hidden md:block border-b bg-white">
        <div className="container mx-auto max-w-6xl px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800">My Wallet</h1>
          <p className="text-slate-500 mt-1">All your booked experiences in one place</p>
        </div>
      </div>

      {/* Mobile content */}
      <div className="md:hidden container mx-auto max-w-md px-6 pt-4">
        <WalletTickets tickets={tickets} />
      </div>

      {/* Desktop content */}
      <div className="hidden md:block container mx-auto max-w-6xl px-8 pt-8">
        <WalletTickets tickets={tickets} />
      </div>
    </div>
  )
}
