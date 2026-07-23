'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
        >
            <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
    )
}
