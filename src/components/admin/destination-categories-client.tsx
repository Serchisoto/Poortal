'use client'

import { useTransition } from 'react'
import {
  Bus, Car, UtensilsCrossed, PartyPopper, Waves,
  Landmark, Volleyball, Hotel, ShoppingBag, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toggleDestinationCategoryAction } from '@/actions/destination-categories'
import { toast } from 'sonner'

type CategoryDef = {
  slug: string
  label: string
  icon: LucideIcon
  description: string
}

const ALL_CATEGORIES: CategoryDef[] = [
  { slug: 'tours',    label: 'Tours',    icon: Bus,            description: 'Excursiones y tours guiados' },
  { slug: 'ride',     label: 'Ride',     icon: Car,            description: 'Transporte y traslados' },
  { slug: 'food',     label: 'Food',     icon: UtensilsCrossed,description: 'Restaurantes y gastronomía' },
  { slug: 'party',    label: 'Party',    icon: PartyPopper,    description: 'Fiestas y eventos' },
  { slug: 'sea',      label: 'Sea',      icon: Waves,          description: 'Actividades acuáticas' },
  { slug: 'culture',  label: 'Culture',  icon: Landmark,       description: 'Cultura y patrimonio' },
  { slug: 'sports',   label: 'Sports',   icon: Volleyball,     description: 'Deportes y aventura' },
  { slug: 'stay',     label: 'Stay',     icon: Hotel,          description: 'Hospedaje y alojamiento' },
  { slug: 'shopping', label: 'Shopping', icon: ShoppingBag,    description: 'Compras y mercados' },
  { slug: 'wellness', label: 'Wellness', icon: Sparkles,       description: 'Bienestar y spa' },
]

interface Props {
  destinationId: string
  enabledSlugs: string[]
}

export function DestinationCategoriesClient({ destinationId, enabledSlugs }: Props) {
  const [isPending, startTransition] = useTransition()
  const enabledSet = new Set(enabledSlugs)

  function handleToggle(slug: string, checked: boolean) {
    startTransition(async () => {
      const result = await toggleDestinationCategoryAction(destinationId, slug, checked)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(checked ? `"${slug}" habilitado` : `"${slug}" deshabilitado`)
      }
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Activa las categorías disponibles en este destino. Solo las categorías habilitadas
        aparecerán en la pantalla principal del usuario.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ALL_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isEnabled = enabledSet.has(cat.slug)
          return (
            <div
              key={cat.slug}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor={`cat-${cat.slug}`} className="text-sm font-medium cursor-pointer">
                    {cat.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
              </div>
              <Switch
                id={`cat-${cat.slug}`}
                checked={isEnabled}
                onCheckedChange={(checked) => handleToggle(cat.slug, checked)}
                disabled={isPending}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
