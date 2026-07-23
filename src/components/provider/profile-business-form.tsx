'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateBusinessInfoAction } from '@/actions/provider-profile'
import { toast } from 'sonner'
type ProviderFields = {
  business_name: string
  legal_name: string | null
  tax_id: string | null
  phone: string
  customer_phone: string | null
  website: string | null
  full_address: string | null
  short_description: string
}

type Props = { provider: ProviderFields }

export function ProfileBusinessForm({ provider }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    startTransition(async () => {
      const result = await updateBusinessInfoAction(new FormData(form))
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Información actualizada')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="business_name">Nombre del negocio *</Label>
          <Input id="business_name" name="business_name" defaultValue={provider.business_name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="legal_name">Razón social</Label>
          <Input id="legal_name" name="legal_name" defaultValue={provider.legal_name ?? ''} placeholder="Opcional" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tax_id">RFC</Label>
          <Input id="tax_id" name="tax_id" defaultValue={provider.tax_id ?? ''} placeholder="Opcional" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input id="phone" name="phone" defaultValue={provider.phone} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customer_phone">Teléfono de atención</Label>
          <Input id="customer_phone" name="customer_phone" defaultValue={provider.customer_phone ?? ''} placeholder="Opcional" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Sitio web</Label>
          <Input id="website" name="website" defaultValue={provider.website ?? ''} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="full_address">Dirección completa</Label>
        <Input id="full_address" name="full_address" defaultValue={provider.full_address ?? ''} placeholder="Calle, número, colonia, ciudad" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="short_description">Descripción corta *</Label>
        <Textarea
          id="short_description"
          name="short_description"
          defaultValue={provider.short_description}
          rows={3}
          required
          placeholder="Describe brevemente tu negocio..."
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
