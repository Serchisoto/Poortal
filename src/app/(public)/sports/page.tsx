'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function SportsSearchPage() {
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
                        SPORTS
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Stand Up!</span>
                    </div>

                    {/* Golf Option */}
                    <button
                        onClick={() => router.push('/sports/golf')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-blue-400">
                            {/* Mock Golf Cart SVG */}
                            <svg width="80" height="60" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="30" y="30" width="40" height="20" rx="4" fill="#60a5fa" />
                                <path d="M40 30L35 15H65L60 30H40Z" fill="#3b82f6" />
                                <rect x="35" y="10" width="30" height="5" fill="#1e3a8a" />
                                <circle cx="35" cy="50" r="8" fill="#1e293b" />
                                <circle cx="65" cy="50" r="8" fill="#1e293b" />
                                {/* Golf Bag */}
                                <rect x="20" y="20" width="10" height="30" rx="2" fill="#d1d5db" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Golf green</span>
                    </button>

                    {/* Football Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-slate-800">
                            {/* Mock Soccer Ball SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" fill="#cbd5e1" stroke="#334155" strokeWidth="4" />
                                <path d="M50 25L35 40V60L50 75L65 60V40L50 25Z" fill="#334155" />
                                <path d="M35 40L15 30M35 60L15 70M65 40L85 30M65 60L85 70M50 25V5M50 75V95" stroke="#334155" strokeWidth="4" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Football Field</span>
                    </button>

                    {/* Water Sports Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-yellow-400">
                            {/* Mock Submarine/Water Scooter SVG */}
                            <svg width="80" height="60" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="50" cy="40" rx="30" ry="15" fill="#facc15" />
                                <circle cx="50" cy="40" r="8" fill="#38bdf8" />
                                <rect x="25" y="30" width="10" height="20" rx="5" fill="#ca8a04" />
                                <rect x="65" y="30" width="10" height="20" rx="5" fill="#ca8a04" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Water Sports</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
