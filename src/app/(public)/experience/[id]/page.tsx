import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExperienceById, getExperienceAvailability } from '@/queries/experiences'
import { ExperienceCarousel } from './experience-carousel'
import { BackButton, ShareButton } from './action-buttons'
import { MapPin, Clock, Ticket } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getExperienceById(id)
  return { title: experience?.title || 'Experiencia' }
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatNextSlot(date: string, startTime: string) {
  const d = new Date(date + 'T00:00:00')
  const [h, m] = startTime.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${DAY_LABELS[d.getDay()]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]}, ${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [experience, availability] = await Promise.all([
    getExperienceById(id),
    getExperienceAvailability(id),
  ])

  if (!experience || (experience.status !== 'active' && experience.status !== 'pending_review')) {
    notFound()
  }

  const nextSlot = availability[0] ?? null

  const priceLevel =
    Number(experience.price_amount) < 500 ? '$' :
    Number(experience.price_amount) < 1500 ? '$$' : '$$$'

  const highlights = (experience.highlights as string[] | null) ?? []
  const images = experience.experience_images || []

  return (
    <div className="bg-background pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 md:container md:mx-auto md:max-w-5xl">
        <BackButton />
        <div className="flex-1 flex items-center justify-center">
          <div className="border border-slate-200 rounded-full px-10 py-2.5 shadow-sm">
            <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase text-center">
              {experience.title}
            </h1>
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="container mx-auto max-w-md md:max-w-5xl px-4">
        <div className="md:grid md:grid-cols-2 md:gap-8 space-y-4 md:space-y-0">
          {/* Left: Image carousel */}
          <div>
            <ExperienceCarousel
              images={images}
              title={experience.title}
              description={experience.description}
            />
          </div>

          {/* Right: CTA + Info */}
          <div className="space-y-4">
            {/* Tickets CTA */}
            <Link
              href={`/experience/${id}/book`}
              className="flex items-center justify-center gap-3 w-full bg-teal-700 text-white rounded-xl py-4 text-base font-bold tracking-wide active:scale-95 transition-transform"
            >
              <Ticket className="h-5 w-5" />
              Tickets
            </Link>

            {/* Info card */}
            <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
              {/* Name + price level + duration */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                    {experience.title}
                  </span>
                  <span className="ml-2 text-sm text-slate-500">{priceLevel}</span>
                </div>
                {experience.duration_minutes && (
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {formatDuration(experience.duration_minutes)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {experience.short_description || experience.description.slice(0, 160)}
              </p>

              {/* Next available slot */}
              {nextSlot && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-400">Next:</span>
                  {formatNextSlot(nextSlot.date, nextSlot.start_time)}
                </div>
              )}

              {/* Tags / highlights */}
              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Location + share */}
              <div className="flex items-center justify-between pt-1 border-t">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {experience.meeting_point || 'Location not specified'}
                </div>
                <ShareButton
                  title={experience.title}
                  description={experience.short_description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
