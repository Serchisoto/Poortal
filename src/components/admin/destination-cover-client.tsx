'use client'

import { useState, useRef } from 'react'
import { ImagePlus, Trash2, Loader2 } from 'lucide-react'
import { updateDestinationCoverAction } from '@/actions/destination-cover'
import { Button } from '@/components/ui/button'

interface Props {
  destinationId: string
  initialCoverUrl: string | null
  destinationName: string
}

export function DestinationCoverClient({ destinationId, initialCoverUrl, destinationName }: Props) {
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // 1. Get presigned URL
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          destinationId,
          size: file.size,
        }),
      })
      const presignData = await presignRes.json()
      if (!presignRes.ok) throw new Error(presignData.error ?? 'Error al obtener URL de subida')

      // 2. Upload directly to GCS
      const uploadRes = await fetch(presignData.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Error al subir imagen')

      // 3. Save URL to DB
      const result = await updateDestinationCoverAction(destinationId, presignData.key)
      if (result.error) throw new Error(result.error)

      setCoverUrl(presignData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    setUploading(true)
    setError(null)
    try {
      const result = await updateDestinationCoverAction(destinationId, null)
      if (result.error) throw new Error(result.error)
      setCoverUrl(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Imagen de portada</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Esta imagen aparece como hero en la página pública del destino. Recomendado: 1600×900px, JPG o WebP.
        </p>
      </div>

      {/* Preview */}
      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-muted border border-border">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={`Portada de ${destinationName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/50">
            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs font-medium">Sin imagen de portada</span>
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex-1"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {coverUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </Button>

        {coverUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
