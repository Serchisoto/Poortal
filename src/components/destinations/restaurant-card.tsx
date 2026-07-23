'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Share2, Clock, Ticket } from 'lucide-react'
import Link from 'next/link'
import { RestaurantModal } from './restaurant-modal'

interface RestaurantCardProps {
    title: string
    description: React.ReactNode[]
    images?: number // number of placeholder images
    moreInfoLink?: string
    onShare?: () => void
    onTimeClick?: () => void
    onBookClick?: () => void
}

export function RestaurantCard({
    title,
    description,
    images = 3,
    moreInfoLink = '#',
    onShare,
    onTimeClick,
    onBookClick
}: RestaurantCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't open modal if clicking a button or link
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
            return
        }
        setIsModalOpen(true)
    }

    const handleBookRoute = (e?: React.MouseEvent) => {
        e?.stopPropagation() // Prevent opening modal
        // TODO: Map to actual restaurant ID
        router.push('/restaurants/1')
        setIsModalOpen(false)
    }

    return (
        <>
            <div
                className="flex flex-col bg-white rounded-xl border shadow-sm p-4 w-full gap-3 cursor-pointer"
                onClick={handleCardClick}
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide mt-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={onTimeClick}
                            className="bg-slate-50 border border-slate-100 p-1.5 rounded-md text-slate-900 active:scale-95 transition-transform"
                        >
                            <Clock className="h-4 w-4 fill-slate-900 text-white" />
                        </button>
                        <button
                            onClick={onShare}
                            className="text-teal-700 active:scale-95 transition-transform"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Images Grid */}
                {images > 0 && (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {Array.from({ length: images }).map((_, idx) => (
                            <div key={idx} className="aspect-square bg-slate-50 rounded-md"></div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-end gap-4 mt-1">
                    <div className="flex-1">
                        <div className="flex flex-col gap-0.5">
                            {description.map((line, idx) => (
                                <div key={idx} className="text-[10px] text-slate-600 leading-tight">
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <Link
                            href={moreInfoLink}
                            className="text-[10px] text-teal-700 underline decoration-teal-700 underline-offset-2 hover:text-teal-800"
                        >
                            more info
                        </Link>
                        <button
                            onClick={onBookClick || handleBookRoute}
                            className="flex items-center justify-center gap-1.5 bg-teal-700 text-white rounded-md px-4 py-1.5 active:scale-95 transition-transform"
                        >
                            <Ticket className="h-4 w-4" />
                            <span className="text-xs font-semibold">book</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Attached Modal Overlay */}
            <RestaurantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                description={description}
                moreInfoLink={moreInfoLink}
                onBookClick={handleBookRoute}
                onShareClick={onShare}
            />
        </>
    )
}
