'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function StaySearchPage() {
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
                        STAY
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

                    {/* Hotel Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Hotel SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="20" y="30" width="60" height="60" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
                                <rect x="30" y="15" width="40" height="15" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
                                {/* Stars */}
                                <circle cx="38" cy="22" r="3" fill="#ef4444" />
                                <circle cx="50" cy="22" r="3" fill="#ef4444" />
                                <circle cx="62" cy="22" r="3" fill="#ef4444" />
                                {/* Windows */}
                                <rect x="28" y="40" width="10" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
                                <rect x="45" y="40" width="10" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
                                <rect x="62" y="40" width="10" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
                                <rect x="28" y="58" width="10" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
                                <rect x="62" y="58" width="10" height="10" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
                                {/* Door */}
                                <rect x="42" y="70" width="16" height="20" fill="#fcd34d" stroke="#334155" strokeWidth="3" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Hotel</span>
                    </button>

                    {/* Hostal Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Hostal SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="25" y="40" width="50" height="50" fill="#bae6fd" stroke="#334155" strokeWidth="3" />
                                <path d="M20 40L50 20L80 40H20Z" fill="#7dd3fc" stroke="#334155" strokeWidth="3" />
                                <rect x="35" y="50" width="8" height="8" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                                <rect x="57" y="50" width="8" height="8" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                                <rect x="35" y="65" width="8" height="8" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                                <rect x="57" y="65" width="8" height="8" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                                <rect x="45" y="70" width="10" height="20" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
                                <circle cx="50" cy="30" r="5" fill="#bef264" stroke="#334155" strokeWidth="2" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Hostal</span>
                    </button>

                    {/* House / Department Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Lamp/House SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M35 30L30 60H70L65 30H35Z" fill="#7dd3fc" stroke="#334155" strokeWidth="3" />
                                <rect x="48" y="15" width="4" height="15" fill="#334155" />
                                <rect x="48" y="60" width="4" height="25" fill="#334155" />
                                <rect x="40" y="85" width="20" height="4" fill="#334155" />
                                {/* Cord/pull */}
                                <path d="M55 60V70" stroke="#334155" strokeWidth="3" />
                                <circle cx="55" cy="72" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">House / Department</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
