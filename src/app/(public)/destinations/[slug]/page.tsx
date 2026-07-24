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
      <div className="relative w-full h-[58vw] min-h-[220px] max-h-[340px] bg-foreground/10 overflow-hidden">
        {destination.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={destination.cover_image_url}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Placeholder pattern when no cover is set */
          <div className="absolute inset-0 bg-primary/20" />
        )}
        {/* Stronger gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />

        {/* Text anchored to bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-14">
          <p className="text-white/70 text-xs font-semibold tracking-[0.18em] uppercase mb-1">
            {destination.country}
          </p>
          <h1 className="text-[1.85rem] font-bold text-white leading-tight text-balance drop-shadow">
            {destination.name}
          </h1>
          {destination.description && (
            <p className="text-white/70 text-sm mt-1 line-clamp-2 leading-snug">
              {destination.description}
            </p>
          )}
        </div>
      </div>

      {/* Floating search bar — overlaps hero bottom */}
      <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl px-4 md:px-4 -mt-6 relative z-10 mb-5">
        <SearchBar
          placeholder="Buscar experiencias..."
          className="shadow-xl rounded-2xl overflow-hidden border border-border/60"
        />
      </div>

      {/* Categories */}
      <main className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl">
        <CategoryGrid enabledSlugs={enabledSlugs} />
      </main>
    </div>
  )
}
