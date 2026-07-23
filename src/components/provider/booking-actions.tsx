'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, Ban } from 'lucide-react'
import {
  confirmBookingItemAction,
  rejectBookingItemAction,
  cancelBookingItemAction,
} from '@/actions/provider-bookings'

interface BookingActionsProps {
  bookingItemId: string
  status: string
}

export function BookingActions({ bookingItemId, status }: BookingActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rejectMessage, setRejectMessage] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await confirmBookingItemAction(bookingItemId)
      if (result.error) showFeedback('error', result.error)
      else showFeedback('success', result.success!)
    })
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectBookingItemAction(bookingItemId, rejectMessage)
      if (result.error) showFeedback('error', result.error)
      else {
        showFeedback('success', result.success!)
        setRejectOpen(false)
        setRejectMessage('')
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelBookingItemAction(bookingItemId, cancelReason)
      if (result.error) showFeedback('error', result.error)
      else {
        showFeedback('success', result.success!)
        setCancelOpen(false)
        setCancelReason('')
      }
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      {feedback && (
        <p className={`text-xs ${feedback.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
          {feedback.message}
        </p>
      )}

      {status === 'pending' && (
        <div className="flex gap-2">
          <Button size="sm" onClick={handleConfirm} disabled={isPending}>
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            Confirmar
          </Button>
          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isPending}>
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Rechazar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rechazar reserva</DialogTitle>
                <DialogDescription>
                  Indica al cliente el motivo del rechazo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="reject-msg">Motivo</Label>
                <Textarea
                  id="reject-msg"
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  placeholder="Ej: No hay disponibilidad para esa fecha..."
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleReject} disabled={isPending || !rejectMessage.trim()}>
                  Confirmar rechazo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {status === 'confirmed' && (
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isPending}>
              <Ban className="mr-1 h-3.5 w-3.5" />
              Cancelar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar reserva confirmada</DialogTitle>
              <DialogDescription>
                Esta accion notificara al cliente. Indica el motivo de la cancelacion.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Motivo</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Condiciones climaticas adversas..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelOpen(false)}>Volver</Button>
              <Button variant="destructive" onClick={handleCancel} disabled={isPending || !cancelReason.trim()}>
                Confirmar cancelacion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
