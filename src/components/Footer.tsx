import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border text-sm text-muted px-4 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Klikeo. Todos los derechos reservados.</p>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <Link href="/politicas-de-privacidad" className="text-primary hover:text-primary-dark transition-colors">
            Políticas de privacidad
          </Link>
          <Link href="/negocios" className="text-text hover:text-primary transition-colors">
            Explorar negocios
          </Link>
          <Link href="/login" className="text-text hover:text-primary transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </footer>
  )
}
