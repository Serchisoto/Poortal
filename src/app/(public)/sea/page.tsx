'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function SeaSearchPage() {
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
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        SEA
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Dive in!</span>
                    </div>

                    {/* Rent Boat/Yatch Option */}
                    <button
                        onClick={() => router.push('/rental')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-slate-400">
                            {/* Mock Compass SVG */}
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                                <line x1="12" y1="2" x2="12" y2="4" />
                                <line x1="12" y1="20" x2="12" y2="22" />
                                <line x1="2" y1="12" x2="4" y2="12" />
                                <line x1="20" y1="12" x2="22" y2="12" />
                                <text x="12" y="7" fontSize="3" textAnchor="middle" fill="currentColor" stroke="none">N</text>
                                <text x="12" y="19" fontSize="3" textAnchor="middle" fill="currentColor" stroke="none">S</text>
                                <text x="17" y="13" fontSize="3" fill="currentColor" stroke="none">E</text>
                                <text x="6" y="13" fontSize="3" fill="currentColor" stroke="none">W</text>
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Rent Boat/Yatch</span>
                    </button>

                    {/* Expeditions Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-amber-700">
                            {/* Mock Ship SVG */}
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" fill="#a16207" />
                                <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0v2H2z" fill="#0ea5e9" stroke="none" />
                                <path d="M12 18V4" strokeWidth="2" />
                                <path d="M12 4l-6 4 6 4" fill="#fca5a5" stroke="none" />
                                <path d="M12 12l-4 3 4 3" stroke="#fca5a5" />
                                <path d="M17 18V8" />
                                <path d="M17 8l-3 2 3 2" fill="#fca5a5" stroke="none" />
                                <path d="M7 18v-4" />
                                <path d="M7 14l-2 1.5 2 1.5" stroke="#fca5a5" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Expeditions</span>
                    </button>

                    {/* Go Fishing Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-slate-700">
                            {/* Mock Fishing SVG */}
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="15" cy="8" r="4" fill="#fcd34d" />
                                <path d="M15 12v10" strokeWidth="6" stroke="#fbbf24" />
                                <path d="M11 15h8" />
                                <path d="M8 8s-2 2-2 5 2 5 2 5" />
                                <path d="M8 13l-4 2-2-4 2-4 4 2z" fill="#94a3b8" stroke="none" />
                                <circle cx="5" cy="11" r="0.5" fill="#fff" stroke="none" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Go Fishing</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
