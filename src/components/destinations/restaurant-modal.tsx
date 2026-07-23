'use client'

import { Share2, Ticket, X } from 'lucide-react'
import Link from 'next/link'

interface RestaurantModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description: React.ReactNode[]
    moreInfoLink?: string
    onBookClick?: () => void
    onShareClick?: () => void
}

export function RestaurantModal({
    isOpen,
    onClose,
    title,
    description,
    moreInfoLink = '#',
    onBookClick,
    onShareClick
}: RestaurantModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[999] flex flex-col bg-[#303030]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-12 pb-4">
                <div className="flex-1"></div>
                <div className="flex flex-col items-center">
                    <h2 className="text-white text-xl font-bold tracking-wider">{title}</h2>
                    <p className="text-slate-300 text-xs mt-0.5">Italian cousine made for the international guest</p>
                </div>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={onShareClick}
                        className="text-white active:scale-95 transition-transform"
                    >
                        <Share2 className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Main Content Area (Image Placeholder) */}
            <div className="relative flex-1 mx-6 mb-6 mt-2 rounded-xl overflow-hidden bg-slate-200">
                {/* Gradient overlay at the bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end gap-4">
                    <div className="flex-1">
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                            {description.map((line, idx) => (
                                <div key={idx} className="text-xs text-white leading-tight">
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                        <Link
                            href={moreInfoLink}
                            className="text-xs text-white underline decoration-white underline-offset-2 hover:text-slate-200"
                        >
                            more info
                        </Link>
                        <button
                            onClick={onBookClick}
                            className="flex items-center justify-center gap-1.5 bg-[#25C68A] text-white rounded-md px-5 py-2 active:scale-95 transition-transform"
                        >
                            <Ticket className="h-4 w-4" />
                            <span className="text-sm font-bold">book</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Close Button Footer */}
            <div className="flex justify-center pb-12 pt-4">
                <button
                    onClick={onClose}
                    className="flex items-center justify-center bg-[#E56A3E] text-slate-900 rounded-full p-3 shadow-lg active:scale-95 transition-transform"
                >
                    <X className="h-8 w-8" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}
