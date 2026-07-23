'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { Plus, GripVertical, Settings2, Trash2, Pencil, Calendar, Clock, MapIcon, Share2, Phone, Globe, Image as ImageIcon } from 'lucide-react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import { InfoItemForm } from './forms/info-item-form'
import type { DestinationInfoCategory, DestinationInfoItem } from '@/queries/destination_info'
// import server actions
import {
    createInfoItem,
    updateInfoItem,
    deleteInfoItem,
    updateInfoItemsOrder,
} from '@/app/(admin)/admin/actions/destination-info-items'

interface Props {
    category: DestinationInfoCategory
    destinationId: string
}

function SortableItemCard({
    item,
    onEdit,
    onDelete,
    isPending,
}: {
    item: DestinationInfoItem
    onEdit: () => void
    onDelete: () => void
    isPending: boolean
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    }

    // Pre-calculate action badges
    const activeActions = []
    if (item.actions?.time) activeActions.push(<Clock key="time" className="h-3 w-3" />)
    if (item.actions?.map) activeActions.push(<MapIcon key="map" className="h-3 w-3" />)
    if (item.actions?.share) activeActions.push(<Share2 key="share" className="h-3 w-3" />)
    if (item.actions?.phone) activeActions.push(<Phone key="phone" className="h-3 w-3" />)
    if (item.actions?.web) activeActions.push(<Globe key="web" className="h-3 w-3" />)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex gap-3 rounded-xl border bg-card p-4 hover:shadow-sm \${
        isDragging ? 'opacity-50' : ''
      }`}
        >
            <button
                className="mt-1 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
                disabled={isPending}
            >
                <GripVertical className="h-4 w-4" />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-bold text-sm uppercase text-slate-700 truncate mr-2">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {item.author && <span className="font-medium">{item.author}</span>}
                            {item.date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {item.date}
                                </span>
                            )}
                            {item.images_count ? (
                                <span className="flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3" /> {item.images_count}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={onEdit}
                            disabled={isPending}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={onDelete}
                            disabled={isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="mt-2 flex flex-col gap-0.5">
                    {item.description?.map((line, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground leading-tight">{line}</p>
                    ))}
                </div>

                {activeActions.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                        {activeActions}
                    </div>
                )}
            </div>
        </div>
    )
}

export function InfoCategoryDetails({ category, destinationId }: Props) {
    const [isPending, startTransition] = useTransition()

    // Local state for items
    const [items, setItems] = useState<DestinationInfoItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Cache items per category to avoid re-fetching when switching back
    const itemsCacheRef = useRef<Record<string, DestinationInfoItem[]>>({})

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<DestinationInfoItem | null>(null)
    const [itemToDelete, setItemToDelete] = useState<DestinationInfoItem | null>(null)

    // Fetch items whenever the selected category changes
    useEffect(() => {
        let mounted = true

        // Serve from cache immediately if available
        if (itemsCacheRef.current[category.id]) {
            setItems(itemsCacheRef.current[category.id])
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        async function fetchItems() {
            try {
                const res = await fetch(`/api/admin/destination-info-items?categoryId=${category.id}`)
                if (!mounted) return
                if (!res.ok) throw new Error('Failed to fetch items')
                const { items: data } = await res.json() as { items: DestinationInfoItem[] }
                itemsCacheRef.current[category.id] = data
                setItems(data)
            } catch (err) {
                if (!mounted) return
                console.error('Error fetching info items:', err)
            } finally {
                if (mounted) setIsLoading(false)
            }
        }

        fetchItems()
        return () => { mounted = false }
    }, [category.id])

    async function refreshItems(categoryId: string) {
        try {
            const res = await fetch(`/api/admin/destination-info-items?categoryId=${categoryId}`)
            if (!res.ok) throw new Error('Failed to refresh items')
            const { items: data } = await res.json() as { items: DestinationInfoItem[] }
            itemsCacheRef.current[categoryId] = data
            setItems(data)
        } catch (err) {
            console.error('Error refreshing info items:', err)
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id)
            const newIndex = items.findIndex((i) => i.id === over.id)
            const newArray = arrayMove(items, oldIndex, newIndex)

            setItems(newArray) // optimistic update

            startTransition(async () => {
                const result = await updateInfoItemsOrder(
                    newArray.map(c => c.id),
                    destinationId
                )
                if (!result.success) {
                    setItems(items) // revert
                    alert('Error al reordenar elementos')
                } else {
                    itemsCacheRef.current[category.id] = newArray
                }
            })
        }
    }

    const handleCreate = async (data: any) => {
        startTransition(async () => {
            const result = await createInfoItem({ ...data, category_id: category.id }, destinationId)
            if (result.success) {
                setIsCreateOpen(false)
                await refreshItems(category.id)
            } else {
                alert('Ocurrió un error. Intenta de nuevo.')
            }
        })
    }

    const handleUpdate = async (data: any) => {
        if (!editingItem) return
        startTransition(async () => {
            const result = await updateInfoItem(editingItem.id, data, destinationId)
            if (result.success) {
                setEditingItem(null)
                await refreshItems(category.id)
            } else {
                alert('Ocurrió un error. Intenta de nuevo.')
            }
        })
    }

    const handleDelete = async () => {
        if (!itemToDelete) return
        startTransition(async () => {
            const result = await deleteInfoItem(itemToDelete.id, destinationId)
            if (result.success) {
                setItemToDelete(null)
                await refreshItems(category.id)
            } else {
                alert('Ocurrió un error. Intenta de nuevo.')
            }
        })
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        Elementos de información dentro de esta categoría
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Nuevo Elemento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Nuevo Elemento de Información</DialogTitle>
                            <DialogDescription>
                                Agrega un consulado, cajero, hospital, o tip local.
                            </DialogDescription>
                        </DialogHeader>
                        <InfoItemForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreateOpen(false)}
                            isPending={isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <ScrollArea className="flex-1 p-6">
                {isLoading ? (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                        Cargando elementos...
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                        Esta categoría está vacía. Crea un elemento nuevo.
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex flex-col gap-3">
                            <SortableContext
                                items={items.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((item) => (
                                    <SortableItemCard
                                        key={item.id}
                                        item={item}
                                        onEdit={() => setEditingItem(item)}
                                        onDelete={() => setItemToDelete(item)}
                                        isPending={isPending}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </DndContext>
                )}
            </ScrollArea>

            {/* Edit Form Dialog */}
            <Dialog
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
            >
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Elemento</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles de este elemento
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <InfoItemForm
                            initialData={{
                                title: editingItem.title,
                                description: editingItem.description,
                                author: editingItem.author || '',
                                date: editingItem.date || '',
                                images_count: editingItem.images_count,
                                actions: editingItem.actions
                            }}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingItem(null)}
                            isPending={isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el elemento
                            <strong> {itemToDelete?.title}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
