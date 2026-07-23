"use client"

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un correo electrónico válido'),
    phone: z
      .string()
      .refine(
        (val) => val === '' || /^[+\d\s\-()]{10,}$/.test(val),
        'Formato de teléfono inválido (mínimo 10 dígitos)'
      )
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirm_password: z.string(),
    accept_terms: z.literal(true, { message: 'Debes aceptar los términos y condiciones' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })

type FieldErrors = Partial<Record<keyof z.infer<typeof registerSchema>, string>>

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || ''
  const router = useRouter()

  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isPending, setIsPending] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGlobalError(null)
    setFieldErrors({})

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement).value

    const raw = {
      full_name: getValue('full_name'),
      email: getValue('email'),
      phone: getValue('phone'),
      password: getValue('password'),
      confirm_password: getValue('confirm_password'),
      accept_terms: acceptTerms as true,
    }

    const result = registerSchema.safeParse(raw)
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
      name: result.data.full_name,
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

    if (data?.user?.id) {
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          full_name: result.data.full_name,
          email: result.data.email,
          phone: result.data.phone || null,
        }),
      })
    }

    router.push(redirectTo || '/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate en POORTAL para reservar experiencias increíbles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {globalError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {globalError}
            </div>
          )}

          <div className="relative">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Regístrate con email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Tu nombre completo"
                autoComplete="name"
              />
              <FieldError message={fieldErrors.full_name} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 624 123 4567"
                autoComplete="tel"
              />
              <FieldError message={fieldErrors.phone} />
            </div>

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
                    Términos y Condiciones
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
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link
              href={`/login${redirectTo ? `?redirectTo=${redirectTo}` : ''}`}
              className="font-medium text-primary hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
