"use client"

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, {})

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Restablecer contrasena</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos un enlace para crear una nueva contrasena.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state?.success && (
            <div className="rounded-md bg-teal-50 border border-teal-200 p-3 text-sm text-teal-800">
              {state.success}
            </div>
          )}
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {!state?.success && (
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electronico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Recordaste tu contrasena?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Iniciar sesion
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
