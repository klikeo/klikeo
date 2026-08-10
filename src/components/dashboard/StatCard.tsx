"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="
        animate-fade-up
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-2xl
      "
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm text-text-secondary">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-text">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-text-muted">
              {subtitle}
            </p>
          )}

        </div>

        <div className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-primary/10
          text-primary
        ">
          <Icon size={26} />
        </div>

      </div>
    </div>
  );
}