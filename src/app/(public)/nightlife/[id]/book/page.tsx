'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Info, Minus, Plus, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-client'
import { GuestEmailModal } from '@/components/guest-email-modal'

export default function NightlifeBookingPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const id = params.id
    const { data: session } = useSession()

    const [selectedDate, setSelectedDate] = useState('15-jun')
    const [selectedCategory, setSelectedCategory] = useState<'A' | 'B'>('A')
    const [showGuestModal, setShowGuestModal] = useState(false)

    const [tickets, setTickets] = useState<{ id: string, name: string, type: string, price: number, qty: number }[]>([
        { id: '1', name: 'Regular Ticket', type: 'Dance floor', price: 100, qty: 0 },
        { id: '2', name: 'VIP Ticket',     type: 'VIP area',    price: 250, qty: 0 },
        { id: '3', name: 'Table Service',  type: 'Booth',       price: 500, qty: 0 },
        { id: '4', name: 'Open Bar',       type: 'All night',   price: 150, qty: 0 },
    ])

    const updateQty = (ticketId: string, delta: number) => {
        setTickets(prev => prev.map(t =>
            t.id === ticketId ? { ...t, qty: Math.max(0, t.qty + delta) } : t
        ))
    }

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.qty), 0)
    const totalQty    = tickets.reduce((sum, t) => sum + t.qty, 0)

    function buildCheckoutParams(guestEmail?: string, guestName?: string) {
        const firstTicket = tickets.find(t => t.qty > 0)
        const p = new URLSearchParams({
            date: selectedDate,
            people: String(totalQty),
            total:  String(totalAmount),
            unitPrice: String(firstTicket?.price ?? 0),
            pricingType: 'per_person',
            providerId: '',
        })
        if (guestEmail) p.set('guestEmail', guestEmail)
        if (guestName)  p.set('guestName', guestName)
        return p.toString()
    }

    const handleContinue = () => {
        if (totalAmount <= 0) return
        if (session?.user) {
            router.push(`/nightlife/${id}/checkout?${buildCheckoutParams()}`)
        } else {
            setShowGuestModal(true)
        }
    }

    const handleGuestConfirm = (guestEmail: string, guestName: string) => {
        setShowGuestModal(false)
        router.push(`/nightlife/${id}/checkout?${buildCheckoutParams(guestEmail, guestName)}`)
    }

    return (
        <div className="min-h-screen bg-white pb-32 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
                <div className="border border-slate-200 rounded-full px-12 py-3 shadow-sm">
                    <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">BOOK</h1>
                </div>
                <div className="w-8" />
            </div>

            <main className="container mx-auto px-6 flex flex-col mt-4 max-w-md">

                {/* Date Selection */}
                <div className="flex gap-3 justify-center">
                    {[
                        { key: '15-jun', day: 'MON', label: '15 Jun' },
                        { key: '16-jun', day: 'TUE', label: '16 Jun' },
                        { key: '17-jun', day: 'WED', label: '17 Jun' },
                    ].map(({ key, day, label }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedDate(key)}
                            className={cn(
                                'flex flex-col items-center justify-center rounded-full px-6 py-2 transition-colors',
                                selectedDate === key ? 'bg-primary text-white' : 'border border-slate-200 text-slate-600'
                            )}
                        >
                            <span className="text-[10px] font-bold tracking-wider uppercase">{day}</span>
                            <span className="text-[10px]">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Time */}
                <div className="mt-6 flex justify-start">
                    <div className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-md">
                        8:00 pm
                    </div>
                </div>

                {/* Categories Tab */}
                <div className="mt-6 flex gap-2 w-full">
                    {(['A', 'B'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                'flex-1 py-3 text-xs font-semibold rounded-md transition-colors',
                                selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white border text-slate-800 border-slate-200'
                            )}
                        >
                            CATEGORY {cat}
                        </button>
                    ))}
                </div>

                {/* Tickets */}
                <div className="mt-6 flex flex-col gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-4 rounded-full border border-slate-200 shadow-sm bg-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                                    <Info className="text-white h-3.5 w-3.5" strokeWidth={3} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[10px] text-primary font-bold leading-tight">{ticket.name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium leading-tight mb-1">{ticket.type}</div>
                                    <div className="font-bold text-slate-900">$ {ticket.price.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pr-1">
                                <button onClick={() => updateQty(ticket.id, -1)} className="p-1 active:scale-95 text-slate-900">
                                    <Minus className="h-5 w-5" strokeWidth={3} />
                                </button>
                                <span className="font-bold text-sm w-4 text-center">{ticket.qty > 0 ? ticket.qty : ''}</span>
                                <button onClick={() => updateQty(ticket.id, 1)} className="bg-primary text-white rounded-full p-1.5 shadow-sm active:scale-95">
                                    <Plus className="h-5 w-5" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md px-6 z-40 pb-safe-bottom">
                <div className="mb-6 bg-white rounded-[2rem] border border-slate-200 shadow-lg px-6 py-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-4">
                        <span className="text-primary font-bold tracking-widest text-lg">TOTAL</span>
                        <span className="text-slate-900 font-bold text-lg">$ {totalAmount.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleContinue}
                        disabled={totalAmount === 0}
                        className={cn(
                            'flex items-center gap-1 text-white rounded-md px-4 py-2 text-xs font-semibold active:scale-95 transition-all outline-none',
                            totalAmount > 0 ? 'bg-primary' : 'bg-slate-300 cursor-not-allowed'
                        )}
                    >
                        continue
                        <ChevronRight className="h-4 w-4" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Guest Email Modal */}
            {showGuestModal && (
                <GuestEmailModal
                    onConfirm={handleGuestConfirm}
                    onClose={() => setShowGuestModal(false)}
                />
            )}
        </div>
    )
}
