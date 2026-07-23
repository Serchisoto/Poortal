'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const SHOPPING_CATEGORIES = [
    { id: 'luxury', label: 'Luxury', selected: true },
    { id: 'mexican', label: 'Mexican Items', selected: true },
    { id: 'beverages', label: 'Beverages', selected: false },
    { id: 'fashion', label: 'Fashion', selected: true },
    { id: 'beach', label: 'Beach Items', selected: true },
    { id: 'supermarket', label: 'Supermarket', selected: false },
]

export default function GoShoppingPage() {
    const router = useRouter()
    const [categories, setCategories] = useState(SHOPPING_CATEGORIES)
    const [personalShopper, setPersonalShopper] = useState(false)

    const toggleCategory = (id: string) => {
        setCategories(categories.map(c =>
            c.id === id ? { ...c, selected: !c.selected } : c
        ))
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

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2 flex-grow">

                {/* Main Content Container */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 pb-10 flex flex-col items-center flex-grow mb-6">

                    {/* Grid of Options */}
                    <div className="w-full grid grid-cols-2 gap-4 mb-10 mt-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className="aspect-square bg-white rounded-xl border border-slate-200 shadow-sm relative flex items-center justify-center p-4 active:scale-95 transition-transform"
                            >
                                {cat.selected && (
                                    <div className="absolute top-2 right-2 text-[#1b6d72]">
                                        <CheckCircle2 className="h-6 w-6 fill-[#1b6d72] text-white" />
                                    </div>
                                )}
                                <span className={`text-sm font-medium text-center ${cat.selected ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {cat.label.split(' ').map((word, i) => (
                                        <span key={i} className="block">{word}</span>
                                    ))}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Personal Shopper Checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer mb-12">
                        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${personalShopper ? 'bg-[#1b6d72] border-[#1b6d72]' : 'border-slate-300 bg-white'}`}>
                            {personalShopper && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={personalShopper}
                            onChange={(e) => setPersonalShopper(e.target.checked)}
                        />
                        <span className="text-sm font-medium text-slate-700">personal shopper</span>
                    </label>

                    {/* Continue Button */}
                    <button
                        onClick={() => router.push('/shopping/go/details')}
                        className="mt-auto bg-[#1b6d72] hover:bg-teal-800 text-white rounded-md px-8 py-2.5 flex items-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                        <span className="text-sm font-semibold">continue</span>
                        <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={3} />
                    </button>

                </div>
            </main>
        </div>
    )
}
