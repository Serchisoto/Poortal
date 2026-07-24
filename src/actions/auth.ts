'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export type AuthActionState = {
  error?: string
  success?: string
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() })
  redirect('/login')
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) return { error: 'Correo requerido.' }

  const appURL =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL) ??
    'http://localhost:3000'

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${appURL}/reset-password`,
      },
    })
  } catch (err) {
    console.error('[forgotPassword]', err)
    // Always return a neutral message to avoid email enumeration
  }

  return { success: 'Si el correo existe, recibiras un enlace en breve. Revisa tu bandeja de entrada.' }
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const token = formData.get('token') as string
  const newPassword = formData.get('newPassword') as string

  if (!token || !newPassword) return { error: 'Datos incompletos.' }
  if (newPassword.length < 8) return { error: 'La contrasena debe tener al menos 8 caracteres.' }

  try {
    await auth.api.resetPassword({
      body: { token, newPassword },
    })
  } catch (err) {
    console.error('[resetPassword]', err)
    return { error: 'El enlace es invalido o ya expiro. Solicita uno nuevo.' }
  }

  return { success: 'Contrasena actualizada. Ya puedes iniciar sesion.' }
}
