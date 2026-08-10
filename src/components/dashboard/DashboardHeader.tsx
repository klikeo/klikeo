"use client";

import { Sparkles, CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-5 shadow-card mb-6 sm:p-6 sm:mb-8 lg:p-8 lg:mb-10">

      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

        <div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:mb-4 sm:px-4 sm:py-2">

            <Sparkles size={14} className="text-primary sm:hidden" />
            <Sparkles size={16} className="text-primary hidden sm:block" />

            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Dashboard
            </span>

          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:mt-4 sm:text-base lg:text-lg">
            {subtitle}
          </p>

        </div>

        <div className="rounded-xl border border-border bg-background px-4 py-3 sm:rounded-2xl sm:px-6 sm:py-5">

          <div className="flex items-center gap-3">

            <CalendarDays size={20} className="text-primary sm:hidden" />
            <CalendarDays size={22} className="text-primary hidden sm:block" />

            <div>

              <p className="text-xs uppercase tracking-wider text-text-secondary">
                Hoy
              </p>

              <p className="text-sm font-semibold capitalize text-text sm:text-base">
                {today}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}