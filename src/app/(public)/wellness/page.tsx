'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Flower2, HeartPulse, Sparkles } from 'lucide-react'

export default function WellnessSearchPage() {
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
                        onClick={() => navigate('/wellness/spa')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <Flower2 className="h-12 w-12 mb-3 text-pink-400" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Spa Services</span>
                    </button>

                    {/* Experiences Option */}
                    <button
                        onClick={() => navigate('/wellness/experiences')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 mb-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <Sparkles className="h-12 w-12 mb-3 text-sky-400" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Experiences</span>
                    </button>

                    {/* Health Option */}
                    <button
                        onClick={() => navigate('/wellness/health')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center py-6 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <HeartPulse className="h-12 w-12 mb-3 text-rose-500" strokeWidth={1.25} />
                        <span className="text-lg font-medium text-slate-800">Health</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
