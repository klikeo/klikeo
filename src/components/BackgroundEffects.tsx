export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">

      {/* Fondo principal */}
      <div className="absolute inset-0 bg-background" />

      {/* Glow superior */}
      <div className="absolute top-[-220px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[170px]" />

      {/* Glow izquierdo */}
      <div className="absolute left-[-180px] top-1/3 h-[420px] w-[420px] rounded-full bg-carbon/10 blur-[150px]" />

      {/* Glow derecho */}
      <div className="absolute right-[-150px] bottom-20 h-[350px] w-[350px] rounded-full bg-accent/10 blur-[130px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}