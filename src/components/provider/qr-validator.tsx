'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { validateTicketAction } from '@/actions/tickets'
import type { ValidateResult } from '@/actions/tickets'
import { QrCode, CheckCircle2, XCircle, Camera, Keyboard, Clock } from 'lucide-react'
import { toast } from 'sonner'

type ScanLog = {
  id: string
  timestamp: Date
  qrCode: string
  result: ValidateResult
}

function ResultCard({ result }: { result: ValidateResult | null }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center">
        <QrCode className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-3 text-sm text-muted-foreground">Escanea o ingresa un código QR para validar</p>
      </div>
    )
  }

  if (result.status === 'valid') {
    return (
      <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6 dark:border-green-700 dark:bg-green-950/30">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
          <div>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">✓ Válido</p>
            <p className="text-sm text-green-600 dark:text-green-500">Ticket autorizado</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">Turista:</span> <strong>{result.touristName ?? result.touristEmail}</strong></p>
          <p><span className="text-muted-foreground">Experiencia:</span> <strong>{result.experienceTitle}</strong></p>
          <p><span className="text-muted-foreground">Fecha:</span> <strong>{result.serviceDate}</strong></p>
          <p><span className="text-muted-foreground">Lugares:</span> <strong>{result.quantity}</strong></p>
        </div>
      </div>
    )
  }

  const errorMessages: Record<string, string> = {
    already_used: 'QR ya utilizado',
    wrong_date: 'Fecha incorrecta',
    not_found: 'QR no reconocido',
    cancelled: 'Reserva cancelada',
    unauthorized: 'Sin autorización',
    error: 'Error al validar',
  }

  const label = errorMessages[result.status] ?? 'Inválido'
  const detail =
    result.status === 'already_used' ? `Escaneado: ${new Date(result.scannedAt).toLocaleString('es-MX')}` :
    result.status === 'wrong_date' ? `Fecha del servicio: ${result.serviceDate}` :
    result.status === 'error' ? result.message : undefined

  return (
    <div className="rounded-xl border-2 border-red-400 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
      <div className="flex items-center gap-3 mb-2">
        <XCircle className="h-8 w-8 text-red-600 shrink-0" />
        <div>
          <p className="text-lg font-bold text-red-700 dark:text-red-400">✗ {label}</p>
          {detail && <p className="text-sm text-red-600 dark:text-red-500">{detail}</p>}
        </div>
      </div>
    </div>
  )
}

type Props = {
  todayCount: number
  usedCount: number
}

export function QRValidator({ todayCount, usedCount }: Props) {
  const [mode, setMode] = useState<'manual' | 'camera'>('manual')
  const [manualCode, setManualCode] = useState('')
  const [lastResult, setLastResult] = useState<ValidateResult | null>(null)
  const [log, setLog] = useState<ScanLog[]>([])
  const [isPending, startTransition] = useTransition()
  const [cameraActive, setCameraActive] = useState(false)
  const scannerRef = useRef<any>(null)
  const lastScanRef = useRef<{ code: string; ts: number } | null>(null)
  const scannerContainerId = 'qr-scanner-container'

  async function handleValidate(code: string) {
    const trimmed = code.trim()
    if (!trimmed) return

    startTransition(async () => {
      const result = await validateTicketAction(trimmed)
      setLastResult(result)
      setLog(prev => [{
        id: crypto.randomUUID(),
        timestamp: new Date(),
        qrCode: trimmed.slice(0, 16) + '…',
        result,
      }, ...prev.slice(0, 19)])

      if (result.status === 'valid') {
        toast.success(`Ticket válido: ${result.touristName ?? result.touristEmail}`)
      } else {
        toast.error(
          result.status === 'already_used' ? 'QR ya utilizado' :
          result.status === 'wrong_date' ? 'Fecha incorrecta' :
          result.status === 'cancelled' ? 'Reserva cancelada' :
          'QR no reconocido'
        )
      }

      setManualCode('')
    })
  }

  useEffect(() => {
    if (mode !== 'camera') {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
      setCameraActive(false)
      return
    }

    let stopped = false

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (stopped) return
      const scanner = new Html5QrcodeScanner(
        scannerContainerId,
        { fps: 10, qrbox: { width: 240, height: 240 } },
        false
      )
      scanner.render(
        (decodedText: string) => {
          const now = Date.now()
          const last = lastScanRef.current
          // Deduplicate: ignore same code within 3 seconds
          if (last && last.code === decodedText && now - last.ts < 3000) return
          lastScanRef.current = { code: decodedText, ts: now }
          handleValidate(decodedText)
        },
        () => {}
      )
      scannerRef.current = scanner
      setCameraActive(true)
    }).catch(() => {
      toast.error('No se pudo inicializar la cámara')
      setMode('manual')
    })

    return () => {
      stopped = true
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [mode])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: Scanner */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === 'manual' ? 'default' : 'outline'}
            onClick={() => setMode('manual')}
            className="gap-1.5"
          >
            <Keyboard className="h-4 w-4" />
            Manual
          </Button>
          <Button
            size="sm"
            variant={mode === 'camera' ? 'default' : 'outline'}
            onClick={() => setMode('camera')}
            className="gap-1.5"
          >
            <Camera className="h-4 w-4" />
            Cámara
          </Button>
        </div>

        {mode === 'manual' ? (
          <div className="flex gap-2">
            <Input
              placeholder="Pega el código QR aquí..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidate(manualCode)}
              disabled={isPending}
              className="font-mono text-sm"
            />
            <Button onClick={() => handleValidate(manualCode)} disabled={isPending || !manualCode.trim()}>
              {isPending ? 'Validando...' : 'Validar'}
            </Button>
          </div>
        ) : (
          <div id={scannerContainerId} className="w-full" />
        )}

        <ResultCard result={lastResult} />
      </div>

      {/* Right: Stats + Log */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Asistencia hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total tickets</span>
              <span className="font-semibold">{todayCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Validados</span>
              <span className="font-semibold text-green-600">{usedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pendientes</span>
              <span className="font-semibold">{todayCount - usedCount}</span>
            </div>
            {todayCount > 0 && (
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${Math.min(100, (usedCount / todayCount) * 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Log de escaneos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Sin escaneos aún</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {log.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2 text-xs">
                    {entry.result.status === 'valid'
                      ? <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                      : <XCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className="font-mono truncate text-muted-foreground">{entry.qrCode}</p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {entry.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        {' — '}
                        <Badge variant={entry.result.status === 'valid' ? 'default' : 'destructive'} className="text-[9px] py-0 h-3.5">
                          {entry.result.status === 'valid' ? 'OK' : 'ERR'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
