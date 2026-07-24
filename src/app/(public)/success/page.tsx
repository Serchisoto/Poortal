'use client'

import { useRouter } from 'next/navigation'
import { ArrowDown } from 'lucide-react'

export default function SuccessPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background pb-32 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                {/* Logo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/poortal-logo.png" alt="Poortal" className="h-8 w-auto object-contain" />

                {/* Right Icons: Avatar placeholder */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden relative" />
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-6 mt-[-10vh]">

                <h2 className="text-[32px] font-semibold text-foreground mb-12">
                    All in place!
                </h2>

                <div className="text-center flex flex-col gap-6">
                    <div className="text-[15px] font-semibold text-foreground leading-tight">
                        Please go to your <span className="text-primary">wallet</span>,<br />
                        QR ticket should appear <span className="text-primary">now</span>.
                    </div>

                    <div className="text-[15px] font-semibold text-foreground">
                        we have sent an <span className="text-primary">email</span> too.
                    </div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-20 bg-primary text-primary-foreground rounded-[2rem] px-14 py-3.5 text-base font-semibold active:scale-95 transition-transform shadow-md"
                >
                    close
                </button>

            </main>

            {/* Floating Arrow pointing to wallet */}
            <div className="absolute bottom-28 right-12 animate-bounce">
                <ArrowDown className="text-primary h-8 w-8" strokeWidth={3} />
            </div>
        </div>
    )
}
