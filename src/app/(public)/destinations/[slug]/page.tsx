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
          {/* Gradient — strong centre scrim for contrast */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text — vertically and horizontally centred */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <p className="text-white/70 text-[11px] font-semibold tracking-[0.3em] uppercase drop-shadow mb-2">
              WELCOME TO
            </p>
            <h1 className="text-[2.6rem] font-extrabold text-white leading-none drop-shadow-lg tracking-tight text-balance">
              {destination.name}
            </h1>
            <p className="text-white/55 text-[10px] font-medium tracking-[0.22em] uppercase mt-2 drop-shadow">
              {destination.country}
            </p>
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
