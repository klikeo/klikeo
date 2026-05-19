import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { apiClient } from '@/src/lib/api-client'
import WhatsAppButton from '@/src/components/WhatsAppButton'

interface NegocioPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: NegocioPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const negocio = await apiClient.negocios.getById(id)
    return {
      title: `${negocio.name} — Klikeo`,
      description: negocio.description ?? `${negocio.name} en ${negocio.city}`,
    }
  } catch {
    return { title: 'Negocio — Klikeo' }
  }
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

export default async function NegocioDetailPage({ params }: NegocioPageProps) {
  const { id } = await params
  let negocio
  try {
    negocio = await apiClient.negocios.getById(id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <div className="flex items-center gap-5 mb-5 flex-wrap">
            {negocio.logoUrl ? (
              <img
                src={negocio.logoUrl}
                alt={negocio.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary text-white flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {negocio.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {negocio.name}
              </h1>
              <div className="flex gap-3 flex-wrap items-center">
                <span className="text-muted text-sm">📍 {negocio.city}</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium">
                  {CATEGORY_LABELS[negocio.category] ?? negocio.category}
                </span>
              </div>
            </div>
          </div>

          {negocio.description && (
            <p className="text-text text-base leading-relaxed mb-5">
              {negocio.description}
            </p>
          )}

          <div className="flex flex-col gap-2">
            {negocio.address && (
              <p className="text-muted text-sm">🏠 {negocio.address}</p>
            )}
            {negocio.phone && (
              <p className="text-muted text-sm">📞 {negocio.phone}</p>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-text mb-3">
            ¿Quieres contactar a {negocio.name}?
          </h2>
          <p className="text-muted text-sm mb-6">
            Chatea directamente con el asistente virtual en WhatsApp — disponible 24/7.
          </p>
          <WhatsAppButton whatsappNumber={negocio.whatsappNumber} negocioName={negocio.name} />
        </div>
      </div>
    </div>
  )
}