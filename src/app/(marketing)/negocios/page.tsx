import Footer from "@/src/components/Footer"
import Navbar from "@/src/components/Navbar"
import NegocioCard from "@/src/components/NegocioCard"
import SearchBar from "@/src/components/SearchBar"
import { Suspense } from "react"
import { apiClient, ListNegociosParams } from "../../../lib/api-client"

interface NegociosPageProps {
  searchParams: Promise<{
    search?: string
    city?: string
    category?: string
    page?: string
  }>
}

async function NegocioGrid({ params }: { params: ListNegociosParams }) {
  try {
    const result = await apiClient.negocios.list(params)
    if (result.data.length === 0) {
      return (
        <div className="text-center py-16 text-muted">
          <p className="text-lg">
            No se encontraron negocios con esos filtros.
          </p>
        </div>
      )
    }
    return (
      <>
        <p className="text-muted text-sm mb-6">
          {result.total} negocio{result.total !== 1 ? "s" : ""} encontrado
          {result.total !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {result.data.map((negocio) => (
            <NegocioCard key={negocio.id} negocio={negocio} />
          ))}
        </div>
      </>
    )
  } catch {
    return (
      <div className="text-center py-16 text-muted">
        <p>No se pudo conectar con la API. Intenta de nuevo.</p>
      </div>
    )
  }
}

export default async function NegociosPage({
  searchParams,
}: NegociosPageProps) {
  const params = await searchParams
  const listParams: ListNegociosParams = {
    search: params.search,
    city: params.city,
    category: params.category,
    page: params.page ? parseInt(params.page) : 1,
    limit: 20,
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto py-10 px-6">
          <h1 className="text-3xl font-bold text-text mb-2">
            Negocios en Colombia
          </h1>
          <p className="text-muted mb-8">
            Encuentra y contacta negocios locales en tu ciudad
          </p>
          <div className="mb-8">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="text-center py-16 text-muted">
                Cargando negocios...
              </div>
            }
          >
            <NegocioGrid params={listParams} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
