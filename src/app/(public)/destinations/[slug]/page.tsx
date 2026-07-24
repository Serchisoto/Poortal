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
          {/* Gradient — darker overall for strong contrast on text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/70" />

          {/* Text centred at the top */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-6 px-4 text-center">
            <p className="text-white/80 text-[9px] font-bold tracking-[0.28em] uppercase drop-shadow mb-1">
              WELCOME TO
            </p>
            <h1 className="text-[2rem] font-extrabold text-white leading-tight drop-shadow-lg tracking-tight">
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
