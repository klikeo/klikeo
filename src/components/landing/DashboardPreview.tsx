import { Bot, MessageCircle, TrendingUp, Store, CheckCircle2 } from "lucide-react";

export default function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-4xl">

      {/* Copia de papel carbón, asomando detrás */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-dashed border-carbon/40 bg-carbon-soft sm:translate-x-4 sm:translate-y-4" />

      <div className="ticket-perforated-top relative rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">

        {/* Header tipo recibo */}
        <div className="flex flex-col gap-3 border-b border-dashed border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Recibo · Folio N.º 00142
            </p>
            <h3 className="mt-1 font-heading text-xl font-semibold text-text sm:text-2xl">
              Barbería El Paisa
            </h3>
          </div>

          <div className="stamp-tilt inline-flex w-fit items-center gap-2 rounded-full border-2 border-dashed border-success px-3 py-1.5 text-xs font-mono uppercase tracking-wide text-success">
            <CheckCircle2 size={14} />
            IA activa
          </div>
        </div>

        <div className="grid lg:grid-cols-3">

          {/* Stats como líneas de recibo */}
          <div className="flex flex-col justify-center gap-4 border-b border-dashed border-border p-5 lg:border-b-0 lg:border-r lg:p-8">
            <LineItem icon={<MessageCircle size={16} />} label="Conversaciones" value="128" />
            <LineItem icon={<TrendingUp size={16} />} label="Clientes nuevos" value="+34" />
            <LineItem icon={<Store size={16} />} label="Visitas" value="1.204" />
          </div>

          {/* Chat */}
          <div className="p-5 lg:col-span-2 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              <Bubble user text="Hola 👋 ¿Atienden hoy?" />
              <Bubble ai text="¡Hola! Sí 😊 estamos abiertos hasta las 8:00 PM." />
              <Bubble user text="¿Aceptan pagos con Nequi?" />
              <Bubble ai text="Sí. Puedes pagar con Nequi, Daviplata o efectivo." />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function LineItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-primary">{icon}</span>
      <span className="text-text-secondary whitespace-nowrap">{label}</span>
      <span className="flex-1 border-b border-dotted border-border translate-y-[-3px]" />
      <span className="font-mono text-base font-semibold text-text">{value}</span>
    </div>
  );
}

function Bubble({ text, user, ai }: { text: string; user?: boolean; ai?: boolean }) {
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 sm:max-w-sm sm:px-5 sm:py-3 sm:leading-7 ${
          ai ? "bg-primary text-on-primary" : "border border-border bg-surface text-text"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide opacity-80 sm:mb-2 sm:text-xs">
          {ai ? (<><Bot size={13} />IA</>) : (<><MessageCircle size={13} />Cliente</>)}
        </div>
        {text}
      </div>
    </div>
  );
}