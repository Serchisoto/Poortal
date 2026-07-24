"use client"

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  // Support both ?redirectTo= and ?next= (used in different parts of the app)
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('next') || ''
  const authError = searchParams.get('error')
  const router = useRouter()

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

    // Flush RSC cache so server components (admin layout auth check) see the new session
    router.refresh()

    // Determine destination
    const role = (result?.data?.user as { role?: string } | undefined)?.role

    if (redirectTo) {
      router.push(redirectTo)
      return
    }

    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'provider') router.push('/provider/dashboard')
    else router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Iniciar Sesion</CardTitle>
          <CardDescription>
            Ingresa a tu cuenta de POORTAL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || authError) && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error || 'Error de autenticacion. Intenta de nuevo.'}
            </div>
          )}

          <div className="relative">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Inicia sesion con email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
                suppressHydrationWarning
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contrasena</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
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
                suppressHydrationWarning
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Ingresando...' : 'Iniciar Sesion'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            No tienes cuenta?{' '}
            <Link
              href={`/register${redirectTo ? `?redirectTo=${redirectTo}` : ''}`}
              className="font-medium text-primary hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
