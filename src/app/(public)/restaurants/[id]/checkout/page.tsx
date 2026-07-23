'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Percent, Plus, Ticket } from 'lucide-react'

export default function RestaurantCheckoutPage() {
    const router = useRouter()

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
                        CHECKOUT
                    </h1>
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            <main className="container mx-auto px-6 flex flex-col gap-5 mt-4 max-w-md">

                {/* Top Info Section */}
                <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0 overflow-hidden relative">
                        {/* Placeholder for the Rolandi's image */}
                        <div className="absolute inset-0 bg-[#8c5230] mix-blend-multiply opacity-40"></div>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                        <div className="flex items-center gap-8">
                            <span className="text-xs font-bold text-slate-900">XP</span>
                            <span className="text-xs text-slate-700">Rolandis CUN</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-xs font-bold text-slate-900">Date</span>
                            <span className="text-xs text-slate-700">15/06/22</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-xs font-bold text-slate-900">Time</span>
                            <span className="text-xs text-slate-700">20:00 PM</span>
                        </div>

                        <Link
                            href="#"
                            className="text-[10px] text-slate-800 underline decoration-slate-800 underline-offset-2 mt-2 hover:text-slate-600"
                        >
                            more info
                        </Link>
                    </div>
                </div>

                {/* Order Summary Card */}
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col mt-2">
                    <div className="py-3 px-4 text-center">
                        <h3 className="font-bold text-sm text-slate-800">Order Summary</h3>
                    </div>
                    {/* Dashed Line */}
                    <div className="border-t border-dashed border-slate-300 mx-4"></div>

                    <div className="px-4 py-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-700">1 x Kids</span>
                            <span className="text-slate-700">$ 100.00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-700">2 x Adults</span>
                            <span className="text-slate-700">$ 400.00</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Ticket Card */}
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="py-3 px-4 text-center">
                        <h3 className="font-bold text-sm text-slate-800">Checkout Ticket</h3>
                    </div>
                    {/* Dashed Line */}
                    <div className="border-t border-dashed border-slate-300 mx-4"></div>

                    <div className="px-8 py-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 w-24 text-right">Items:</span>
                            <span className="text-slate-600 w-20 text-left">2 Items</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 w-24 text-right">Discount:</span>
                            <span className="text-slate-600 w-20 text-left">0</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 w-24 text-right">Subtotal:</span>
                            <span className="text-slate-600 w-20 text-left">$ 504.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 w-24 text-right">Service Fee:</span>
                            <span className="text-slate-600 w-20 text-left">0</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700 w-24 text-right">IVA (16%):</span>
                            <span className="text-slate-600 w-20 text-left">$ 96.00</span>
                        </div>
                    </div>

                    {/* Dashed Line */}
                    <div className="border-t border-dashed border-slate-300 mx-4"></div>

                    <div className="py-4 px-8 flex justify-center items-center gap-4">
                        <span className="font-bold text-sm text-slate-800">TOTAL:</span>
                        <span className="font-bold text-sm text-slate-800">$ 600.00 USD</span>
                    </div>
                </div>

                {/* Special Notes */}
                <button className="w-full border border-slate-200 rounded-xl bg-white shadow-sm py-4 text-center active:scale-[0.98] transition-transform">
                    <span className="font-bold text-sm text-slate-800">Special Notes</span>
                </button>

                {/* Coupon Code */}
                <div className="flex justify-center mt-2">
                    <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
                        <Percent className="h-4 w-4 text-teal-600" strokeWidth={3} />
                        <span className="text-[10px] font-medium text-slate-800 underline decoration-slate-800 underline-offset-2">coupon code</span>
                    </button>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => router.push('/cart')}
                        className="flex-1 flex items-center justify-center gap-2 border border-teal-700 text-teal-700 rounded-md py-3 active:scale-95 transition-transform bg-white"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2} />
                        <span className="text-sm font-semibold">add to cart</span>
                    </button>
                    <button
                        onClick={() => router.push('/success')}
                        className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white rounded-md py-3 active:scale-95 transition-transform"
                    >
                        <Ticket className="h-5 w-5" />
                        <span className="text-sm font-semibold">pay now</span>
                    </button>
                </div>
            </main>
        </div>
    )
}
