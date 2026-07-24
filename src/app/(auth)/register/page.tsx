"use client"

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un correo electronico valido'),
    phone: z
      .string()
      .refine(
        (val) => val === '' || /^[+\d\s\-()]{10,}$/.test(val),
        'Formato de telefono invalido (minimo 10 digitos)'
      )
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'La contrasena debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
      .regex(/[0-9]/, 'Debe contener al menos un numero'),
    confirm_password: z.string(),
    accept_terms: z.literal(true, { message: 'Debes aceptar los terminos y condiciones' }),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Las contrasenas no coinciden',
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
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

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

    const parsed = registerSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (field && !errors[field]) errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setIsPending(true)

    const { data, error: authErr } = await authClient.signUp.email({
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.full_name,
    })

    if (authErr) {
      setGlobalError(
        authErr.message?.toLowerCase().includes('already')
          ? 'Este correo ya esta registrado. Intenta iniciar sesion.'
          : 'Error al crear la cuenta. Intenta de nuevo.'
      )
      setIsPending(false)
      return
    }

    // Create the profile row. The session cookie is now set by signUp, so we
    // pass the userId directly — the API route also accepts it from the session.
    if (data?.user?.id) {
      await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: data.user.id,
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
        }),
      }).catch(() => {
        // Profile creation failure is non-fatal — it will be retried on next login
      })
    }

    // Full page navigation forces the browser to send the new session cookie,
    // so all server components (layouts, auth guards) see the session immediately.
    window.location.href = redirectTo
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Brand header */}
      <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
        <Link href="/" className="mb-6 block">
          <span className="text-2xl font-black tracking-tight">POORTAL</span>
        </Link>
        <h1 className="text-2xl font-bold leading-tight">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Reserva experiencias increibles en Mexico
        </p>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {globalError && (
          <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Nombre completo</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Tu nombre completo"
              autoComplete="name"
              className="h-12"
            />
            <FieldError message={fieldErrors.full_name} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              className="h-12"
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Telefono <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+52 624 123 4567"
              autoComplete="tel"
              className="h-12"
            />
            <FieldError message={fieldErrors.phone} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contrasena</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimo 8 caracteres"
              autoComplete="new-password"
              className="h-12"
            />
            <FieldError message={fieldErrors.password} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirmar contrasena</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Repite tu contrasena"
              autoComplete="new-password"
              className="h-12"
            />
            <FieldError message={fieldErrors.confirm_password} />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept_terms"
                checked={acceptTerms}
                onCheckedChange={(v) => setAcceptTerms(v === true)}
                className="mt-0.5"
              />
              <Label htmlFor="accept_terms" className="text-sm leading-relaxed font-normal">
                Acepto los{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Terminos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link href="#" className="font-medium text-primary hover:underline">
                  Politica de Privacidad
                </Link>
              </Label>
            </div>
            <FieldError message={fieldErrors.accept_terms} />
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ya tienes cuenta?{' '}
          <Link
            href={`/login${redirectTo !== '/' ? `?redirectTo=${redirectTo}` : ''}`}
            className="font-semibold text-primary hover:underline"
          >
            Iniciar sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
