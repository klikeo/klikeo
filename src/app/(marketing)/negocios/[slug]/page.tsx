import { Metadata } from "next"
import { notFound } from "next/navigation"
import { apiClient } from "@/src/lib/api-client"
import BusinessChatBubble from "@/src/components/BusinessChatBubble"
import NegocioCategoriesSpy from "@/src/components/NegocioCategoriesSpy"
import Footer from "@/src/components/Footer"

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
      <div className="max-w-3xl mx-auto">
        {/* Banner + Logo superpuesto */}
        <div style={{ position: "relative", marginBottom: "56px" }}>
          <div
            className="max-h-38.5 sm:max-h-none"
            style={{
              width: "100%",
              height: "220px",
              overflow: "hidden",
              borderRadius: "0 0 20px 20px",
            }}
          >
            {negocio.bannerUrl ? (
              <img
                src={negocio.bannerUrl}
                alt={`${negocio.name} banner`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #0e7490 100%)",
                }}
              />
            )}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#fff",
              border: "3px solid #fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {negocio.logoUrl ? (
              <img
                src={negocio.logoUrl}
                alt={negocio.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#0e7490",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {negocio.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Nombre + descripción + badges */}
        <div style={{ textAlign: "center", padding: "0 1rem 1.25rem" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 4px" }}>
            {negocio.name}
          </h1>
          {negocio.description && (
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 14px",
                lineHeight: 1.5,
              }}
            >
              {negocio.description}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                fontSize: "12px",
                fontWeight: 500,
                padding: "4px 12px",
                borderRadius: "20px",
                textTransform: "capitalize",
              }}
            >
              {negocio.category}
            </span>
            <span
              style={{
                background: "#d1fae5",
                color: "#065f46",
                fontSize: "12px",
                fontWeight: 500,
                padding: "4px 12px",
                borderRadius: "20px",
              }}
            >
              ● Abierto · Cierra 11pm
            </span>
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
      <Footer />
    </div>
  )
}
