import { notFound } from 'next/navigation'
import { getDestinationBySlug, getDestinationCategories } from '@/queries/destinations'
import { CategoryGrid } from '@/components/home/category-grid'
import { SetActiveDestination } from '@/components/destinations/set-active-destination'
import { SearchBar } from '@/components/search/search-bar'

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

  const categories = await getDestinationCategories(destination.id)
  const enabledSlugs = categories.length > 0 ? categories.map((c) => c.slug) : undefined

  return (
    <div className="bg-background pb-24">
      <SetActiveDestination slug={destination.slug} />

      {/* Hero — full bleed, clips only the image/gradient, not the search bar */}
      <div className="relative w-full">
        {/* Image container — clips overflow internally */}
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(220px, 58vw, 340px)' }}>
          {destination.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-primary/20" />
          )}
          {/* Gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

          {/* Text anchored to bottom of image */}
          <div className="absolute bottom-5 left-0 right-0 px-5">
            <p className="text-white/70 text-[10px] font-semibold tracking-[0.2em] uppercase mb-0.5">
              {destination.country}
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-sm">
              {destination.name}
            </h1>
          </div>
        </div>

        {/* Search bar — sibling, not child, so overflow-hidden cannot clip it */}
        <div className="px-4 -mt-6 relative z-10">
          <SearchBar placeholder="Buscar experiencias..." />
        </div>
      </div>

      {/* Spacer below search bar */}
      <div className="h-4" />

      {/* Categories */}
      <main className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <CategoryGrid enabledSlugs={enabledSlugs} />
      </main>
    </div>
  )
}
