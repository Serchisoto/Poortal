'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, GripVertical, Settings2, Trash2, Pencil } from 'lucide-react'
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
import { DynamicIcon } from '@/lib/lucide-icon-map'

import { InfoCategoryForm } from './forms/info-category-form'
import {
    createInfoCategory,
    updateInfoCategory,
    deleteInfoCategory,
    updateInfoCategoriesOrder,
} from '@/app/(admin)/admin/actions/destination-info-categories'
import type { DestinationInfoCategory } from '@/queries/destination_info'

interface Props {
    destinationId: string
    categories: DestinationInfoCategory[]
    onSelectCategory: (category: DestinationInfoCategory) => void
    selectedCategoryId?: string
}

function SortableCategoryItem({
    category,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    isPending,
}: {
    category: DestinationInfoCategory
    isSelected: boolean
    onSelect: () => void
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
    } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 ${isSelected ? 'border-primary bg-primary/5' : 'bg-background'
                } ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <button
                    className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                    disabled={isPending}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <button
                    onClick={onSelect}
                    className="flex items-center gap-3 text-left"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background shadow-sm">
                        <DynamicIcon
                            name={category.icon || 'folder'}
                            className="h-4 w-4 text-muted-foreground"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">
                            {category.title}
                        </p>
                        {category.subtitle && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {category.subtitle}
                            </p>
                        )}
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }}
                    disabled={isPending}
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar categoría</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar categoría</span>
                </Button>
            </div>
        </div>
    )
}

export function InfoCategoryManager({
    destinationId,
    categories: initialCategories,
    onSelectCategory,
    selectedCategoryId,
}: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState(initialCategories)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<DestinationInfoCategory | null>(null)
    const [categoryToDelete, setCategoryToDelete] = useState<DestinationInfoCategory | null>(null)

    // Track state so when isPending goes back to false and success, we close modal
    const [submitState, setSubmitState] = useState<{ success?: boolean; error?: string } | null>(null)
    const wasPending = useRef(false)

    // Sync with prop changes
    useEffect(() => {
        setCategories(initialCategories)
    }, [initialCategories])

    // React to Server Action completion
    useEffect(() => {
        if (wasPending.current && !isPending && submitState?.success) {
            setIsCreateOpen(false)
            setEditingCategory(null)
            setCategoryToDelete(null)
            setSubmitState(null)
            router.refresh()
        }
        wasPending.current = isPending
    }, [isPending, submitState, router])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((i) => i.id === active.id)
            const newIndex = categories.findIndex((i) => i.id === over.id)
            const newArray = arrayMove(categories, oldIndex, newIndex)

            setCategories(newArray) // optimistic update

            startTransition(async () => {
                const result = await updateInfoCategoriesOrder(
                    newArray.map(c => c.id),
                    destinationId
                )
                if (!result.success) {
                    setCategories(categories) // revert
                    alert('Ocurrió un error. Intenta de nuevo.')
                }
            })
        }
    }

    const handleCreate = async (data: any) => {
        startTransition(async () => {
            const result = await createInfoCategory({ ...data, destination_id: destinationId })
            setSubmitState(result)
        })
    }

    const handleUpdate = async (data: any) => {
        if (!editingCategory) return
        startTransition(async () => {
            const result = await updateInfoCategory(editingCategory.id, data, destinationId)
            setSubmitState(result)
        })
    }

    const handleDelete = async () => {
        if (!categoryToDelete) return
        startTransition(async () => {
            const result = await deleteInfoCategory(categoryToDelete.id, destinationId)
            setSubmitState(result)
        })
    }

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Categorías</h2>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <Plus className="h-4 w-4" />
                            Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nueva Categoría</DialogTitle>
                            <DialogDescription>
                                Agrega una nueva sección de información (ej. Consulados, Tipos de cambio)
                            </DialogDescription>
                        </DialogHeader>
                        <InfoCategoryForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreateOpen(false)}
                            isPending={isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col gap-2">
                    <SortableContext
                        items={categories.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {categories.map((category) => (
                            <SortableCategoryItem
                                key={category.id}
                                category={category}
                                isSelected={selectedCategoryId === category.id}
                                onSelect={() => onSelectCategory(category)}
                                onEdit={() => setEditingCategory(category)}
                                onDelete={() => setCategoryToDelete(category)}
                                isPending={isPending}
                            />
                        ))}
                        {categories.length === 0 && (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                No hay categorías creadas.
                            </div>
                        )}
                    </SortableContext>
                </div>
            </DndContext>

            {/* Edit Category Dialog */}
            <Dialog
                open={!!editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles de esta categoría.
                        </DialogDescription>
                    </DialogHeader>
                    {editingCategory && (
                        <InfoCategoryForm
                            initialData={{
                                title: editingCategory.title,
                                slug: editingCategory.slug,
                                icon: editingCategory.icon || '',
                                subtitle: editingCategory.subtitle || '',
                                color: editingCategory.color || '',
                            }}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingCategory(null)}
                            isPending={isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!categoryToDelete}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la categoría
                            <strong> {categoryToDelete?.title}</strong> y todos sus elementos de información.
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
