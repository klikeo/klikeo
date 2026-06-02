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
    <Link href={`/negocios/${negocio.slug ?? negocio.id}`} className="no-underline text-inherit">
      <div className="bg-surface border border-border rounded-xl p-5 transition-shadow cursor-pointer h-full hover:shadow-lg">
        <div className="flex items-start gap-3">
          {negocio.logoUrl ? (
            <img
              src={negocio.logoUrl}
              alt={negocio.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
              {negocio.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="m-0 text-base font-semibold text-text truncate">
              {negocio.name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {negocio.city}
            </p>
          </div>
        </div>
        {negocio.description && (
          <p className="mt-3 text-sm text-muted line-clamp-2">
            {negocio.description}
          </p>
        )}
        <div className="mt-3">
          <span className="inline-block bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {CATEGORY_LABELS[negocio.category] ?? negocio.category}
          </span>
        </div>
      </div>
    </Link>
  )
}