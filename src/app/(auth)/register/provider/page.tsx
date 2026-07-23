"use client"

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Store } from 'lucide-react'
import type { Category } from '@/types'

const providerFormSchema = z
  .object({
    business_name: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
    representative_name: z.string().min(2, 'El nombre del representante es requerido'),
    email: z.string().email('Ingresa un correo electrónico válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirm_password: z.string(),
    phone: z
      .string()
      .min(10, 'El teléfono debe tener al menos 10 dígitos')
      .regex(/^[+\d\s\-()]+$/, 'Formato de teléfono inválido'),
    location: z.string().min(2, 'La ubicación es requerida'),
    category_id: z.string().uuid('Selecciona una categoría'),
    short_description: z
      .string()
      .min(10, 'La descripción debe tener al menos 10 caracteres')
      .max(300, 'La descripción no puede exceder 300 caracteres'),
    accept_terms: z.literal(true, { message: 'Debes aceptar los términos y condiciones' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })

type FieldErrors = Partial<Record<keyof z.infer<typeof providerFormSchema>, string>>

export default function ProviderRegistrationPage() {
  return (
    <Suspense>
      <ProviderRegistrationForm />
    </Suspense>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

function ProviderRegistrationForm() {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isPending, setIsPending] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [acceptTerms, setAcceptTerms] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(({ categories }) => setCategories(categories ?? []))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGlobalError(null)
    setFieldErrors({})

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value

    const raw = {
      business_name: getValue('business_name'),
      representative_name: getValue('representative_name'),
      email: getValue('email'),
      password: getValue('password'),
      confirm_password: getValue('confirm_password'),
      phone: getValue('phone'),
      location: getValue('location'),
      category_id: selectedCategory,
      short_description: getValue('short_description'),
      accept_terms: acceptTerms as true,
    }

    const result = providerFormSchema.safeParse(raw)
    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (field && !errors[field]) errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setIsPending(true)

    const { data, error: authErr } = await authClient.signUp.email({
      email: result.data.email,
      password: result.data.password,
      name: result.data.representative_name,
    })

    if (authErr) {
      setGlobalError(
        authErr.message?.includes('already')
          ? 'Este correo ya está registrado. Intenta iniciar sesión.'
          : 'Error al crear la cuenta. Intenta de nuevo.'
      )
      setIsPending(false)
      return
    }

    const res = await fetch('/api/auth/create-provider-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data?.user?.id,
        full_name: result.data.representative_name,
        email: result.data.email,
        phone: result.data.phone,
        business_name: result.data.business_name,
        representative_name: result.data.representative_name,
        location: result.data.location,
        category_id: result.data.category_id,
        short_description: result.data.short_description,
      }),
    })

    if (!res.ok) {
      const body = await res.json()
      setGlobalError(body.error ?? 'Error al registrar el negocio. Intenta de nuevo.')
      setIsPending(false)
      return
    }

    router.push('/provider/onboarding')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Registra tu Negocio</CardTitle>
          <CardDescription>
            Únete a POORTAL y conecta con miles de turistas. Crea tu cuenta de proveedor para iniciar tu solicitud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {globalError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="business_name">Nombre del negocio o marca *</Label>
              <Input
                id="business_name"
                name="business_name"
                placeholder="Ej: Cabo Adventures"
              />
              <FieldError message={fieldErrors.business_name} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="representative_name">Nombre del representante *</Label>
              <Input
                id="representative_name"
                name="representative_name"
                placeholder="Nombre completo"
              />
              <FieldError message={fieldErrors.representative_name} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contacto@negocio.com"
                autoComplete="email"
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
                <FieldError message={fieldErrors.password} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm_password">Confirmar contraseña *</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />
                <FieldError message={fieldErrors.confirm_password} />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Número de teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 624 123 4567"
              />
              <FieldError message={fieldErrors.phone} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="location">Ubicación principal *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Cabo San Lucas, BCS"
              />
              <FieldError message={fieldErrors.location} />
            </div>

            <div className="space-y-1">
              <Label>Categoría del servicio *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={fieldErrors.category_id} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="short_description">
                Descripción breve del servicio * ({charCount}/300)
              </Label>
              <Textarea
                id="short_description"
                name="short_description"
                placeholder="Describe brevemente los servicios que ofreces..."
                maxLength={300}
                rows={3}
                onChange={(e) => setCharCount(e.target.value.length)}
              />
              <FieldError message={fieldErrors.short_description} />
            </div>

            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="accept_terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <Label htmlFor="accept_terms" className="text-sm leading-tight">
                  Acepto los{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Términos y Condiciones para Proveedores
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                </Label>
              </div>
              <FieldError message={fieldErrors.accept_terms} />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creando cuenta...' : 'Crear cuenta de proveedor'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
