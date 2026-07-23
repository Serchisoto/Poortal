import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary">POORTAL</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu concierge digital para descubrir las mejores experiencias turisticas.
            </p>
          </div>

          {/* Proveedores */}
          <div>
            <h4 className="font-semibold">Proveedores</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register/provider" className="hover:text-foreground">
                  Registra tu negocio
                </Link>
              </li>
              <li>
                <Link href="/provider/dashboard" className="hover:text-foreground">
                  Panel de proveedor
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-semibold">Soporte</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Terminos y condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Politica de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} POORTAL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
