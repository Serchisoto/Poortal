'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function ShoppingSearchPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        SHOPPING
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Let's go to the mall!</span>
                    </div>

                    {/* Go Shopping Option */}
                    <button
                        onClick={() => router.push('/shopping/go')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-8 mb-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Shopping Cart SVG */}
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 30L25 35H85L75 65H35L25 35" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M15 25L25 35" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                                {/* Wheels */}
                                <circle cx="40" cy="75" r="5" fill="#64748b" />
                                <circle cx="70" cy="75" r="5" fill="#64748b" />
                                {/* Shopping Bags (Yellow & Red) */}
                                <path d="M40 35H55V25C55 20 40 20 40 25V35Z" fill="#facc15" stroke="#eab308" strokeWidth="2" />
                                <path d="M55 35H70V23C70 18 55 18 55 23V35Z" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
                                <path d="M43 25V20C43 15 52 15 52 20V25" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                                <path d="M58 23V18C58 13 67 13 67 18V23" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-medium text-slate-800">Go Shopping</span>
                    </button>

                    {/* Delivery Option (Grayed Out) */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-8 opacity-50 cursor-not-allowed"
                    >
                        <div className="mb-4 grayscale">
                            {/* Mock Store/Delivery SVG */}
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="30" y="45" width="40" height="35" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                                {/* Awning */}
                                <path d="M25 45C25 40 35 35 50 35C65 35 75 40 75 45H25Z" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
                                <path d="M35 45V38M45 45V36M55 45V36M65 45V38" stroke="#64748b" strokeWidth="2" />
                                {/* Door/Window */}
                                <rect x="40" y="55" width="20" height="25" fill="#cbd5e1" />
                                <rect x="33" y="55" width="5" height="10" fill="#cbd5e1" />
                                <rect x="62" y="55" width="5" height="10" fill="#cbd5e1" />
                            </svg>
                        </div>
                        <span className="text-xl font-medium text-slate-400">Delivery</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
