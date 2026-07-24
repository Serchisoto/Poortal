'use client'

import { useState, useTransition } from 'react'
import { promoteToAdmin } from '@/actions/promote-admin'
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    startTransition(async () => {
      const res = await promoteToAdmin(email)
      setResult(res)
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-teal-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Configurar Admin</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingresa el email de la cuenta que quieres promover a administrador.
            La cuenta debe existir — registrate primero en{' '}
            <a href="/register" className="text-teal-700 underline">/register</a>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Email de la cuenta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoFocus
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={pending || !email}
            className="bg-teal-700 disabled:bg-slate-300 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? 'Procesando...' : 'Promover a Admin'}
          </button>
        </form>

        {/* Result */}
        {result?.success && (
          <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4">
            <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-teal-800">{result.success}</p>
              <a
                href="/admin/dashboard"
                className="text-xs text-teal-700 underline font-medium"
              >
                Ir al panel de admin
              </a>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{result.error}</p>
          </div>
        )}

        <p className="text-[11px] text-slate-400 text-center">
          Esta pagina es solo para bootstrap inicial. Una vez que tengas un admin,
          gestiona roles desde <span className="font-medium">/admin/users</span>.
        </p>
      </div>
    </div>
  )
}
