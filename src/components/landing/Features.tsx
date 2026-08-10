import { Bot, Globe, MessageCircle, BarChart3 } from "lucide-react";
import Section from "@/src/components/ui/Section";
import Container from "@/src/components/ui/Container";

const features = [
  { icon: Globe, code: "ART. 01", title: "Página web profesional", description: "Obtén una página moderna para que tus clientes encuentren tu negocio desde cualquier lugar." },
  { icon: MessageCircle, code: "ART. 02", title: "WhatsApp inteligente", description: "Responde automáticamente preguntas frecuentes incluso cuando estás ocupado." },
  { icon: Bot, code: "ART. 03", title: "IA entrenada con tu negocio", description: "La inteligencia artificial aprende sobre tus productos, horarios y servicios." },
  { icon: BarChart3, code: "ART. 04", title: "Estadísticas en tiempo real", description: "Conoce cuántos clientes escriben, qué preguntan y cómo está creciendo tu negocio." },
];

export default function Features() {
  return (
    <Section>
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-mono text-primary tracking-widest uppercase text-sm">Todo en una sola plataforma</span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-text">
            Todo lo que necesita
            <br />
            tu negocio.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-text-secondary leading-7 sm:leading-8">
            Diseñado para negocios que quieren vender más, atender mejor y ahorrar tiempo.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-dashed divide-border overflow-hidden rounded-2xl border border-dashed border-border bg-card sm:mt-16 lg:mt-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-5 p-6 sm:p-8">
                <span className="w-14 shrink-0 pt-1 font-mono text-xs text-text-secondary">{feature.code}</span>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-carbon">
                  <Icon size={20} className="text-carbon" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text sm:text-xl">{feature.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary leading-6 sm:text-base sm:leading-7">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}