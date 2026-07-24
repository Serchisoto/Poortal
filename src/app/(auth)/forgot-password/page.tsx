"use client"

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, {})

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Brand header */}
      <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
        <Link href="/login" className="mb-6 flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </Link>
        <h1 className="text-2xl font-bold leading-tight">Recupera tu acceso</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Te enviaremos un enlace para crear una nueva contrasena
        </p>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {state?.success ? (
          <div className="flex flex-col items-center gap-5 pt-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Correo enviado</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {state.success}
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="h-12 w-full">
                Volver al inicio de sesion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {state?.error && (
              <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electronico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold"
                disabled={isPending}
              >
                {isPending ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
