"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  MessageCircle,
  Package,
  Store,
} from "lucide-react";

const actions = [
  {
    title: "Productos",
    description: "Administra tu catálogo y precios.",
    href: "/mi-negocio/productos",
    icon: Package,
  },
  {
    title: "Entrenar IA",
    description: "Enseña a tu asistente sobre tu negocio.",
    href: "/chatbot",
    icon: Bot,
  },
  {
    title: "Conversaciones",
    description: "Responde a tus clientes.",
    href: "/chats",
    icon: MessageCircle,
  },
  {
    title: "Mi negocio",
    description: "Actualiza la información pública.",
    href: "/mi-negocio",
    icon: Store,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text">
          Acciones rápidas
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Accede rápidamente a las funciones principales de tu negocio.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((action, i) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                animate-fade-up
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-primary/40
                hover:shadow-xl
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={26} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-text">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={22}
                  className="text-text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}