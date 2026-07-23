'use client'

import { Clock, Share2, Map as MapIcon, Phone, Globe } from 'lucide-react'

interface InfoCardProps {
    title: string
    description: React.ReactNode[]
    visual?: React.ReactNode
    actions?: {
        time?: boolean
        share?: boolean
        map?: boolean
        phone?: boolean
        web?: boolean
    }
    onActionClick?: (action: 'time' | 'share' | 'map' | 'phone' | 'web') => void
}

export function InfoCard({
    title,
    description,
    visual,
    actions = { time: true, share: true, map: true, phone: false, web: false },
    onActionClick,
}: InfoCardProps) {
    return (
        <div className="flex bg-white rounded-xl border shadow-sm p-4 w-full">
            {/* Left visual (Image/Icon placeholder) */}
            <div className="shrink-0 mr-4">
                {visual ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex items-center justify-center">
                        {visual}
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-md bg-slate-50 flex items-center justify-center"></div>
                )}
            </div>

            {/* Center content */}
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide mb-1 truncate">
                    {title}
                </h3>
                <div className="flex flex-col gap-0.5 mt-1">
                    {description.map((line, idx) => (
                        <div key={idx} className="text-[10px] text-muted-foreground leading-tight font-medium">
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right actions */}
            <div className="shrink-0 flex flex-col items-center justify-between gap-3 border-l pl-3 ml-2">
                {actions.time && (
                    <button
                        onClick={() => onActionClick?.('time')}
                        className="text-slate-900 active:scale-95 transition-transform"
                    >
                        <Clock className="h-4 w-4 fill-slate-900 text-white" />
                    </button>
                )}
                {actions.share && (
                    <button
                        onClick={() => onActionClick?.('share')}
                        className="text-slate-900 active:scale-95 transition-transform"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>
                )}
                {actions.map && (
                    <button
                        onClick={() => onActionClick?.('map')}
                        className="text-teal-600 active:scale-95 transition-transform"
                    >
                        <MapIcon className="h-5 w-5" />
                    </button>
                )}
                {actions.phone && (
                    <button
                        onClick={() => onActionClick?.('phone')}
                        className="text-teal-600 active:scale-95 transition-transform"
                    >
                        <Phone className="h-5 w-5 fill-teal-600" />
                    </button>
                )}
                {actions.web && (
                    <button
                        onClick={() => onActionClick?.('web')}
                        className="text-teal-600 active:scale-95 transition-transform"
                    >
                        <Globe className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    )
}
