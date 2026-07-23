'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Info, Minus, Plus, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TourBookingPage() {
    const router = useRouter()

    // Mock State for UI interactivity
    const [selectedDate, setSelectedDate] = useState('15-jun')
    const [selectedCategory, setSelectedCategory] = useState<'A' | 'B'>('A')

    // Ticket quantities state
    const [tickets, setTickets] = useState<{ id: string, name: string, type: string, price: number, qty: number }[]>([
        { id: '1', name: 'Regular Ticket', type: 'Dance floor', price: 100, qty: 0 },
        { id: '2', name: 'Regular Ticket', type: 'Dance floor', price: 100, qty: 0 },
        { id: '3', name: 'Regular Ticket', type: 'Dance floor', price: 100, qty: 0 },
        { id: '4', name: 'Regular Ticket', type: 'Dance floor', price: 100, qty: 0 },
    ])

    const updateQty = (id: string, delta: number) => {
        setTickets(prev => prev.map(t => {
            if (t.id === id) {
                const newQty = Math.max(0, t.qty + delta)
                return { ...t, qty: newQty }
            }
            return t
        }))
    }

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.qty), 0)

    const handleContinue = () => {
        if (totalAmount > 0) {
            router.push('/tours/1/checkout')
        }
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
                    <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">
                        ROLANDIS
                    </h1>
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            <main className="container mx-auto px-6 flex flex-col mt-4 max-w-md">

                {/* Date Selection Row */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setSelectedDate('15-jun')}
                        className={cn("flex flex-col items-center justify-center rounded-full px-6 py-2 transition-colors", selectedDate === '15-jun' ? "bg-teal-700 text-white" : "border border-slate-200 text-slate-600")}
                    >
                        <span className="text-[10px] font-bold tracking-wider uppercase">MON</span>
                        <span className="text-[10px]">15 Jun</span>
                    </button>
                    <button
                        onClick={() => setSelectedDate('16-jun')}
                        className={cn("flex flex-col items-center justify-center rounded-full px-6 py-2 transition-colors", selectedDate === '16-jun' ? "bg-teal-700 text-white" : "border border-slate-200 text-slate-600")}
                    >
                        <span className="text-[10px] uppercase font-medium">TUE</span>
                        <span className="text-[10px]">16 Jun</span>
                    </button>
                    <button
                        onClick={() => setSelectedDate('17-jun')}
                        className={cn("flex flex-col items-center justify-center rounded-full px-6 py-2 transition-colors", selectedDate === '17-jun' ? "bg-teal-700 text-white" : "border border-slate-200 text-slate-600")}
                    >
                        <span className="text-[10px] uppercase font-medium">WED</span>
                        <span className="text-[10px]">17 Jun</span>
                    </button>
                </div>

                {/* Time Selection */}
                <div className="mt-6 flex justify-start">
                    <div className="bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md">
                        8:00 pm
                    </div>
                </div>

                {/* Categories Tab */}
                <div className="mt-6 flex gap-2 w-full">
                    <button
                        onClick={() => setSelectedCategory('A')}
                        className={cn("flex-1 py-3 text-xs font-semibold rounded-md transition-colors", selectedCategory === 'A' ? "bg-teal-700 text-white shadow-sm" : "bg-white border text-slate-800 border-slate-200")}
                    >
                        CATEGORY A
                    </button>
                    <button
                        onClick={() => setSelectedCategory('B')}
                        className={cn("flex-1 py-3 text-xs font-semibold rounded-md transition-colors", selectedCategory === 'B' ? "bg-teal-700 text-white shadow-sm" : "bg-white border text-slate-800 border-slate-200")}
                    >
                        CATEGORY B
                    </button>
                </div>

                {/* Tickets List */}
                <div className="mt-6 flex flex-col gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-4 rounded-full border border-slate-200 shadow-sm bg-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-700 rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                                    <Info className="text-white h-3.5 w-3.5" strokeWidth={3} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-[10px] text-teal-700 font-bold leading-tight">{ticket.name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium leading-tight mb-1">{ticket.type}</div>
                                    <div className="font-bold text-slate-900">$ {ticket.price.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pr-1">
                                <button
                                    onClick={() => updateQty(ticket.id, -1)}
                                    className="p-1 active:scale-95 text-slate-900"
                                >
                                    <Minus className="h-5 w-5" strokeWidth={3} />
                                </button>
                                {ticket.qty > 0 && (
                                    <span className="font-bold text-sm w-4 text-center">{ticket.qty}</span>
                                )}
                                <button
                                    onClick={() => updateQty(ticket.id, 1)}
                                    className="bg-teal-700 text-white rounded-full p-1.5 shadow-sm active:scale-95"
                                >
                                    <Plus className="h-5 w-5" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-24 inset-x-0 mx-auto max-w-md px-6 z-40">
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg px-6 py-4 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-baseline gap-4">
                        <span className="text-teal-700 font-bold tracking-widest text-lg">TOTAL</span>
                        <span className="text-slate-900 font-bold text-lg">$ {totalAmount.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleContinue}
                        disabled={totalAmount === 0}
                        className={cn("flex items-center gap-1 text-white rounded-md px-4 py-2 text-xs font-semibold active:scale-95 transition-all outline-none", totalAmount > 0 ? "bg-teal-700" : "bg-slate-300")}
                    >
                        continue
                        <ChevronRight className="h-4 w-4" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    )
}
