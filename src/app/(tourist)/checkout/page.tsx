import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { CreditCard, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.cart}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al carrito
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Completa tu compra de forma segura
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Payment form area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informacion de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  La integracion con Stripe se agregara en la Fase 3
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aqui se mostrara el formulario de pago seguro
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="text-muted-foreground">$-- MXN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Comision de servicio</span>
                <span className="text-muted-foreground">$-- MXN</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>$-- MXN</span>
              </div>
              <Button className="w-full mt-4" size="lg" disabled>
                Pagar ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
