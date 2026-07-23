'use client'

import { useState } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Share2, CalendarDays, Clock, Users, Ticket } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

type Ticket = {
  id: string
  qr_code: string | null
  status: string
  service_date: string
  service_time: string | null
  quantity: number
  experiences: { title: string } | null
  provider_profiles: { business_name: string } | null
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(2)
  return `${day}/${month}/${year}`
}

function formatLongDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function formatShortTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  return `${h}:${String(m).padStart(2, '0')}`
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function ticketNumber(id: string) {
  return '#' + id.replace(/-/g, '').slice(-5).toUpperCase()
}

// ── Mobile card (unchanged) ────────────────────────────────────────────────
function TicketCard({ ticket }: { ticket: Ticket }) {
  const isPending = !ticket.qr_code

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const text = `${ticket.experiences?.title || 'Ticket'} ${ticketNumber(ticket.id)}`
    if (navigator.share) {
      await navigator.share({ title: 'Mi ticket', text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <Link href={ROUTES.walletTicket(ticket.id)}>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform">

        {/* Top: QR + info */}
        <div className="flex gap-3 p-4">
          {/* QR o pending */}
          <div className="shrink-0 flex items-start justify-center pt-0.5">
            {isPending ? (
              <div className="h-16 w-16 rounded-full bg-teal-700 flex items-center justify-center">
                <span className="text-white text-xs font-medium">pend</span>
              </div>
            ) : (
              <QRCode value={ticket.qr_code!} size={64} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-tight flex-1 min-w-0">
                <span className="font-bold text-teal-700">Tour: </span>
                <span className="text-slate-700">{ticket.experiences?.title || 'Experiencia'}</span>
              </p>
              <button
                onClick={handleShare}
                className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between mt-0.5">
              <p className="text-sm font-bold text-slate-900">
                {ticket.quantity} {ticket.quantity === 1 ? 'adult' : 'adults'}
              </p>
              <p className="text-amber-500 font-bold text-sm">
                {ticketNumber(ticket.id)}
              </p>
            </div>

            {ticket.provider_profiles?.business_name && (
              <p className="text-xs text-slate-500 mt-0.5">
                {ticket.provider_profiles.business_name}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: fechas */}
        {ticket.service_date && (
          <>
            <div className="border-t border-dashed border-slate-200 mx-4" />
            <div className="flex gap-6 px-4 py-3">
              <div>
                <p className="text-[9px] text-slate-400">starts:</p>
                <p className="text-xs text-slate-700">
                  {formatShortDate(ticket.service_date)}
                  {ticket.service_time && (
                    <span className="ml-2 font-semibold">{formatShortTime(ticket.service_time)}</span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}

// ── Desktop card ───────────────────────────────────────────────────────────
function DesktopTicketCard({ ticket }: { ticket: Ticket }) {
  const isPending = !ticket.qr_code
  const isActive = ticket.status === 'active'

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const text = `${ticket.experiences?.title || 'Ticket'} ${ticketNumber(ticket.id)}`
    if (navigator.share) {
      await navigator.share({ title: 'Mi ticket', text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <Link href={ROUTES.walletTicket(ticket.id)} className="group block">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

        {/* Header band */}
        <div className={cn('px-5 py-4', isActive ? 'bg-teal-700' : 'bg-slate-400')}>
          {ticket.provider_profiles?.business_name && (
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-0.5">
              {ticket.provider_profiles.business_name}
            </p>
          )}
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {ticket.experiences?.title || 'Experiencia'}
          </h3>
        </div>

        {/* QR section */}
        <div className="flex flex-col items-center py-6 px-5 gap-3">
          {isPending ? (
            <div className="h-28 w-28 rounded-full bg-teal-700/10 border-2 border-dashed border-teal-300 flex items-center justify-center">
              <span className="text-teal-600 text-xs font-semibold text-center leading-tight px-2">Pending<br />confirmation</span>
            </div>
          ) : (
            <div className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
              <QRCode value={ticket.qr_code!} size={112} />
            </div>
          )}

          {/* Ticket number + status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-500 tracking-wider">
              {ticketNumber(ticket.id)}
            </span>
            <span className={cn(
              'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
              isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
            )}>
              {isActive ? 'ACTIVE' : ticket.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="flex items-center px-4">
          <div className="w-4 h-4 -ml-6 rounded-full bg-slate-100 border border-slate-200 shrink-0" />
          <div className="flex-1 border-t border-dashed border-slate-200 mx-1" />
          <div className="w-4 h-4 -mr-6 rounded-full bg-slate-100 border border-slate-200 shrink-0" />
        </div>

        {/* Details */}
        <div className="px-5 py-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{formatLongDate(ticket.service_date)}</span>
          </div>
          {ticket.service_time && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{formatTime(ticket.service_time)}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Users className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{ticket.quantity} {ticket.quantity === 1 ? 'adult' : 'adults'}</span>
          </div>
        </div>

        {/* Footer: share */}
        <div className="border-t border-slate-100 px-5 py-3 flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function WalletTickets({ tickets }: { tickets: Ticket[] }) {
  const [tab, setTab] = useState<'active' | 'inactive'>('active')

  const activeTickets = tickets.filter((t) => t.status === 'active')
  const inactiveTickets = tickets.filter((t) => t.status !== 'active')
  const filtered = tab === 'active' ? activeTickets : inactiveTickets

  return (
    <>
      {/* ── Mobile layout ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('active')}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-colors',
              tab === 'active' ? 'bg-teal-700 text-white' : 'border border-slate-300 text-slate-600'
            )}
          >
            Active tickets
          </button>
          <button
            onClick={() => setTab('inactive')}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-colors',
              tab === 'inactive' ? 'bg-teal-700 text-white' : 'border border-slate-300 text-slate-600'
            )}
          >
            Inactive Tickets
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-10">
              No hay tickets {tab === 'active' ? 'activos' : 'inactivos'}
            </p>
          ) : (
            filtered.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      </div>

      {/* ── Desktop layout ────────────────────────────────────── */}
      <div className="hidden md:block">
        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-800">{activeTickets.length}</span>
            <span className="text-sm text-slate-500">active tickets</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-400">{inactiveTickets.length}</span>
            <span className="text-sm text-slate-400">past tickets</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-slate-200 mb-8">
          <button
            onClick={() => setTab('active')}
            className={cn(
              'px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
              tab === 'active'
                ? 'border-teal-700 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            Active tickets
            {activeTickets.length > 0 && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                tab === 'active' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
              )}>
                {activeTickets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('inactive')}
            className={cn(
              'px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
              tab === 'inactive'
                ? 'border-teal-700 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            Past tickets
            {inactiveTickets.length > 0 && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                tab === 'inactive' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
              )}>
                {inactiveTickets.length}
              </span>
            )}
          </button>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Ticket className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium mb-1">
              {tab === 'active' ? 'No active tickets' : 'No past tickets'}
            </p>
            <p className="text-sm text-slate-400">
              {tab === 'active' ? 'Your upcoming experiences will appear here.' : 'Your completed experiences will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((ticket) => (
              <DesktopTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
