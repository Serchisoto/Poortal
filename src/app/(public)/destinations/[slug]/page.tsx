import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { CategoryGrid } from '@/components/home/category-grid'
import { SetActiveDestination } from '@/components/destinations/set-active-destination'
import { Search } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  return {
    title: destination?.name || 'Destino',
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)

  if (!destination) notFound()

  return (
    <div className="bg-background pb-20">
      <SetActiveDestination slug={destination.slug} />

      {/* Hero */}
      <div className="relative w-full h-44 md:h-64 bg-primary overflow-hidden">
        {destination.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.cover_image_url}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-sm">
            Welcome to {destination.name}
          </h1>
          {destination.city && destination.country && (
            <p className="text-white/80 text-sm mt-0.5">
              {destination.city}, {destination.country}
            </p>
          )}
        </div>
      </div>

      <main className="container mx-auto max-w-md md:max-w-2xl">
        {/* Search */}
        <div className="px-4 -mt-5 mb-6 relative z-10">
          <Link href={ROUTES.explore} className="block">
            <div className="w-full bg-white rounded-2xl border border-border shadow-md py-3.5 pl-12 pr-4 flex items-center text-muted-foreground/60">
              <span className="text-sm font-semibold tracking-widest uppercase">Ask anything</span>
            </div>
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50" />
          </Link>
        </div>

        {/* Categories */}
        <CategoryGrid />
      </main>
    </div>
  )
}
