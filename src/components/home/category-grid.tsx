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

type Category = {
    name: string
    label: string
    slug: string
    icon: LucideIcon
    span: string
}

const categories: Category[] = [
    // Row 1 (3 items)
    { name: 'tours',    label: 'Tours',    slug: 'tours',    icon: Bus,            span: 'col-span-2' },
    { name: 'ride',     label: 'Ride',     slug: 'ride',     icon: Car,            span: 'col-span-2' },
    { name: 'food',     label: 'Food',     slug: 'food',     icon: UtensilsCrossed,span: 'col-span-2' },
    // Row 2 (2 items)
    { name: 'party',    label: 'Party',    slug: 'party',    icon: PartyPopper,    span: 'col-span-3' },
    { name: 'sea',      label: 'Sea',      slug: 'sea',      icon: Waves,          span: 'col-span-3' },
    // Row 3 (3 items)
    { name: 'culture',  label: 'Culture',  slug: 'culture',  icon: Landmark,       span: 'col-span-2' },
    { name: 'sports',   label: 'Sports',   slug: 'sports',   icon: Volleyball,     span: 'col-span-2' },
    { name: 'stay',     label: 'Stay',     slug: 'stay',     icon: Hotel,          span: 'col-span-2' },
    // Row 4 (2 items)
    { name: 'shopping', label: 'Shopping', slug: 'shopping', icon: ShoppingBag,    span: 'col-span-3' },
    { name: 'wellness', label: 'Wellness', slug: 'wellness', icon: Sparkles,       span: 'col-span-3' },
]

export function CategoryGrid() {
    return (
        <div className="grid grid-cols-6 gap-2.5 px-4 py-4">
            {categories.map((category) => {
                let href = `${ROUTES.explore}?category=${category.slug}`
                if (category.slug === 'tours')    href = ROUTES.tours
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
                            flex items-center justify-center gap-2
                            bg-white rounded-2xl border border-border shadow-sm
                            py-3.5 px-3 transition-all duration-150
                            hover:border-primary/40 hover:shadow-md hover:bg-primary/5
                            active:scale-95
                        `}
                    >
                        <Icon className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
                        <span className="text-xs font-semibold text-foreground/75 capitalize tracking-wide">
                            {category.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
