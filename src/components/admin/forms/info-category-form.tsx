'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconPicker } from '@/components/admin/icon-picker'
import { DynamicIcon } from '@/lib/lucide-icon-map'

interface InfoCategoryFormProps {
    initialData?: {
        title: string
        slug: string
        icon: string
        subtitle: string
        color: string
    }
    onSubmit: (data: {
        title: string
        slug: string
        icon: string | null
        subtitle: string | null
        color: string | null
    }) => void
    onCancel: () => void
    isPending: boolean
}

const TAILWIND_COLORS = [
    'text-slate-500',
    'text-red-500',
    'text-orange-500',
    'text-amber-500',
    'text-yellow-500',
    'text-lime-500',
    'text-green-500',
    'text-emerald-500',
    'text-teal-500',
    'text-cyan-500',
    'text-sky-500',
    'text-blue-500',
    'text-indigo-500',
    'text-violet-500',
    'text-purple-500',
    'text-fuchsia-500',
    'text-pink-500',
    'text-rose-500',
]

export function InfoCategoryForm({
    initialData,
    onSubmit,
    onCancel,
    isPending,
}: InfoCategoryFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [slug, setSlug] = useState(initialData?.slug ?? '')
    const [icon, setIcon] = useState(initialData?.icon ?? '')
    const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? '')
    const [color, setColor] = useState(initialData?.color ?? 'text-teal-700')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        // Auto-generate slug only if creating new
        if (!initialData) {
            setSlug(
                newTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            )
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title,
            slug,
            icon: icon || null,
            subtitle: subtitle || null,
            color: color || null,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-right">
                    Título
                </Label>
                <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Ej: Consulados, Hospitales..."
                    disabled={isPending}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={!!initialData || isPending}
                    required
                />
                <p className="text-[10px] text-muted-foreground">
                    Identificador único para la URL (solo letras, números y guiones)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ej: Asistencia legal"
                    disabled={isPending}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Icono</Label>
                    <div className="mt-1">
                        <IconPicker
                            value={icon}
                            onChange={setIcon}
                            disabled={isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Color de Tono</Label>
                    <div className="mt-1">
                        <div className="flex flex-wrap gap-1">
                            {TAILWIND_COLORS.map(c => (
                                <button
                                    type="button"
                                    key={c}
                                    className={`h-6 w-6 rounded-full border border-slate-200 \${c.replace('text-', 'bg-')} \${color === c ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                            <button
                                type="button"
                                className={`h-6 w-6 rounded-full border border-slate-200 bg-slate-800 \${color === 'text-slate-800' ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                                onClick={() => setColor('text-slate-800')}
                            />
                            <button
                                type="button"
                                className={`h-6 w-6 rounded-full border border-slate-200 bg-teal-700 \${color === 'text-teal-700' ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                                onClick={() => setColor('text-teal-700')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border bg-white shadow-sm w-24 h-20">
                    <DynamicIcon name={icon || 'folder'} className={`h-8 w-8 \${color}`} strokeWidth={1.25} />
                    <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">{title || 'Preview'}</span>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
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
