import { CheckCircle2, Clock3, BrainCircuit, Smartphone, Globe, ShieldCheck } from "lucide-react";
import Container from "@/src/components/ui/Container";
import Section from "@/src/components/ui/Section";

const benefits = [
  { icon: Clock3, title: "Disponible 24/7", description: "Tu negocio responde clientes incluso cuando estás descansando." },
  { icon: BrainCircuit, title: "IA entrenada", description: "Aprende sobre tus servicios, horarios, precios y productos." },
  { icon: Smartphone, title: "WhatsApp integrado", description: "Tus clientes hablan desde la aplicación que ya utilizan todos los días." },
  { icon: Globe, title: "Página web incluida", description: "Cada negocio obtiene una página profesional optimizada para Google." },
  { icon: ShieldCheck, title: "Información segura", description: "Administra tu negocio desde un panel privado con acceso protegido." },
  { icon: CheckCircle2, title: "Configuración sencilla", description: "Empieza en pocos minutos sin conocimientos técnicos." },
];

export default function Benefits() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-mono text-primary uppercase tracking-widest text-sm">Todo incluido</span>
          <h2 className="mt-5 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-text">
            Una plataforma para administrar
            <br />
            todo tu negocio.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-7 sm:leading-8">
            Klikeo reúne en un solo lugar tu página web, tu asistente con IA,
            WhatsApp, estadísticas y la administración de tu negocio.
          </p>
        </div>

        <div className="grid gap-5 mt-12 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-dashed border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary"
              >
                <div className="stamp-tilt flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary sm:h-14 sm:w-14">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-text sm:mt-6 sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-6 sm:mt-4 sm:text-base sm:leading-7">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}