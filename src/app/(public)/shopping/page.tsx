'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ShoppingBag, Store } from 'lucide-react'

export default function ShoppingSearchPage() {
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
                        SHOPPING
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">{"Let's go to the mall!"}</span>
                    </div>

                    {/* Go Shopping Option */}
                    <button
                        onClick={() => navigate('/shopping/go')}
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-8 mb-4 transition-all active:scale-95 disabled:opacity-50"
                        disabled={pending}
                    >
                        <ShoppingBag className="h-12 w-12 mb-3 text-blue-500" strokeWidth={1.25} />
                        <span className="text-xl font-medium text-slate-800">Go Shopping</span>
                    </button>

                    {/* Delivery Option (Grayed Out) */}
                    <button
                        disabled
                        className="w-[85%] bg-white rounded-xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center py-8 opacity-50 cursor-not-allowed"
                    >
                        <Store className="h-12 w-12 mb-3 text-slate-400" strokeWidth={1.25} />
                        <span className="text-xl font-medium text-slate-400">Delivery</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">Coming soon</span>
                    </button>

                </div>

            </main>
        </div>
    )
}
