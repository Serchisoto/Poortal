import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

const categories = [
    // Row 1 (3 items)
    { name: 'tours', icon: '🚐', slug: 'tours', span: 'col-span-2' },
    { name: 'ride', icon: '🚕', slug: 'ride', span: 'col-span-2' },
    { name: 'food', icon: '🌮', slug: 'food', span: 'col-span-2' },
    // Row 2 (2 items)
    { name: 'party', icon: '🎉', slug: 'party', span: 'col-span-3' },
    { name: 'sea', icon: '🌊', slug: 'sea', span: 'col-span-3' },
    // Row 3 (3 items)
    { name: 'culture', icon: '🏛️', slug: 'culture', span: 'col-span-2' },
    { name: 'sports', icon: '🏄', slug: 'sports', span: 'col-span-2' },
    { name: 'stay', icon: '🏨', slug: 'stay', span: 'col-span-2' },
    // Row 4 (2 items)
    { name: 'shopping', icon: '🛍️', slug: 'shopping', span: 'col-span-3' },
    { name: 'wellness', icon: '🧖', slug: 'wellness', span: 'col-span-3' },
]

export function CategoryGrid() {
    return (
        <div className="grid grid-cols-6 gap-3 px-4 py-4">
            {categories.map((category) => {
                let href = `${ROUTES.explore}?category=${category.slug}`
                if (category.slug === 'tours') href = ROUTES.tours
                if (category.slug === 'party') href = ROUTES.party
                if (category.slug === 'sea') href = ROUTES.sea
                if (category.slug === 'culture') href = ROUTES.culture
                if (category.slug === 'sports') href = ROUTES.sports
                if (category.slug === 'stay') href = ROUTES.stay
                if (category.slug === 'shopping') href = ROUTES.shopping
                if (category.slug === 'wellness') href = ROUTES.wellness
                if (category.slug === 'food') href = ROUTES.food

                return (
                    <Link
                        key={category.slug}
                        href={href}
                        className={`
                        ${category.span}
                        flex items-center justify-center gap-2 
                        bg-white rounded-full border border-slate-100 shadow-sm
                        py-3 px-2 transition-all hover:scale-105 hover:shadow-md
                        active:scale-95
                    `}
                    >
                        <span className="text-xl leading-none">{category.icon}</span>
                        <span className="text-xs font-bold text-foreground/80 capitalize">
                            {category.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
