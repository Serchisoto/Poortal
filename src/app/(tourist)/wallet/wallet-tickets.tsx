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

// ── Mobile card ────────────────────────────────────────────────────────────
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform">

        {/* Top: QR + info */}
        <div className="flex gap-3 p-4">
          {/* QR o pending */}
          <div className="shrink-0 flex items-start justify-center pt-0.5">
            {isPending ? (
              <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-primary text-xs font-medium">pend</span>
              </div>
            ) : (
              <QRCode value={ticket.qr_code!} size={64} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-tight flex-1 min-w-0">
                <span className="font-bold text-primary">Tour: </span>
                <span className="text-foreground/80">{ticket.experiences?.title || 'Experiencia'}</span>
              </p>
              <button
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground shrink-0 p-1"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between mt-0.5">
              <p className="text-sm font-bold text-foreground">
                {ticket.quantity} {ticket.quantity === 1 ? 'adult' : 'adults'}
              </p>
              <p className="text-amber-500 font-bold text-sm">
                {ticketNumber(ticket.id)}
              </p>
            </div>

            {ticket.provider_profiles?.business_name && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {ticket.provider_profiles.business_name}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: fechas */}
        {ticket.service_date && (
          <>
            <div className="border-t border-dashed border-border mx-4" />
            <div className="flex gap-6 px-4 py-3">
              <div>
                <p className="text-[9px] text-muted-foreground">starts:</p>
                <p className="text-xs text-foreground/80">
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

        {/* Header band */}
        <div className={cn('px-5 py-4', isActive ? 'bg-primary' : 'bg-muted')}>
          {ticket.provider_profiles?.business_name && (
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary-foreground/60 mb-0.5">
              {ticket.provider_profiles.business_name}
            </p>
          )}
          <h3 className={cn('text-sm font-bold leading-snug line-clamp-2', isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>
            {ticket.experiences?.title || 'Experiencia'}
          </h3>
        </div>

        {/* QR section */}
        <div className="flex flex-col items-center py-6 px-5 gap-3">
          {isPending ? (
            <div className="h-28 w-28 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
              <span className="text-primary text-xs font-semibold text-center leading-tight px-2">Pending<br />confirmation</span>
            </div>
          ) : (
            <div className="p-2 bg-background border border-border/50 rounded-xl shadow-sm">
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
              isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {isActive ? 'ACTIVE' : ticket.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="flex items-center px-4">
          <div className="w-4 h-4 -ml-6 rounded-full bg-muted border border-border shrink-0" />
          <div className="flex-1 border-t border-dashed border-border mx-1" />
          <div className="w-4 h-4 -mr-6 rounded-full bg-muted border border-border shrink-0" />
        </div>

        {/* Details */}
        <div className="px-5 py-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{formatLongDate(ticket.service_date)}</span>
          </div>
          {ticket.service_time && (
            <div className="flex items-center gap-2.5 text-sm text-foreground/80">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{formatTime(ticket.service_time)}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{ticket.quantity} {ticket.quantity === 1 ? 'adult' : 'adults'}</span>
          </div>
        </div>

        {/* Footer: share */}
        <div className="border-t border-border/50 px-5 py-3 flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              tab === 'active' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'
            )}
          >
            Active tickets
          </button>
          <button
            onClick={() => setTab('inactive')}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-colors',
              tab === 'inactive' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'
            )}
          >
            Inactive Tickets
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
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
            <span className="text-2xl font-bold text-foreground">{activeTickets.length}</span>
            <span className="text-sm text-muted-foreground">active tickets</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-muted-foreground">{inactiveTickets.length}</span>
            <span className="text-sm text-muted-foreground">past tickets</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-border mb-8">
          <button
            onClick={() => setTab('active')}
            className={cn(
              'px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
              tab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Active tickets
            {activeTickets.length > 0 && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                tab === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Past tickets
            {inactiveTickets.length > 0 && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                tab === 'inactive' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {inactiveTickets.length}
              </span>
            )}
          </button>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Ticket className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              {tab === 'active' ? 'No active tickets' : 'No past tickets'}
            </p>
            <p className="text-sm text-muted-foreground/70">
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
