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

      <main className="container mx-auto max-w-md md:max-w-2xl">
        {/* Greeting */}
        <div className="px-6 mt-6 mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
            Welcome to {destination.name}!
          </h1>
        </div>

        {/* Search */}
        <div className="px-6 mb-8">
          <div className="relative">
            <Link href={ROUTES.explore} className="block">
              <div className="w-full bg-white rounded-full border border-slate-200 py-3.5 pl-12 pr-4 shadow-sm flex items-center text-muted-foreground/50">
                <span className="text-sm font-bold tracking-widest">ASK ANYTHING</span>
              </div>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <CategoryGrid />
      </main>


    </div>
  )
}
