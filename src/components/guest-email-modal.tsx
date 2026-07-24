'use client'

import { useState } from 'react'
import { X, Mail, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GuestEmailModalProps {
  onConfirm: (email: string, name: string) => void
  onClose: () => void
  loading?: boolean
}

export function GuestEmailModal({ onConfirm, onClose, loading = false }: GuestEmailModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setError(null)
    onConfirm(trimmedEmail, name.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl px-6 pt-6 pb-10 sm:pb-6 z-10">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 active:scale-95 transition-transform"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-1">Continuar como invitado</h2>
        <p className="text-sm text-slate-500 mb-6">
          Te enviaremos la confirmación y tu ticket a este correo.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre (opcional)"
              className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="tu@correo.com"
              required
              autoFocus
              className={cn(
                'w-full pl-10 pr-4 py-3 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-1 transition-colors placeholder:text-slate-400',
                error
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
              )}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white font-semibold text-sm py-3.5 rounded-xl active:scale-[0.98] transition-all disabled:opacity-60 mt-1"
          >
            {loading ? 'Procesando...' : 'Confirmar y continuar'}
          </button>

          <p className="text-center text-xs text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-teal-700 font-medium underline underline-offset-2">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
