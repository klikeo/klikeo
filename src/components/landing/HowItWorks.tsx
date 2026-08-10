import { Store, Bot, Rocket } from "lucide-react";
import Section from "@/src/components/ui/Section";
import Container from "@/src/components/ui/Container";

const colorClasses: Record<string, string> = {
  primary: "border-primary text-primary",
  carbon: "border-carbon text-carbon",
  stamp: "border-stamp text-stamp",
};

const steps = [
  { icon: Store, number: "01", title: "Crea tu negocio", description: "Registra tu empresa, agrega tu logo, información, horarios y redes sociales.", color: "primary" },
  { icon: Bot, number: "02", title: "Entrena tu IA", description: "Sube la información de tu negocio para que el asistente responda automáticamente.", color: "carbon" },
  { icon: Rocket, number: "03", title: "Empieza a vender", description: "Comparte tu perfil y deja que Klikeo atienda clientes las 24 horas.", color: "stamp" },
];

export default function HowItWorks() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono uppercase tracking-widest text-primary text-sm">Cómo funciona</span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text">
            Empieza en solo tres pasos
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-text-secondary">
            Diseñamos Klikeo para que cualquier negocio pueda comenzar en pocos minutos.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 sm:mt-16 lg:mt-20 lg:grid-cols-3 lg:gap-10">

          {/* Línea de corte que conecta los pasos, solo desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden border-t-2 border-dashed border-border lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-4">
                  <div className={`stamp-tilt relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed bg-background ${colorClasses[step.color]}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-sm text-text-secondary">Paso {step.number}</span>
                </div>

                <h3 className="mt-5 font-heading text-xl font-semibold text-text sm:text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary sm:mt-4 sm:text-base sm:leading-7">{step.description}</p>
              </div>
            );
          })}

        </div>
      </Container>
    </Section>
  );
}