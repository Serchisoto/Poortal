'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface InfoItemFormProps {
    initialData?: {
        title: string
        description: string[]
        author: string
        date: string
        images_count: number | null
        actions: Record<string, boolean>
    }
    onSubmit: (data: {
        title: string
        description: string[]
        author: string | null
        date: string | null
        images_count: number | null
        actions: Record<string, boolean>
    }) => void
    onCancel: () => void
    isPending: boolean
}

export function InfoItemForm({
    initialData,
    onSubmit,
    onCancel,
    isPending,
}: InfoItemFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [descriptionText, setDescriptionText] = useState(
        initialData?.description ? initialData.description.join('\n') : ''
    )
    const [author, setAuthor] = useState(initialData?.author ?? '')
    const [date, setDate] = useState(initialData?.date ?? '')
    const [imagesCount, setImagesCount] = useState<string>(
        initialData?.images_count ? initialData.images_count.toString() : ''
    )

    const [actions, setActions] = useState<Record<string, boolean>>(
        initialData?.actions ?? {
            time: false,
            map: false,
            share: false,
            phone: false,
            web: false,
        }
    )

    const handleActionChange = (actionName: string, checked: boolean) => {
        setActions((prev) => ({
            ...prev,
            [actionName]: checked,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Split description by new lines and filter empty ones
        const descriptionArray = descriptionText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)

        const parsedImagesCount = parseInt(imagesCount)

        onSubmit({
            title,
            description: descriptionArray,
            author: author || null,
            date: date || null,
            images_count: isNaN(parsedImagesCount) ? null : parsedImagesCount,
            actions,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: HOSPITAL AMERIMED, UNITED STATES CONSULATE, AIRPORT ATM..."
                        disabled={isPending}
                        required
                        className="uppercase"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">
                        Descripción <span className="text-muted-foreground font-normal">(Una línea por párrafo o viñeta)</span>
                    </Label>
                    <Textarea
                        id="description"
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                        placeholder="Introduce las líneas descriptivas separadas por un enter...&#10;Linea 1&#10;Linea 2"
                        disabled={isPending}
                        className="min-h-[120px]"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="author">Autor <span className="text-muted-foreground font-normal">(Opcional)</span></Label>
                        <Input
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            disabled={isPending}
                            placeholder="Ej: Sergio Soto"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha <span className="text-muted-foreground font-normal">(Opcional)</span></Label>
                        <Input
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isPending}
                            placeholder="Ej: 12/05/22"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Cantidad Imágenes <span className="text-muted-foreground font-normal">(Opcional)</span></Label>
                        <Input
                            id="images"
                            type="number"
                            min="0"
                            value={imagesCount}
                            onChange={(e) => setImagesCount(e.target.value)}
                            disabled={isPending}
                            placeholder="Ej: 3"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label>Acciones Disponibles</Label>
                    <div className="flex flex-wrap gap-4 rounded-lg border p-4">
                        {Object.entries({
                            time: 'Horario',
                            map: 'Mapa',
                            share: 'Compartir',
                            phone: 'Teléfono',
                            web: 'Sitio Web'
                        }).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`action-${key}`}
                                    checked={actions[key] || false}
                                    onCheckedChange={(checked) => handleActionChange(key, checked as boolean)}
                                    disabled={isPending}
                                />
                                <Label
                                    htmlFor={`action-${key}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando...' : initialData ? 'Guardar' : 'Crear'}
                </Button>
            </div>
        </form>
    )
}
