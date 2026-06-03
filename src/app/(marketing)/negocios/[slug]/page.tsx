import { Metadata } from "next"
import { notFound } from "next/navigation"
import { apiClient } from "@/src/lib/api-client"
import BusinessChatBubble from "@/src/components/BusinessChatBubble"
import NegocioCategoriesSpy from "@/src/components/NegocioCategoriesSpy"

interface NegocioPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({
  params,
}: NegocioPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const negocio = await apiClient.negocios.getById(slug)
    return {
      title: `${negocio.name} — Klikeo`,
      description: negocio.description ?? `${negocio.name} en ${negocio.city}`,
    }
  } catch {
    return { title: "Negocio — Klikeo" }
  }
}

export default async function NegocioDetailPage({ params }: NegocioPageProps) {
  const { slug } = await params
  let negocio
  try {
    negocio = await apiClient.negocios.getById(slug)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-10 px-6">
        {negocio.bannerUrl && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-border">
            <img
              src={negocio.bannerUrl}
              alt={`${negocio.name} banner`}
              className="w-full h-60 object-cover"
            />
          </div>
        )}
        <div className="bg-surface border border-border rounded-xl p-8 mb-6">
          <div className="flex items-center gap-5 mb-5 flex-wrap">
            {negocio.logoUrl ? (
              <img
                src={negocio.logoUrl}
                alt={negocio.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary text-white flex items-center justify-center text-3xl font-bold shrink-0">
                {negocio.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {negocio.name}
              </h1>
              <div className="flex gap-3 flex-wrap items-center">
                <span className="text-muted text-sm">📍 {negocio.city}</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium capitalize">
                  {negocio.category}
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

        <NegocioCategoriesSpy businessSlug={slug} />

        <div className="mt-8">
          <BusinessChatBubble
            negocioId={negocio.id}
            negocioName={negocio.name}
          />
        </div>
      </div>
    </div>
  )
}
