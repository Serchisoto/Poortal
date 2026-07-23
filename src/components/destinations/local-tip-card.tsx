'use client'

import { Share2, FileText } from 'lucide-react'

interface LocalTipCardProps {
    title: string
    author: string
    date: string
    description: React.ReactNode[]
    images?: number // number of placeholder images
    onShare?: () => void
    onBlogClick?: () => void
}

export function LocalTipCard({
    title,
    author,
    date,
    description,
    images = 3,
    onShare,
    onBlogClick
}: LocalTipCardProps) {
    return (
        <div className="flex flex-col bg-white rounded-xl border shadow-sm p-4 w-full gap-3">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide mt-1">
                    {title}
                </h3>
                <div className="flex items-start gap-3 shrink-0">
                    <div className="text-[10px] text-right text-slate-800 font-medium leading-tight">
                        <div>Author: {author}</div>
                        <div className="text-slate-500">{date}</div>
                    </div>
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

                <button
                    onClick={onBlogClick}
                    className="shrink-0 flex items-center justify-center gap-1.5 bg-teal-700 text-white rounded-md px-3 py-1.5 active:scale-95 transition-transform"
                >
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-semibold">blog</span>
                </button>
            </div>
        </div>
    )
}
