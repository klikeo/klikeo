'use client'

import Link from 'next/link'
import { NegocioPublic } from '@/src/lib/api-client'

interface NegocioCardProps {
  negocio: NegocioPublic
}

const CATEGORY_LABELS: Record<string, string> = {
  alimentos: 'Alimentos',
  ropa: 'Ropa',
  salud: 'Salud',
  servicios: 'Servicios',
  tecnologia: 'Tecnología',
  educacion: 'Educación',
  belleza: 'Belleza',
  hogar: 'Hogar',
  deportes: 'Deportes',
  entretenimiento: 'Entretenimiento',
  transporte: 'Transporte',
  turismo: 'Turismo',
  mascotas: 'Mascotas',
  construccion: 'Construcción',
  otros: 'Otros',
}

export default function NegocioCard({ negocio }: NegocioCardProps) {
  return (
    <Link href={`/negocios/${negocio.slug ?? negocio.id}`} className="no-underline text-inherit block h-full">
      <div className="group h-full rounded-xl border border-dashed border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">

        {/* "Encabezado de ticket" */}
        <div className="flex items-start gap-3">

          {negocio.logoUrl ? (
            <img
              src={negocio.logoUrl}
              alt={negocio.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary text-on-primary flex items-center justify-center text-xl font-heading font-semibold flex-shrink-0">
              {negocio.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="m-0 text-base font-heading font-semibold text-text truncate">
              {negocio.name}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {negocio.city}
            </p>
          </div>

        </div>

        {/* Línea de corte tipo ticket */}
        <div className="my-4 border-t border-dashed border-border" />

        {negocio.description && (
          <p className="text-sm text-text-secondary line-clamp-2 leading-6">
            {negocio.description}
          </p>
        )}

        {/* "Sello" de categoría */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent px-3 py-1 text-xs font-medium tracking-wide uppercase">
            {CATEGORY_LABELS[negocio.category] ?? negocio.category}
          </span>
        </div>

      </div>
    </Link>
  )
}