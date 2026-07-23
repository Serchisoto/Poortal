'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { replyToReviewAction } from '@/actions/reviews'
import { toast } from 'sonner'

type Props = { reviewId: string }

export function ReviewReplyForm({ reviewId }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      const result = await replyToReviewAction(reviewId, text)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Respuesta publicada')
        setOpen(false)
        setText('')
      }
    })
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setOpen(true)}>
        Responder
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Escribe tu respuesta al turista..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="text-sm"
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button size="sm" className="text-xs h-7" onClick={handleSubmit} disabled={isPending || text.trim().length < 10}>
          {isPending ? 'Publicando...' : 'Publicar respuesta'}
        </Button>
        <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setOpen(false)} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
