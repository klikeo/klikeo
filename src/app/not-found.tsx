import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary/10 select-none">
            404
          </div>
          <div className="text-6xl -mt-16 text-text/80">
            🌍
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-text mb-3">
          Página no encontrada
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida. 
         Quizás buscabas uno de estos enlaces:
        </p>

        {/* Links */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Ir al inicio
          </Link>
          <Link 
            href="/negocios"
            className="block w-full py-3 px-6 bg-surface border border-border text-text rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Explorar negocios
          </Link>
          <Link 
            href="/login"
            className="block w-full py-3 px-6 text-muted hover:text-primary transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}