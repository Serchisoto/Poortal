'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfileAction } from '@/actions/profile'
import { toast } from 'sonner'

type Props = {
  fullName: string | null
  phone: string | null
}

export function EditProfileForm({ fullName, phone }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Perfil actualizado')
        setOpen(false)
      }
    })
  }

  if (!open) {
    return (
      <Button className="w-full" onClick={() => setOpen(true)}>
        Editar perfil
      </Button>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={fullName ?? ''}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={phone ?? ''}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
