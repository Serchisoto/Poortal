'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function CultureSearchPage() {
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
                        CULTURE
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">The heart of the place</span>
                    </div>

                    {/* Shows / Concerts Option */}
                    <button
                        onClick={() => router.push('/culture/shows')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-rose-600">
                            {/* Mock Singer/Show SVG */}
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" fill="#ef4444" />
                                <path d="M50 35C45 35 41 39 41 44V55C41 60 45 64 50 64C55 64 59 60 59 55V44C59 39 55 35 50 35Z" fill="#fed7aa" />
                                <path d="M41 44H59C59 39 55 35 50 35C45 35 41 39 41 44Z" fill="#1e293b" />
                                <rect x="30" y="70" width="40" height="30" rx="10" fill="#334155" />
                                <path d="M50 70L40 85H60L50 70Z" fill="#cbd5e1" />
                                {/* Microphone */}
                                <circle cx="65" cy="55" r="4" fill="#0f172a" />
                                <path d="M65 59V80" stroke="#0f172a" strokeWidth="3" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Shows / Concerts</span>
                    </button>

                    {/* Experiences Option */}
                    <button
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 active:scale-95 transition-transform"
                    >
                        <div className="mb-4 text-orange-500">
                            {/* Mock Experience/Tour SVG */}
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" fill="#f97316" />
                                <path d="M45 40C45 40 40 50 40 60H60C60 50 55 40 55 40L45 40Z" fill="#14b8a6" />
                                <circle cx="50" cy="35" r="10" fill="#fed7aa" />
                                {/* Map */}
                                <path d="M30 50L45 55L60 40V60H30V50Z" fill="#cbd5e1" opacity="0.8" />
                                <path d="M45 55V75" stroke="#94a3b8" strokeWidth="2" />
                            </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">Experiences</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
