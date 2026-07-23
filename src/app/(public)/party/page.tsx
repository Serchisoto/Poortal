'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'

export default function PartySearchPage() {
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
                        PARTY
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Tickets Available!</span>
                    </div>

                    {/* Nightlife Option */}
                    <button
                        onClick={() => router.push('/nightlife')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <span className="text-[10px] text-slate-600 font-medium mb-3">6 pm to sunrise</span>

                        {/* Custom Glasses SVG matching mockup */}
                        <div className="mb-4 text-[#38a3d1]">
                            <svg width="60" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2.172a2 2 0 0 0-.586-1.414l-3.24-3.24a2 2 0 0 0-1.414-.586H6.828a2 2 0 0 0-1.414.586l-2.828 2.828Z" />
                                <path d="M20 12v2a2 2 0 0 1-2 2h-1.83" />
                                <path d="M4 12v2a2 2 0 0 0 2 2h1.83" />
                                <path d="m14 7-2 5-2-5" />
                                <path d="M4 12h16" />
                                <path d="M4 15h16" />
                                <path d="M4 18h16" />
                            </svg>
                        </div>

                        <span className="text-lg font-medium text-slate-800">Nightlife</span>
                    </button>

                    {/* During Day Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <span className="text-[10px] text-slate-600 font-medium mb-3">8 am - 6 pm</span>

                        {/* Custom Sun/Sea SVG matching mockup */}
                        <div className="mb-4 relative w-[60px] h-[40px] flex items-center justify-center">
                            <svg width="60" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v2" />
                                <path d="m4.93 4.93 1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="m4.93 19.07 1.41-1.41" />
                                <path d="M12 20v2" />
                                <path d="m19.07 19.07-1.41-1.41" />
                                <path d="M20 12h2" />
                                <path d="m19.07 4.93-1.41 1.41" />
                                <path d="M2 15h20" />
                                <path d="M4 18h16" />
                                <path d="M7 21h10" />
                                <circle cx="12" cy="12" r="4" fill="#facc15" stroke="none" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>

                        <span className="text-lg font-medium text-slate-800">During day</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
