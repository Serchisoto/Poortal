"use client"

import { Suspense, useActionState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const router = useRouter()
  const [state, action, isPending] = useActionState(resetPasswordAction, {})

  if (state?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Listo!</CardTitle>
            <CardDescription>Tu contrasena fue actualizada exitosamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push('/login')}>
              Iniciar sesion
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Enlace invalido</CardTitle>
            <CardDescription>
              Este enlace no es valido o ya expiro. Solicita uno nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password">
              <Button className="w-full">Solicitar nuevo enlace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Nueva contrasena</CardTitle>
          <CardDescription>Elige una contrasena segura de al menos 8 caracteres.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contrasena</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Minimo 8 caracteres"
                required
                autoFocus
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar contrasena'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:underline">
            Volver al inicio de sesion
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
