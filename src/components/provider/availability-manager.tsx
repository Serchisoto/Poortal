'use client'

import { useActionState, useState } from 'react'
import {
  addAvailabilityAction,
  addRecurringAvailabilityAction,
  type ExperienceActionState,
} from '@/actions/experiences'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, Clock, Plus, Repeat } from 'lucide-react'

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_spots: number
  booked_spots: number
  price_override: number | null
  is_blocked: boolean
}

interface AvailabilityManagerProps {
  experienceId: string
  availability: AvailabilitySlot[]
}

const WEEKDAYS = [
  { label: 'Dom', value: 0 },
  { label: 'Lun', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Mié', value: 3 },
  { label: 'Jue', value: 4 },
  { label: 'Vie', value: 5 },
  { label: 'Sáb', value: 6 },
]

function WeekdayPicker({
  selected,
  onChange,
}: {
  selected: number[]
  onChange: (days: number[]) => void
}) {
  function toggle(day: number) {
    onChange(
      selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day]
    )
  }

  const presets = [
    { label: 'Lun–Vie', days: [1, 2, 3, 4, 5] },
    { label: 'Lun–Sáb', days: [1, 2, 3, 4, 5, 6] },
    { label: 'Fin de semana', days: [0, 6] },
    { label: 'Todos', days: [0, 1, 2, 3, 4, 5, 6] },
  ]

  return (
    <div className="space-y-2">
      <Label>Días de la semana *</Label>
      <div className="flex flex-wrap gap-1">
        {WEEKDAYS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => toggle(d.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selected.includes(d.value)
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.days)}
            className="rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Hidden inputs for form submission */}
      {selected.map((d) => (
        <input key={d} type="hidden" name="weekdays" value={d} />
      ))}
    </div>
  )
}

export function AvailabilityManager({ experienceId, availability }: AvailabilityManagerProps) {
  const [mode, setMode] = useState<'single' | 'recurring'>('single')
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])

  const [singleState, singleFormAction, singlePending] = useActionState<ExperienceActionState, FormData>(
    addAvailabilityAction,
    {}
  )
  const [recurringState, recurringFormAction, recurringPending] = useActionState<ExperienceActionState, FormData>(
    addRecurringAvailabilityAction,
    {}
  )

  const formatDate = (dateStr: string) => {
    const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return `${DAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Disponibilidad
        </CardTitle>
        <CardDescription>
          Agrega fechas y horarios en los que esta experiencia estara disponible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing slots */}
        {availability.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fechas programadas</h4>
            {availability.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-md border p-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(slot.date)}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {slot.start_time.slice(0, 5)}
                    {slot.end_time && ` - ${slot.end_time.slice(0, 5)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={slot.booked_spots > 0 ? 'default' : 'secondary'}>
                    {slot.booked_spots}/{slot.total_spots} reservados
                  </Badge>
                  {slot.price_override && (
                    <Badge variant="outline">
                      ${Number(slot.price_override).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-2 rounded-lg border p-1 w-fit">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'single' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Fecha única
          </button>
          <button
            type="button"
            onClick={() => setMode('recurring')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === 'recurring' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            <Repeat className="h-3.5 w-3.5" />
            Recurrente
          </button>
        </div>

        {/* Single date form */}
        {mode === 'single' && (
          <form action={singleFormAction} className="space-y-4 rounded-md border p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" />
              Agregar fecha
            </h4>
            <input type="hidden" name="experience_id" value={experienceId} />

            {singleState.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {singleState.error}
              </div>
            )}
            {singleState.success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
                {singleState.success}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avail_date">Fecha *</Label>
                <Input
                  id="avail_date"
                  name="date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avail_start">Hora inicio *</Label>
                <Input id="avail_start" name="start_time" type="time" required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="avail_end">Hora fin</Label>
                <Input id="avail_end" name="end_time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avail_spots">Lugares *</Label>
                <Input
                  id="avail_spots"
                  name="total_spots"
                  type="number"
                  min={1}
                  defaultValue={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avail_price">Precio especial</Label>
                <Input
                  id="avail_price"
                  name="price_override"
                  type="number"
                  step="0.01"
                  placeholder="Vacío = precio base"
                />
              </div>
            </div>

            <Button type="submit" size="sm" disabled={singlePending}>
              {singlePending ? 'Agregando...' : 'Agregar Fecha'}
            </Button>
          </form>
        )}

        {/* Recurring form */}
        {mode === 'recurring' && (
          <form action={recurringFormAction} className="space-y-4 rounded-md border p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Repeat className="h-4 w-4" />
              Disponibilidad recurrente
            </h4>
            <input type="hidden" name="experience_id" value={experienceId} />

            {recurringState.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {recurringState.error}
              </div>
            )}
            {recurringState.success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
                {recurringState.success}
              </div>
            )}

            <WeekdayPicker selected={selectedDays} onChange={setSelectedDays} />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rec_from">Desde *</Label>
                <Input
                  id="rec_from"
                  name="date_from"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rec_to">Hasta *</Label>
                <Input
                  id="rec_to"
                  name="date_to"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rec_start">Hora inicio *</Label>
                <Input id="rec_start" name="start_time" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rec_end">Hora fin</Label>
                <Input id="rec_end" name="end_time" type="time" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rec_spots">Lugares por sesión *</Label>
                <Input
                  id="rec_spots"
                  name="total_spots"
                  type="number"
                  min={1}
                  defaultValue={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rec_price">Precio especial</Label>
                <Input
                  id="rec_price"
                  name="price_override"
                  type="number"
                  step="0.01"
                  placeholder="Vacío = precio base"
                />
              </div>
            </div>

            <Button type="submit" size="sm" disabled={recurringPending || selectedDays.length === 0}>
              {recurringPending ? 'Generando fechas...' : 'Agregar fechas recurrentes'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
