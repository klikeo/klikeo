import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="ticket-perforated-top bg-surface px-4 py-8 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-text-secondary">
          © {new Date().getFullYear()} Klikeo · Todos los derechos reservados.
        </p>
        <div className="flex flex-col gap-3 text-xs font-mono uppercase tracking-wide sm:flex-row sm:items-center sm:gap-6 sm:border-l sm:border-dashed sm:border-border sm:pl-6">
          <Link href="/politicas-de-privacidad" className="text-primary transition-colors hover:text-primary-hover">
            Políticas de privacidad
          </Link>
          <Link href="/negocios" className="text-text-secondary transition-colors hover:text-primary">
            Explorar negocios
          </Link>
          <Link href="/login" className="text-text-secondary transition-colors hover:text-primary">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </footer>
  )
}