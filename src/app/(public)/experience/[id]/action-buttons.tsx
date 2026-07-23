'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, Share2 } from 'lucide-react'

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

export function ShareButton({ title, description }: { title: string; description?: string | null }) {
  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: description ?? '', url: window.location.href })
      } catch {
        // user cancelled or not supported
      }
    }
  }
  return (
    <button onClick={handleShare} className="text-teal-600 active:scale-95 transition-transform">
      <Share2 className="h-4 w-4" />
    </button>
  )
}
