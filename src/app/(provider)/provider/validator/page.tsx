import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getTodayTickets } from '@/actions/tickets'
import { QRValidator } from '@/components/provider/qr-validator'
import { QrCode } from 'lucide-react'

export const metadata = { title: 'Validador QR' }

export default async function ProviderValidatorPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const todayTickets = await getTodayTickets(provider.id)
  const usedCount = todayTickets.filter(t => t.status === 'used').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <QrCode className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Validador QR</h1>
          <p className="text-muted-foreground">
            Verifica tickets de tus experiencias de hoy
          </p>
        </div>
      </div>

      <QRValidator
        todayCount={todayTickets.length}
        usedCount={usedCount}
      />
    </div>
  )
}
