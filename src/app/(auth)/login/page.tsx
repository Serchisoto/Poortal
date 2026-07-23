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
  const redirectTo = searchParams.get('redirectTo') || ''
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

    let authErr: unknown = null
    try {
      const result = await authClient.signIn.email({ email, password })
      authErr = result.error
    } catch {
      setError('No se pudo conectar al servidor. Intenta de nuevo.')
      setIsPending(false)
      return
    }

    if (authErr) {
      setError('Credenciales invalidas. Verifica tu correo y contrasena.')
      setIsPending(false)
      return
    }

    if (redirectTo) {
      router.push(redirectTo)
      return
    }

    // Role-based redirect — session has the role field
    const session = await authClient.getSession()
    const role = (session?.data?.user as { role?: string } | undefined)?.role
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
              <Label htmlFor="password">Contrasena</Label>
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
