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
    <div className="bg-background pb-20">
      <SetActiveDestination slug={destination.slug} />

      {/* Hero */}
      <div className="relative w-full h-44 md:h-72 bg-primary overflow-hidden">
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
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">
            Welcome to {destination.name}
          </h1>
          {destination.city && destination.country && (
            <p className="text-white/80 text-sm mt-0.5">
              {destination.city}, {destination.country}
            </p>
          )}
        </div>
      </div>

      {/* Content: centered, max-w scales for desktop */}
      <main className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl px-0 md:px-4">
        {/* Search */}
        <div className="px-4 md:px-0 -mt-5 mb-6 relative z-10">
          <SearchBar
            placeholder="Buscar experiencias..."
            className="shadow-lg rounded-2xl overflow-hidden"
          />
        </div>

        {/* Categories */}
        <CategoryGrid enabledSlugs={enabledSlugs} />
      </main>
    </div>
  )
}
