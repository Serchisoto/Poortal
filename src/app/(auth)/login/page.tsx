"use client"

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('next') || ''
  const authError = searchParams.get('error')

  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    let result: Awaited<ReturnType<typeof authClient.signIn.email>> | null = null
    try {
      result = await authClient.signIn.email({ email, password })
    } catch {
      setError('No se pudo conectar al servidor. Intenta de nuevo.')
      setIsPending(false)
      return
    }

    if (result?.error) {
      setError('Credenciales invalidas. Verifica tu correo y contrasena.')
      setIsPending(false)
      return
    }

    // Full page navigation commits the session cookie before the server renders
    // the next route, avoiding the "session not found" redirect loop.
    const role = (result?.data?.user as { role?: string } | undefined)?.role

    if (redirectTo) {
      window.location.href = redirectTo
      return
    }

    if (role === 'admin') window.location.href = '/admin/dashboard'
    else if (role === 'provider') window.location.href = '/provider/dashboard'
    else window.location.href = '/'
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Brand header */}
      <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
        <Link href="/" className="mb-6 block">
          <span className="text-2xl font-black tracking-tight">POORTAL</span>
        </Link>
        <h1 className="text-2xl font-bold leading-tight">Bienvenido de vuelta</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Inicia sesion para continuar
        </p>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {(error || authError) && (
          <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {error || 'Error de autenticacion. Intenta de nuevo.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="h-12"
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contrasena</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Olvidaste tu contrasena?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Tu contrasena"
              required
              autoComplete="current-password"
              className="h-12"
              suppressHydrationWarning
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? 'Ingresando...' : 'Iniciar sesion'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          No tienes cuenta?{' '}
          <Link
            href={`/register${redirectTo ? `?redirectTo=${redirectTo}` : ''}`}
            className="font-semibold text-primary hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}
