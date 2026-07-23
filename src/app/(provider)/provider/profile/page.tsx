import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Settings, FileText, CreditCard, Bell, Shield, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react'
import { ProfileBusinessForm } from '@/components/provider/profile-business-form'
import { signOutAction } from '@/actions/auth'

export const metadata = { title: 'Mi Perfil' }

const docTypeLabels: Record<string, string> = {
  government_id: 'Identificación oficial',
  proof_of_address: 'Comprobante de domicilio',
  business_license: 'Licencia de negocio',
  insurance: 'Seguro',
  other: 'Otro',
}

const docStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle }> = {
  approved: { label: 'Aprobado', variant: 'default', icon: CheckCircle },
  pending: { label: 'En revisión', variant: 'secondary', icon: Clock },
  rejected: { label: 'Rechazado', variant: 'destructive', icon: XCircle },
}

export default async function ProviderProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const documents = await prisma.provider_documents.findMany({
    where: { provider_id: provider.id },
    orderBy: { created_at: 'desc' },
  })

  const approvedDocs = documents.filter(d => d.status === 'approved').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona la información de tu negocio</p>
        </div>
      </div>

      {/* Status banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between pt-4 pb-4">
          <div>
            <p className="font-semibold">{provider.business_name}</p>
            <p className="text-sm text-muted-foreground">{provider.representative_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
              {provider.status === 'active' ? 'Activo' :
               provider.status === 'pending_review' ? 'En revisión' :
               provider.status === 'suspended' ? 'Suspendido' : provider.status}
            </Badge>
            {provider.stripe_onboarding_complete && (
              <Badge variant="outline" className="text-green-700 border-green-400">
                Stripe ✓
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="negocio">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="negocio" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" />
            Datos del negocio
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Documentación
            {documents.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 h-4">
                {approvedDocs}/{documents.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pagos" className="gap-1.5 text-xs">
            <CreditCard className="h-3.5 w-3.5" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* ── Datos del negocio ─────────────────────────────────────────────── */}
        <TabsContent value="negocio" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del negocio</CardTitle>
              <p className="text-sm text-muted-foreground">Esta información es visible para los turistas</p>
            </CardHeader>
            <CardContent>
              <ProfileBusinessForm provider={provider} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documentación ─────────────────────────────────────────────────── */}
        <TabsContent value="documentos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos de verificación</CardTitle>
              <p className="text-sm text-muted-foreground">
                {approvedDocs} de {documents.length} documentos aprobados
              </p>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">No hay documentos registrados</p>
                  <p className="text-xs text-muted-foreground">Contacta a soporte para subir tus documentos</p>
                </div>
              ) : (
                <div className="divide-y">
                  {documents.map((doc) => {
                    const statusCfg = docStatusConfig[doc.status] ?? docStatusConfig.pending
                    const StatusIcon = statusCfg.icon
                    return (
                      <div key={doc.id} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 shrink-0 ${
                            doc.status === 'approved' ? 'text-green-600' :
                            doc.status === 'rejected' ? 'text-red-500' :
                            'text-amber-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{docTypeLabels[doc.type] ?? doc.type}</p>
                            {doc.rejection_reason && (
                              <p className="text-xs text-red-600 mt-0.5">{doc.rejection_reason}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Pagos ─────────────────────────────────────────────────────────── */}
        <TabsContent value="pagos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cuenta de pagos</CardTitle>
              <p className="text-sm text-muted-foreground">Gestión de tu cuenta Stripe Connect</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Estado Stripe Connect</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {provider.stripe_account_id
                      ? `Cuenta: ${provider.stripe_account_id.slice(0, 8)}…`
                      : 'Sin cuenta configurada'}
                  </p>
                </div>
                <Badge variant={provider.stripe_onboarding_complete ? 'default' : 'secondary'}>
                  {provider.stripe_onboarding_complete ? 'Activo' : 'Pendiente'}
                </Badge>
              </div>

              {!provider.stripe_onboarding_complete && (
                <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 dark:bg-amber-950/30 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Completa el onboarding de Stripe desde{' '}
                    <a href="/provider/onboarding" className="underline font-medium">configuración</a>{' '}
                    para recibir pagos directamente en tu cuenta bancaria.
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Los pagos se procesan a través de Stripe</p>
                <p>• La plataforma retiene una comisión del 15%</p>
                <p>• Los fondos se transfieren automáticamente al completarse la experiencia</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notificaciones ────────────────────────────────────────────────── */}
        <TabsContent value="notificaciones" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferencias de notificaciones</CardTitle>
              <p className="text-sm text-muted-foreground">Recibe alertas sobre tu actividad</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'nueva_reserva', label: 'Nueva reserva recibida', desc: 'Cuando un turista haga una reserva' },
                  { key: 'reserva_cancelada', label: 'Reserva cancelada', desc: 'Cuando se cancele una reserva' },
                  { key: 'pago_recibido', label: 'Pago recibido', desc: 'Cuando se procese un pago' },
                  { key: 'nueva_resena', label: 'Nueva reseña', desc: 'Cuando un turista deje una reseña' },
                  { key: 'resena_sin_respuesta', label: 'Reseñas sin responder (48h)', desc: 'Recordatorio para responder' },
                  { key: 'liquidacion', label: 'Liquidación procesada', desc: 'Cuando se transfieran fondos' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Próximamente</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Seguridad ─────────────────────────────────────────────────────── */}
        <TabsContent value="seguridad" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seguridad de la cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">Correo electrónico</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <div className="rounded-md bg-muted/50 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Para cambiar tu contraseña o habilitar autenticación de dos factores,
                  usa la opción <strong>"Olvidé mi contraseña"</strong> en la pantalla de inicio de sesión.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <form action={signOutAction} className="pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </form>
    </div>
  )
}
