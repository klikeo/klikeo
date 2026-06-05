import Link from "next/link"
import AuthGuard from "../components/AuthGuard"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default function LandingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-20 px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight">
            Tu negocio en Colombia,
            <br />
            <span className="text-primary">atendiendo 24/7</span>
          </h1>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Crea tu perfil público y activa un chatbot de WhatsApp personalizado
            que responde preguntas de tus clientes mientras tú duermes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-primary text-white px-7 py-3.5 rounded-lg no-underline text-base font-semibold min-h-44px inline-flex items-center hover:bg-primary-dark transition-colors"
            >
              Registrar mi negocio gratis
            </Link>
            <Link
              href="/negocios"
              className="bg-surface text-primary px-7 py-3.5 rounded-lg no-underline text-base font-semibold border border-primary min-h-44px inline-flex items-center hover:bg-primary/5 transition-colors"
            >
              Explorar negocios
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12 text-text">
              ¿Por qué Klikeo?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🏪",
                  title: "Perfil público descubrible",
                  desc: "Tus clientes te encuentran por categoría, ciudad o nombre en segundos.",
                },
                {
                  icon: "🤖",
                  title: "Chatbot de WhatsApp IA",
                  desc: "Entrena tu asistente con datos de tu negocio y atiende clientes sin intervención.",
                },
                {
                  icon: "📊",
                  title: "Panel de control",
                  desc: "Ve todas las conversaciones, estadísticas y actualiza tu información fácilmente.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-8 bg-background rounded-xl text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-3 text-text">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-text">
            ¿Listo para crecer?
          </h2>
          <p className="text-base text-muted mb-8">
            Únete a los primeros negocios en Klikeo. Gratis durante el MVP.
          </p>
          <Link
            href="/register"
            className="bg-secondary text-white px-8 py-3.5 rounded-lg no-underline text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Comenzar ahora →
          </Link>
        </section>

        <Footer />
      </div>
    </AuthGuard>
  )
}
