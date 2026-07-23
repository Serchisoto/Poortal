'use client'

import { useActionState, useState, useEffect } from 'react'
import { createExperienceAction, updateExperienceAction, type ExperienceActionState } from '@/actions/experiences'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Category, Destination, Subcategory, Experience } from '@/types'
import { ImageUploader } from './image-uploader'

interface ExperienceFormProps {
  categories: Category[]
  destinations: Destination[]
  experience?: Experience | null
  initialImages?: Array<{ id: string; url: string; alt_text: string | null; sort_order: number; is_cover: boolean }>
}

export function ExperienceForm({ categories, destinations, experience, initialImages }: ExperienceFormProps) {
  const isEdit = !!experience
  const action = isEdit ? updateExperienceAction : createExperienceAction

  const [state, formAction, isPending] = useActionState<ExperienceActionState, FormData>(action, {})
  const [selectedCategory, setSelectedCategory] = useState(experience?.category_id || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState(experience?.subcategory_id || '')
  const [selectedDestination, setSelectedDestination] = useState(experience?.destination_id || '')
  const [selectedPricingType, setSelectedPricingType] = useState<string>(experience?.pricing_type || 'per_person')
  const [selectedCancellation, setSelectedCancellation] = useState<string>(experience?.cancellation_policy || 'flexible')
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [slug, setSlug] = useState(experience?.slug || '')

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([])
      return
    }
    fetch(`/api/subcategories?categoryId=${selectedCategory}`)
      .then((res) => res.json())
      .then(({ subcategories }) => setSubcategories(subcategories ?? []))
  }, [selectedCategory])

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="experience_id" value={experience.id} />}

      {state.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700">
          {state.success}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacion basica</CardTitle>
          <CardDescription>Nombre, descripcion y clasificacion de tu experiencia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={experience?.title || ''}
              placeholder="Ej: Tour de Snorkel en Cabo Pulmo"
              required
              onChange={(e) => {
                if (!isEdit || slug === generateSlug(experience?.title || '')) {
                  setSlug(generateSlug(e.target.value))
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL amigable *</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tour-snorkel-cabo-pulmo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Descripcion corta</Label>
            <Input
              id="short_description"
              name="short_description"
              defaultValue={experience?.short_description || ''}
              placeholder="Una linea que resuma tu experiencia (max 200 caracteres)"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripcion completa *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={experience?.description || ''}
              placeholder="Describe en detalle la experiencia que ofreces..."
              rows={5}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Classification */}
      <Card>
        <CardHeader>
          <CardTitle>Clasificacion</CardTitle>
          <CardDescription>Destino, categoria y subcategoria.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Destino *</Label>
            <input type="hidden" name="destination_id" value={selectedDestination} />
            <Select value={selectedDestination || undefined} onValueChange={setSelectedDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona destino" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <input type="hidden" name="category_id" value={selectedCategory} />
              <Select value={selectedCategory || undefined} onValueChange={(v) => { setSelectedCategory(v); setSelectedSubcategory('') }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subcategoria</Label>
              <input type="hidden" name="subcategory_id" value={selectedSubcategory} />
              <Select value={selectedSubcategory || undefined} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder={subcategories.length ? 'Selecciona' : 'Selecciona categoria primero'} />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
          <CardDescription>Duracion, capacidad y punto de encuentro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duracion (minutos)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                defaultValue={experience?.duration_minutes || ''}
                placeholder="120"
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Capacidad maxima *</Label>
              <Input
                id="max_capacity"
                name="max_capacity"
                type="number"
                defaultValue={experience?.max_capacity || 10}
                min={1}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_capacity">Capacidad minima</Label>
              <Input
                id="min_capacity"
                name="min_capacity"
                type="number"
                defaultValue={experience?.min_capacity || 1}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_point">Punto de encuentro</Label>
            <Input
              id="meeting_point"
              name="meeting_point"
              defaultValue={experience?.meeting_point || ''}
              placeholder="Ej: Marina de Cabo San Lucas, Muelle 3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Precios y politica</CardTitle>
          <CardDescription>Tipo de precio, monto y politica de cancelacion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de precio *</Label>
              <input type="hidden" name="pricing_type" value={selectedPricingType} />
              <Select value={selectedPricingType} onValueChange={setSelectedPricingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_person">Por persona</SelectItem>
                  <SelectItem value="per_group">Por grupo</SelectItem>
                  <SelectItem value="flat_rate">Tarifa fija</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_amount">Precio (MXN) *</Label>
              <Input
                id="price_amount"
                name="price_amount"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={experience?.price_amount ? Number(experience.price_amount) : ''}
                placeholder="1500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Politica de cancelacion *</Label>
              <input type="hidden" name="cancellation_policy" value={selectedCancellation} />
              <Select value={selectedCancellation} onValueChange={setSelectedCancellation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="moderate">Moderada</SelectItem>
                  <SelectItem value="strict">Estricta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <input type="hidden" name="price_currency" value="MXN" />
        </CardContent>
      </Card>

      {/* Highlights & Includes */}
      <Card>
        <CardHeader>
          <CardTitle>Lo que incluye</CardTitle>
          <CardDescription>Agrega puntos destacados y que incluye/excluye la experiencia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ListInput
            label="Puntos destacados"
            name="highlights"
            placeholder="Ej: Guia bilingue incluido"
            defaultValues={experience?.highlights as string[] || []}
          />
          <ListInput
            label="Incluye"
            name="includes"
            placeholder="Ej: Equipo de snorkel"
            defaultValues={experience?.includes as string[] || []}
          />
          <ListInput
            label="No incluye"
            name="excludes"
            placeholder="Ej: Transporte al punto de encuentro"
            defaultValues={experience?.excludes as string[] || []}
          />
          <ListInput
            label="Requisitos"
            name="requirements"
            placeholder="Ej: Saber nadar"
            defaultValues={experience?.requirements as string[] || []}
          />
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
          <CardDescription>
            {isEdit
              ? 'Sube fotos de la experiencia. La primera se usará como portada.'
              : 'Podrás subir fotos después de crear la experiencia.'}
          </CardDescription>
        </CardHeader>
        {isEdit && experience?.id && (
          <CardContent>
            <ImageUploader experienceId={experience.id} initialImages={initialImages} />
          </CardContent>
        )}
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending
            ? isEdit ? 'Guardando...' : 'Creando...'
            : isEdit ? 'Guardar Cambios' : 'Crear Experiencia'}
        </Button>
      </div>
    </form>
  )
}

function ListInput({
  label,
  name,
  placeholder,
  defaultValues = [],
}: {
  label: string
  name: string
  placeholder: string
  defaultValues?: string[]
}) {
  const [items, setItems] = useState<string[]>(defaultValues.length ? defaultValues : [''])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            name={name}
            value={item}
            onChange={(e) => {
              const newItems = [...items]
              newItems[i] = e.target.value
              setItems(newItems)
            }}
            placeholder={placeholder}
          />
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              &times;
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setItems([...items, ''])}
      >
        + Agregar
      </Button>
    </div>
  )
}
