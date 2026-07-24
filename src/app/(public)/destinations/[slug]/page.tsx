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

      {/* Hero — full bleed, tall, dramatic */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '58%', minHeight: 220, maxHeight: 360 }}>
        <div className="absolute inset-0">
          {destination.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/20" />
          )}
          {/* Gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />
        </div>

        {/* Text — inside hero, above search */}
        <div className="absolute bottom-16 left-0 right-0 px-5">
          <p className="text-white/70 text-[10px] font-semibold tracking-[0.2em] uppercase mb-0.5">
            {destination.country}
          </p>
          <h1 className="text-[1.75rem] font-bold text-white leading-tight text-balance drop-shadow-sm">
            {destination.name}
          </h1>
          {destination.description && (
            <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-snug">
              {destination.description}
            </p>
          )}
        </div>

        {/* Search bar — anchored to hero bottom, half-overlapping */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 pr-5 z-10">
          <SearchBar
            placeholder="Buscar experiencias..."
          />
        </div>
      </div>

      {/* Spacer so content clears the overlapping search bar */}
      <div className="h-8" />

      {/* Categories */}
      <main className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <CategoryGrid enabledSlugs={enabledSlugs} />
      </main>
    </div>
  )
}
