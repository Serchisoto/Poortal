import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeadphonesIcon, MessageSquare, FileText, ExternalLink, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Soporte' }

const faqs = [
  {
    q: '¿Como se calculan mis ingresos?',
    a: 'Recibes el 85% del monto de cada reserva completada. El 15% restante es la comision de la plataforma que cubre procesamiento de pagos, soporte al cliente y mantenimiento de la app.',
  },
  {
    q: '¿Cuando recibo el pago de una reserva?',
    a: 'Los pagos se transfieren a tu cuenta de Stripe Connect dentro de los 7 dias posteriores a la fecha del servicio, una vez que el status de la reserva cambia a "Completada".',
  },
  {
    q: '¿Que pasa si cancelo una reserva confirmada?',
    a: 'Segun tu politica de cancelacion, el cliente puede recibir un reembolso total o parcial. Las cancelaciones frecuentes pueden afectar tu posicionamiento en la plataforma.',
  },
  {
    q: '¿Como puedo pausar mis experiencias temporalmente?',
    a: 'Desde la seccion "Experiencias", edita cualquier experiencia y cambia su estado a "Pausada". Esto ocultara la experiencia del catalogo sin eliminarla.',
  },
  {
    q: '¿Que debo hacer si un turista no se presenta?',
    a: 'Marca la reserva como "No show" desde el detalle de la reserva. El sistema registrara el incidente y aplicara la politica de cancelacion correspondiente.',
  },
]

export default async function ProviderSupportPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const statusInfo = provider.status === 'active'
    ? { label: 'Activo', variant: 'default' as const, description: 'Tu cuenta esta activa y puedes recibir reservas.' }
    : provider.status === 'pending_review'
    ? { label: 'En revision', variant: 'secondary' as const, description: 'Tu cuenta esta siendo revisada por el equipo de Poortal.' }
    : provider.status === 'approved_incomplete'
    ? { label: 'Aprobado - Incompleto', variant: 'secondary' as const, description: 'Cuenta aprobada. Completa tu perfil y configura Stripe.' }
    : { label: provider.status, variant: 'outline' as const, description: '' }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <HeadphonesIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Soporte</h1>
          <p className="text-muted-foreground">Centro de ayuda para proveedores</p>
        </div>
      </div>

      {/* Account status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado de tu cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{provider.business_name}</span>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            {statusInfo.description && (
              <p className="mt-1 text-sm text-muted-foreground">{statusInfo.description}</p>
            )}
            {provider.rejection_reason && (
              <p className="mt-2 text-sm text-destructive">Motivo: {provider.rejection_reason}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Stripe:</span>
            <Badge variant={provider.stripe_onboarding_complete ? 'default' : 'outline'} className="text-xs">
              {provider.stripe_onboarding_complete ? 'Conectado' : 'Pendiente'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">Correo electronico</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Respuesta en menos de 24 horas habiles.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
              <a href="mailto:proveedores@poortal.mx">
                <Mail className="h-3.5 w-3.5" />
                proveedores@poortal.mx
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">WhatsApp</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Soporte rapido en horario de oficina (Lun-Vie 9am-6pm CST).
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
              <a href="https://wa.me/529981234567" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-3.5 w-3.5" />
                Abrir WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">Documentacion</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Guias detalladas para gestionar tu perfil y experiencias.
            </p>
            <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Ver guias
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Preguntas frecuentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-1.5 pb-4 border-b last:border-0 last:pb-0">
              <p className="font-medium text-sm">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
