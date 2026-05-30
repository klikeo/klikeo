import Link from 'next/link'

export const metadata = {
  title: 'Políticas de privacidad — Klikeo',
  description: 'Lee las políticas de privacidad de Klikeo y cómo protegemos tus datos personales.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-6">
        <p className="text-sm text-muted">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors">
            Inicio
          </Link>{' '}
          / Políticas de privacidad
        </p>

        <h1 className="text-4xl font-bold text-primary">Políticas de privacidad</h1>

        <p className="text-base leading-7 text-text">
          En Klikeo valoramos tu privacidad. Esta página describe qué información recopilamos, por qué la usamos y cómo la protegemos cuando interactúas con nuestros servicios.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">1. Información que recopilamos</h2>
            <p className="mt-3 text-text leading-7">
              Recopilamos información que tú nos proporcionas directamente, como tu nombre, correo electrónico y datos de contacto de tu negocio cuando te registras. También recopilamos datos sobre tu uso del sitio para mejorar la experiencia.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">2. Cómo usamos tu información</h2>
            <p className="mt-3 text-text leading-7">
              Utilizamos tus datos para gestionar tu cuenta, responder a tus consultas, mostrarte negocios relevantes y enviar comunicaciones relacionadas con tu uso de Klikeo. No compartimos tus datos con terceros para fines de marketing sin tu consentimiento.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">3. Seguridad</h2>
            <p className="mt-3 text-text leading-7">
              Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración. Sin embargo, ningún sistema es completamente infalible.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">4. Cookies y tecnologías similares</h2>
            <p className="mt-3 text-text leading-7">
              Podemos usar cookies para mejorar la navegación, mostrar contenido relevante y analizar el uso del sitio. Puedes controlar las cookies desde la configuración de tu navegador.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">5. Tus derechos</h2>
            <p className="mt-3 text-text leading-7">
              Tienes derecho a acceder, rectificar o eliminar tus datos personales. Si deseas ejercer estos derechos, contáctanos a través de los canales disponibles en el sitio.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">6. Cambios en esta política</h2>
            <p className="mt-3 text-text leading-7">
              Actualizaremos esta política cuando sea necesario. La fecha de la última revisión estará reflejada en esta página.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
