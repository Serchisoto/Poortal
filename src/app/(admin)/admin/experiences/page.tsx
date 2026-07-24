export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { ExperienceModeration } from '@/components/admin/experience-moderation'

export const metadata: Metadata = {
  title: 'Moderacion de Experiencias',
}

type ExperienceRow = {
  id: string
  title: string
  slug: string
  status: string
  price_amount: number
  price_currency: string
  pricing_type: string
  duration_minutes: number | null
  max_capacity: number
  min_capacity: number
  cancellation_policy: string
  short_description: string | null
  description: string
  meeting_point: string | null
  rejection_reason: string | null
  created_at: string
  provider_profiles: {
    business_name: string
    representative_name: string
    phone: string
    location: string
    status: string
  } | null
  categories: { name: string } | null
  destinations: { name: string } | null
  experience_images: { url: string; alt_text: string | null; is_cover: boolean; sort_order: number }[]
}

const experienceSelect = {
  id: true,
  title: true,
  slug: true,
  status: true,
  price_amount: true,
  price_currency: true,
  pricing_type: true,
  duration_minutes: true,
  max_capacity: true,
  min_capacity: true,
  cancellation_policy: true,
  short_description: true,
  description: true,
  meeting_point: true,
  rejection_reason: true,
  created_at: true,
  provider_profiles: {
    select: {
      business_name: true,
      representative_name: true,
      phone: true,
      location: true,
      status: true,
    },
  },
  categories: { select: { name: true } },
  destinations: { select: { name: true } },
  experience_images: {
    select: { url: true, alt_text: true, is_cover: true, sort_order: true },
    orderBy: { sort_order: 'asc' as const },
  },
}

export default async function AdminExperiencesPage() {
  const serialize = (list: Awaited<ReturnType<typeof prisma.experiences.findMany<{ select: typeof experienceSelect }>>>) =>
    list.map((exp) => ({ ...exp, price_amount: Number(exp.price_amount), created_at: exp.created_at.toISOString() }))

  const [pendingList, activeList, rejectedList] = await Promise.all([
    prisma.experiences.findMany({
      where: { status: 'pending_review' },
      select: experienceSelect,
      orderBy: { created_at: 'desc' },
    }).then(serialize),
    prisma.experiences.findMany({
      where: { status: 'active' },
      select: experienceSelect,
      orderBy: { created_at: 'desc' },
    }).then(serialize),
    prisma.experiences.findMany({
      where: { status: { in: ['rejected', 'draft', 'paused'] } },
      select: experienceSelect,
      orderBy: { created_at: 'desc' },
    }).then(serialize),
  ])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Experiencias</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Revisa y modera las experiencias publicadas en la plataforma
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1 gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Revision</span>
            {pendingList.length > 0 && (
              <Badge variant="destructive" className="h-4 min-w-4 rounded-full px-1 text-[10px]">{pendingList.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activas" className="flex-1 gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Activas</span>
            <Badge variant="secondary" className="h-4 min-w-4 rounded-full px-1 text-[10px]">{activeList.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="otras" className="flex-1 gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Otras</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          <ExperienceModeration
            experiences={pendingList as ExperienceRow[]}
            showActions
            emptyMessage="No hay experiencias pendientes de revision."
          />
        </TabsContent>

        <TabsContent value="activas" className="mt-4">
          <ExperienceModeration
            experiences={activeList as ExperienceRow[]}
            emptyMessage="No hay experiencias activas todavia."
          />
        </TabsContent>

        <TabsContent value="otras" className="mt-4">
          <ExperienceModeration
            experiences={rejectedList as ExperienceRow[]}
            emptyMessage="No hay experiencias rechazadas."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
