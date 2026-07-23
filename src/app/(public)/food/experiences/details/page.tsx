'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FoodExperienceDetailsPage() {
    const router = useRouter()

    // State for counters
    const [adults, setAdults] = useState(2)
    const [kids, setKids] = useState(0)
    const [pets, setPets] = useState(0)

    const handleContinue = () => {
        // Route to the existing common booking UI. We reuse the restaurant one as a placeholder.
        router.push('/restaurants/1/checkout')
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
                        EXPERIENCES
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2 flex-grow">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 pb-10 flex flex-col items-center flex-grow mb-6">

                    {/* Bot Greeting */}
                    <div className="flex items-center gap-2 self-start w-full mb-10 pl-2">
                        <span className="text-teal-700 font-bold text-sm">Poortal:</span>
                        <span className="text-slate-700 text-sm">Let's look for your perfect fit.</span>
                    </div>

                    {/* PARTY SIZE */}
                    <div className="w-full flex flex-col items-center mb-8">
                        <div className="text-xs font-bold text-[#1b6d72] uppercase underline decoration-[#1b6d72] underline-offset-4 mb-6">
                            PARTY SIZE
                        </div>
                        <div className="flex w-full justify-between px-2">
                            {/* Adults */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <button onClick={() => setAdults(Math.max(0, adults - 1))} className="text-2xl font-medium px-1 active:scale-95">−</button>
                                    <div className="text-2xl relative">
                                        👨‍👩‍👧‍👦
                                    </div>
                                    <button onClick={() => setAdults(adults + 1)} className="text-2xl font-medium px-1 active:scale-95">+</button>
                                </div>
                                <span className="text-sm font-medium text-[#1b6d72]">{adults} adults</span>
                            </div>

                            {/* Kids */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <button onClick={() => setKids(Math.max(0, kids - 1))} className="text-2xl font-medium px-1 active:scale-95">−</button>
                                    <div className="text-2xl opacity-60">
                                        👶
                                    </div>
                                    <button onClick={() => setKids(kids + 1)} className="text-2xl font-medium px-1 active:scale-95">+</button>
                                </div>
                                <span className="text-sm font-medium text-[#1b6d72]">{kids} kids</span>
                            </div>

                            {/* Pets */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <button onClick={() => setPets(Math.max(0, pets - 1))} className="text-2xl font-medium px-1 active:scale-95">−</button>
                                    <div className="text-2xl">
                                        🐶
                                    </div>
                                    <button onClick={() => setPets(pets + 1)} className="text-2xl font-medium px-1 active:scale-95">+</button>
                                </div>
                                <span className="text-sm font-medium text-[#1b6d72]">{pets} pets</span>
                            </div>
                        </div>
                    </div>

                    {/* DAY - TIME */}
                    <div className="w-full flex flex-col items-center mb-8">
                        <div className="text-xs font-bold text-[#1b6d72] uppercase underline decoration-[#1b6d72] underline-offset-4 mb-4">
                            DAY - TIME
                        </div>

                        <div className="flex w-full justify-center gap-8 mb-4">
                            <div className="flex flex-col w-32">
                                <label className="text-xs text-slate-500 mb-1">From:</label>
                                <div className="border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-700 bg-white whitespace-nowrap text-center shadow-sm">
                                    1 June, 2022
                                </div>
                            </div>
                            <div className="flex flex-col w-32">
                                <label className="text-xs text-slate-500 mb-1 text-right">To:</label>
                                <div className="border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-700 bg-white whitespace-nowrap text-center shadow-sm">
                                    1 June, 2022
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-32 items-center">
                            <label className="text-xs text-slate-500 mb-1">TimeFrame:</label>
                            <div className="relative w-full">
                                <select className="w-full appearance-none border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm text-slate-700 bg-white shadow-sm outline-none focus:border-teal-500">
                                    <option>Morning</option>
                                    <option>Afternoon</option>
                                    <option>Evening</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* BUDGET */}
                    <div className="w-full flex flex-col items-center mb-10">
                        <div className="text-xs font-bold text-[#1b6d72] uppercase underline decoration-[#1b6d72] underline-offset-4 mb-4">
                            BUDGET (OPT)
                        </div>
                        <div className="relative w-28">
                            <select className="w-full appearance-none border border-slate-300 rounded-md py-2 pl-4 pr-8 text-sm text-slate-700 bg-white shadow-sm outline-none focus:border-teal-500">
                                <option>All</option>
                                <option>$</option>
                                <option>$$</option>
                                <option>$$$</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        className="mt-auto mb-4 bg-[#1b6d72] hover:bg-teal-800 text-white rounded-md px-8 py-2.5 flex items-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                        <span className="text-sm font-semibold">continue</span>
                        <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={3} />
                    </button>

                </div>
            </main>
        </div>
    )
}
