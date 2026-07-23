'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function FoodSearchPage() {
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
                <div className="border border-slate-200 bg-white rounded-full px-14 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        FOOD
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Rest or maybe not?</span>
                    </div>

                    {/* Reservations Option */}
                    <button
                        onClick={() => router.push('/restaurants')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Chef Hat/Pin SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="40" fill="#fef08a" />
                                <circle cx="50" cy="50" r="35" fill="none" stroke="#ca8a04" strokeWidth="4" />
                                <path d="M50 75C50 75 70 50 70 35C70 23.9543 61.0457 15 50 15C38.9543 15 30 23.9543 30 35C30 50 50 75 50 75Z" fill="#ef4444" stroke="#991b1b" strokeWidth="4" strokeLinejoin="round" />
                                <circle cx="50" cy="35" r="15" fill="white" stroke="#991b1b" strokeWidth="4" />
                                {/* Chef Hat inside pin */}
                                <path d="M42 38H58V45H42V38Z" fill="white" stroke="#991b1b" strokeWidth="2" />
                                <path d="M42 38C42 35 38 35 38 32C38 29 42 27 45 28C47 24 53 24 55 28C58 27 62 29 62 32C62 35 58 35 58 38H42Z" fill="white" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Reservations</span>
                    </button>

                    {/* Experiences Option */}
                    <button
                        onClick={() => router.push('/food/experiences')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Plate/Salmon SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="35" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="4" />
                                <circle cx="50" cy="50" r="28" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                                <path d="M40 70C30 65 30 50 45 40L55 50L40 70Z" fill="#86efac" />
                                <path d="M60 30C70 35 70 50 55 60L45 50L60 30Z" fill="#86efac" />
                                <circle cx="45" cy="45" r="8" fill="#fde047" />
                                <circle cx="55" cy="55" r="8" fill="#ef4444" />
                                {/* Salmon slice */}
                                <path d="M35 50C35 40 45 35 55 35C65 35 70 45 65 55C60 65 50 70 40 70C30 70 35 60 35 50Z" fill="#fb923c" stroke="#f97316" strokeWidth="2" />
                                <path d="M38 52C42 45 50 40 58 40" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                                <path d="M42 58C48 52 56 48 62 48" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                                <path d="M48 65C52 60 58 56 62 55" stroke="#ffedd5" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Experiences</span>
                    </button>

                    {/* Delivery Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 opacity-50 cursor-not-allowed"
                    >
                        <div className="mb-4 grayscale">
                            {/* Mock Burger/Delivery SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="35" fill="#f1f5f9" />
                                <path d="M35 50C35 40 40 35 50 35C60 35 65 40 65 50H35Z" fill="#cbd5e1" />
                                <rect x="35" y="52" width="30" height="6" rx="3" fill="#94a3b8" />
                                <path d="M35 60V62C35 66 38 68 50 68C62 68 65 66 65 62V60H35Z" fill="#cbd5e1" />
                                {/* wavy lettuce mock */}
                                <path d="M35 50Q38 53 40 50Q43 53 45 50Q48 53 50 50Q53 53 55 50Q58 53 60 50Q63 53 65 50" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-400">Delivery</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
