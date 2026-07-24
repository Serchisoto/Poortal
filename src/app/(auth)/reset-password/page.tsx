"use client"

import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle } from 'lucide-react'

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
  const [state, action, isPending] = useActionState(resetPasswordAction, {})

  // Success state
  if (state?.success) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
          <span className="text-2xl font-black tracking-tight">POORTAL</span>
        </div>
        <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center gap-5 pt-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Contrasena actualizada</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tu contrasena fue cambiada exitosamente. Ya puedes iniciar sesion con tu nueva contrasena.
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button className="h-12 w-full text-base font-semibold">
                Iniciar sesion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Invalid/missing token state
  if (!token) {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
          <span className="text-2xl font-black tracking-tight">POORTAL</span>
        </div>
        <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center gap-5 pt-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Enlace invalido</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Este enlace no es valido o ya expiro. Solicita uno nuevo desde la pantalla de recuperacion.
              </p>
            </div>
            <Link href="/forgot-password" className="w-full">
              <Button className="h-12 w-full text-base font-semibold">
                Solicitar nuevo enlace
              </Button>
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              Volver al inicio de sesion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Main reset form
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Brand header */}
      <div className="bg-primary px-6 pb-8 pt-12 text-primary-foreground">
        <Link href="/" className="mb-6 block">
          <span className="text-2xl font-black tracking-tight">POORTAL</span>
        </Link>
        <h1 className="text-2xl font-bold leading-tight">Nueva contrasena</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">
          Elige una contrasena segura de al menos 8 caracteres
        </p>
      </div>

      {/* Form card */}
      <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pb-10 pt-7 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {state?.error && (
          <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nueva contrasena</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Minimo 8 caracteres"
              required
              autoFocus
              autoComplete="new-password"
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? 'Guardando...' : 'Guardar contrasena'}
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-muted-foreground hover:underline"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    </div>
  )
}
