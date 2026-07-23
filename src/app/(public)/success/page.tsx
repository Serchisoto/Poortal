'use client'

import { useRouter } from 'next/navigation'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

export default function SuccessPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white pb-32 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                {/* Brand Name (using POORTAL since rebranding from MR. SUGAR) */}
                <div className="flex items-center gap-1">
                    <h1 className="text-xl font-light text-teal-600 tracking-wide uppercase">POOR<span className="font-bold text-slate-800">TAL</span></h1>
                </div>

                {/* Right Icons: Avatar and Box */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#8c5230] mix-blend-multiply opacity-40"></div>
                        {/* Placeholder for Avatar */}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                        {/* Box Icon Mock */}
                        <div className="w-4 h-4 bg-slate-300"></div>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-6 mt-[-10vh]">

                <h2 className="text-[32px] font-semibold text-[#2b2b2b] mb-12">
                    All in place!
                </h2>

                <div className="text-center flex flex-col gap-6">
                    <div className="text-[15px] font-semibold text-[#2b2b2b] leading-tight">
                        Please go to your <span className="text-[#E56A3E]">wallet</span>,<br />
                        QR ticket should appear <span className="text-teal-700">now</span>.
                    </div>

                    <div className="text-[15px] font-semibold text-[#2b2b2b]">
                        we have send an <span className="text-teal-700">email</span> too.
                    </div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-20 bg-[#2b666a] text-white rounded-[2rem] px-14 py-3.5 text-base font-semibold active:scale-95 transition-transform shadow-md"
                >
                    close
                </button>

            </main>

            {/* Floating Arrow pointing to wallet */}
            <div className="absolute bottom-28 right-12 animate-bounce">
                <ArrowDown className="text-[#E56A3E] h-8 w-8" strokeWidth={3} />
            </div>
        </div>
    )
}
