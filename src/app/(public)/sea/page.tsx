'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Anchor, Binoculars, ChevronLeft, Fish } from 'lucide-react'

export default function SeaSearchPage() {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    function navigate(href: string) {
        startTransition(() => { router.push(href) })
    }

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
                        onClick={() => navigate('/rental')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <Anchor className="h-12 w-12 mb-3 text-sky-500" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Rent Boat/Yacht</span>
                    </button>

                    {/* Expeditions Option */}
                    <button
                        onClick={() => navigate('/sea/expeditions')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <Binoculars className="h-12 w-12 mb-3 text-teal-600" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Expeditions</span>
                    </button>

                    {/* Go Fishing Option */}
                    <button
                        onClick={() => navigate('/sea/fishing')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <Fish className="h-12 w-12 mb-3 text-blue-500" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Go Fishing</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
