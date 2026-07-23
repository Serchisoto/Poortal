'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function WellnessSearchPage() {
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
                        WELLNESS
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

                    {/* Spa Services Option */}
                    <button
                        onClick={() => router.push('/wellness/spa')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Spa/Leaf SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 20C50 20 20 40 20 60C20 75 35 80 50 80C65 80 80 75 80 60C80 40 50 20 50 20Z" fill="#10b981" />
                                <path d="M50 80V40" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                <path d="M50 60C35 60 25 50 25 50" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                <path d="M50 60C65 60 75 50 75 50" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Spa Services</span>
                    </button>

                    {/* Experiences Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Water Drop/Ripples SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#bae6fd" strokeWidth="6" />
                                <ellipse cx="50" cy="65" rx="20" ry="8" fill="none" stroke="#bae6fd" strokeWidth="6" />
                                <path d="M50 25C50 25 40 40 40 50C40 55.5 44.5 60 50 60C55.5 60 60 55.5 60 50C60 40 50 25 50 25Z" fill="#bae6fd" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Experiences</span>
                    </button>

                    {/* Health Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4">
                            {/* Mock Health/Clipboard SVG */}
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="30" y="30" width="40" height="50" rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
                                <rect x="40" y="25" width="20" height="10" rx="2" fill="#38bdf8" stroke="#475569" strokeWidth="3" />
                                <line x1="45" y1="25" x2="55" y2="25" stroke="#475569" strokeWidth="3" />
                                {/* Medical Cross */}
                                <rect x="45" y="45" width="10" height="10" fill="#ef4444" />
                                <rect x="40" y="50" width="20" height="0" stroke="#ef4444" strokeWidth="4" />
                                <rect x="50" y="40" width="0" height="20" stroke="#ef4444" strokeWidth="4" />
                                {/* Lines */}
                                <rect x="40" y="65" width="20" height="3" fill="#94a3b8" />
                                <rect x="40" y="72" width="15" height="3" fill="#94a3b8" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Health</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
