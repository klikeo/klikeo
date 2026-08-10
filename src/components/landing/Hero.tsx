import Button from "@/src/components/ui/Button";
import Container from "@/src/components/ui/Container";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Container>
        <div className="max-w-4xl mx-auto text-center">

          <div className="stamp-tilt inline-flex items-center gap-2 rounded-full border-2 border-dashed border-stamp px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-stamp">
            <span className="h-1.5 w-1.5 rounded-full bg-stamp" />
            IA activa · atiende 24/7
          </div>

          <h1 className="mt-8 font-heading text-5xl md:text-7xl font-semibold tracking-tight leading-tight text-text">
            Tu negocio
            <br />
            <span className="text-primary">nunca deja de vender.</span>
          </h1>

          <p className="mt-8 text-xl text-text-secondary max-w-2xl mx-auto leading-9">
            Crea una página profesional para tu negocio y responde automáticamente
            a tus clientes por WhatsApp con inteligencia artificial, incluso cuando
            estás ocupado.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Button href="/register">Crear mi negocio</Button>
            <Button href="/negocios" variant="secondary">Explorar negocios</Button>
          </div>

        </div>

        <div className="mt-24">
          <DashboardPreview />
        </div>
      </Container>
    </section>
  );
}