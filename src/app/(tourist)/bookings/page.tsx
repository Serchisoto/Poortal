import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarCheck } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export const metadata = {
  title: 'Mis Reservas',
}

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Mis Reservas</h1>
        <p className="mt-1 text-muted-foreground">
          Consulta el estado de tus reservas y experiencias pasadas
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20">
        <CalendarCheck className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No tienes reservas aun</h2>
        <p className="mt-2 max-w-sm text-center text-muted-foreground">
          Cuando reserves una experiencia, podras ver el detalle y el estado
          de tus reservas aqui
        </p>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.explore}>Explorar experiencias</Link>
        </Button>
      </div>
    </div>
  )
}
