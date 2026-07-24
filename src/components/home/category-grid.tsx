import Link from 'next/link'
import {
    Bus,
    Car,
    UtensilsCrossed,
    PartyPopper,
    Waves,
    Landmark,
    Volleyball,
    Hotel,
    ShoppingBag,
    Sparkles,
    type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'

type CategoryDef = {
    name: string
    label: string
    slug: string
    icon: LucideIcon
    /** col-span for the 6-col grid */
    span: string
}

const ALL_CATEGORIES: CategoryDef[] = [
    // Row 1 — 3 equal
    { name: 'tours',    label: 'Tours',    slug: 'tours',    icon: Bus,            span: 'col-span-2' },
    { name: 'ride',     label: 'Ride',     slug: 'ride',     icon: Car,            span: 'col-span-2' },
    { name: 'food',     label: 'Food',     slug: 'food',     icon: UtensilsCrossed,span: 'col-span-2' },
    // Row 2 — 2 wide
    { name: 'party',    label: 'Party',    slug: 'party',    icon: PartyPopper,    span: 'col-span-3' },
    { name: 'sea',      label: 'Sea',      slug: 'sea',      icon: Waves,          span: 'col-span-3' },
    // Row 3 — 3 equal
    { name: 'culture',  label: 'Culture',  slug: 'culture',  icon: Landmark,       span: 'col-span-2' },
    { name: 'sports',   label: 'Sports',   slug: 'sports',   icon: Volleyball,     span: 'col-span-2' },
    { name: 'stay',     label: 'Stay',     slug: 'stay',     icon: Hotel,          span: 'col-span-2' },
    // Row 4 — 2 wide
    { name: 'shopping', label: 'Shopping', slug: 'shopping', icon: ShoppingBag,    span: 'col-span-3' },
    { name: 'wellness', label: 'Wellness', slug: 'wellness', icon: Sparkles,       span: 'col-span-3' },
]

interface CategoryGridProps {
    enabledSlugs?: string[]
}

export function CategoryGrid({ enabledSlugs }: CategoryGridProps) {
    const categories = enabledSlugs
        ? ALL_CATEGORIES.filter((c) => enabledSlugs.includes(c.slug))
        : ALL_CATEGORIES

    return (
        <div className="px-4 py-2">
            {/* Section label */}
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/60 mb-3 px-0.5">
                Explorar
            </p>
            <div className="grid grid-cols-6 gap-2">
                {categories.map((category) => {
                    let href = `${ROUTES.explore}?category=${category.slug}`
                    if (category.slug === 'tours')    href = ROUTES.tours
                    if (category.slug === 'ride')     href = '/ride'
                    if (category.slug === 'party')    href = ROUTES.party
                    if (category.slug === 'sea')      href = ROUTES.sea
                    if (category.slug === 'culture')  href = ROUTES.culture
                    if (category.slug === 'sports')   href = ROUTES.sports
                    if (category.slug === 'stay')     href = ROUTES.stay
                    if (category.slug === 'shopping') href = ROUTES.shopping
                    if (category.slug === 'wellness') href = ROUTES.wellness
                    if (category.slug === 'food')     href = ROUTES.food

                    const Icon = category.icon

                    return (
                        <Link
                            key={category.slug}
                            href={href}
                            className={`
                                ${category.span}
                                group flex items-center justify-center gap-2.5
                                bg-card rounded-2xl
                                border border-border/60
                                py-4 px-3
                                transition-all duration-150
                                hover:border-primary/40 hover:bg-primary/5
                                active:scale-[0.97] active:bg-primary/8
                            `}
                        >
                            {/* Icon bubble */}
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                            </span>
                            <span className="text-[0.78rem] font-semibold text-foreground/75 capitalize leading-none tracking-wide">
                                {category.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
