'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import type { Category } from '@/types'

interface FilterPanelProps {
  categories: Category[]
  onClose?: () => void
}

export function FilterPanel({ categories, onClose }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function applyFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/explore?${params.toString()}`)
  }

  function clearAll() {
    const q = searchParams.get('q')
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Limpiar
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={searchParams.get('category') || ''}
          onValueChange={(v) => applyFilter('category', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorias" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Precio minimo</Label>
        <Input
          type="number"
          placeholder="0"
          defaultValue={searchParams.get('minPrice') || ''}
          onChange={(e) => applyFilter('minPrice', e.target.value || null)}
        />
      </div>

      <div className="space-y-2">
        <Label>Precio maximo</Label>
        <Input
          type="number"
          placeholder="Sin limite"
          defaultValue={searchParams.get('maxPrice') || ''}
          onChange={(e) => applyFilter('maxPrice', e.target.value || null)}
        />
      </div>

      <div className="space-y-2">
        <Label>Calificacion minima</Label>
        <Select
          value={searchParams.get('rating') || ''}
          onValueChange={(v) => applyFilter('rating', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cualquier calificacion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4+ estrellas</SelectItem>
            <SelectItem value="3">3+ estrellas</SelectItem>
            <SelectItem value="2">2+ estrellas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ordenar por</Label>
        <Select
          value={searchParams.get('sort') || 'relevance'}
          onValueChange={(v) => applyFilter('sort', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="rating">Mejor calificados</SelectItem>
            <SelectItem value="newest">Mas recientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fecha disponible</Label>
        <Input
          type="date"
          defaultValue={searchParams.get('date') || ''}
          onChange={(e) => applyFilter('date', e.target.value || null)}
        />
      </div>
    </div>
  )
}
