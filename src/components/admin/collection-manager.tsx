'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createCollectionAction,
  updateCollectionAction,
  deleteCollectionAction,
  type CollectionActionState,
} from '@/actions/collections'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react'
import type { CollectionWithExperiences } from '@/types'
import { IconPicker } from './icon-picker'

interface CollectionManagerProps {
  destinationId: string
  collections: CollectionWithExperiences[]
  onSelectCollection: (collection: CollectionWithExperiences) => void
  selectedCollectionId?: string
}

export function CollectionManager({
  destinationId,
  collections,
  onSelectCollection,
  selectedCollectionId,
}: CollectionManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Colecciones</h2>
        <CreateCollectionDialog destinationId={destinationId} />
      </div>

      {collections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No hay colecciones. Crea la primera.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {collections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              isSelected={col.id === selectedCollectionId}
              onSelect={() => onSelectCollection(col)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CollectionCard({
  collection,
  isSelected,
  onSelect,
}: {
  collection: CollectionWithExperiences
  isSelected: boolean
  onSelect: () => void
}) {
  const experienceCount = collection.collection_experiences?.length ?? 0

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? 'border-primary bg-muted/30' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="text-sm font-medium truncate">{collection.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {experienceCount} {experienceCount === 1 ? 'exp.' : 'exps.'}
            </Badge>
            {!collection.is_active && (
              <Badge variant="outline" className="shrink-0">Inactiva</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <EditCollectionDialog collection={collection} />
            <DeleteCollectionButton collectionId={collection.id} collectionName={collection.name} />
          </div>
        </div>
        {collection.description && (
          <p className="text-xs text-muted-foreground truncate">{collection.description}</p>
        )}
      </CardHeader>
    </Card>
  )
}

function CreateCollectionDialog({ destinationId }: { destinationId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<CollectionActionState, FormData>(
    createCollectionAction,
    {}
  )
  const wasPending = useRef(false)
  const [icon, setIcon] = useState<string>('')

  useEffect(() => {
    if (wasPending.current && !isPending && state.success) {
      setOpen(false)
      router.refresh()
    }
    wasPending.current = isPending
  }, [isPending, state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nueva coleccion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear coleccion</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="destination_id" value={destinationId} />
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" placeholder="Ej. Vegetariano, Para familias..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Textarea id="description" name="description" placeholder="Descripcion opcional" rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icono</Label>
            <IconPicker name="icon" value={icon} onChange={setIcon} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">Orden</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue="0" min="0" />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state.success && <p className="text-sm text-green-600">{state.success}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creando...' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditCollectionDialog({ collection }: { collection: CollectionWithExperiences }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<CollectionActionState, FormData>(
    updateCollectionAction,
    {}
  )
  const wasPending = useRef(false)
  const [icon, setIcon] = useState<string>(collection.icon || '')

  useEffect(() => {
    if (wasPending.current && !isPending && state.success) {
      setOpen(false)
      router.refresh()
    }
    wasPending.current = isPending
  }, [isPending, state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar coleccion</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="collection_id" value={collection.id} />
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre *</Label>
            <Input id="edit-name" name="name" defaultValue={collection.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripcion</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={collection.description ?? ''}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-icon">Icono</Label>
            <IconPicker name="icon" value={icon} onChange={setIcon} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-sort_order">Orden</Label>
            <Input
              id="edit-sort_order"
              name="sort_order"
              type="number"
              defaultValue={collection.sort_order}
              min="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-is_active"
              name="is_active"
              value="true"
              defaultChecked={collection.is_active}
            />
            <Label htmlFor="edit-is_active">Activa</Label>
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state.success && <p className="text-sm text-green-600">{state.success}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteCollectionButton({
  collectionId,
  collectionName,
}: {
  collectionId: string
  collectionName: string
}) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<CollectionActionState, FormData>(
    deleteCollectionAction,
    {}
  )
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !isPending && state.success) router.refresh()
    wasPending.current = isPending
  }, [isPending, state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={formAction}>
      <input type="hidden" name="collection_id" value={collectionId} />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm(`¿Eliminar la coleccion "${collectionName}"? Se quitaran todas sus experiencias.`)) {
            e.preventDefault()
          }
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      {state.error && <p className="text-xs text-destructive mt-1">{state.error}</p>}
    </form>
  )
}
