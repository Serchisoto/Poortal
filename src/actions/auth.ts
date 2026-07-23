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

// Placeholder — forgotPassword not yet implemented with Better Auth
export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  if (!email) return { error: 'Correo requerido.' }

  // TODO: implement with Better Auth email verification plugin
  return { success: 'Si el correo existe, recibiras instrucciones en breve.' }
}
