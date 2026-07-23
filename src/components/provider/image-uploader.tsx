'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload, X, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addExperienceImage, deleteExperienceImage, setCoverImage } from '@/actions/experience-images'

interface ExperienceImage {
  id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_cover: boolean
}

interface Props {
  experienceId: string
  initialImages?: ExperienceImage[]
}

export function ImageUploader({ experienceId, initialImages = [] }: Props) {
  const [images, setImages] = useState<ExperienceImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      try {
        // 1. Get presigned URL
        const res = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            experienceId,
            size: file.size,
          }),
        })

        if (!res.ok) {
          const { error } = await res.json()
          alert(error ?? 'Error al obtener URL de subida')
          continue
        }

        const { presignedUrl, key } = await res.json()

        // 2. Upload directly to S3
        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        if (!uploadRes.ok) {
          alert('Error al subir la imagen a S3')
          continue
        }

        // 3. Save URL in DB
        await addExperienceImage(experienceId, key, file.name.split('.')[0])

        // 4. Optimistic update
        const url = presignedUrl.split('?')[0]
        const isCover = images.length === 0
        setImages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            url,
            alt_text: file.name,
            sort_order: prev.length,
            is_cover: isCover,
          },
        ])
      } catch {
        alert('Error inesperado al subir imagen')
      }
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await deleteExperienceImage(imageId, experienceId)
      if (result.success) {
        setImages((prev) => {
          const updated = prev.filter((img) => img.id !== imageId)
          const wascover = prev.find((img) => img.id === imageId)?.is_cover
          if (wascover && updated.length > 0) {
            return updated.map((img, i) => ({ ...img, is_cover: i === 0 }))
          }
          return updated
        })
      }
    })
  }

  function handleSetCover(imageId: string) {
    startTransition(async () => {
      const result = await setCoverImage(imageId, experienceId)
      if (result.success) {
        setImages((prev) =>
          prev.map((img) => ({ ...img, is_cover: img.id === imageId }))
        )
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Arrastra fotos o haz clic para subir</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Máx 10 MB por imagen</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt_text ?? ''} className="w-full h-full object-cover" />

              {/* Cover badge */}
              {img.is_cover && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PORTADA
                </span>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_cover && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleSetCover(img.id)}
                    disabled={isPending}
                    title="Hacer portada"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(img.id)}
                  disabled={isPending}
                  title="Eliminar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
