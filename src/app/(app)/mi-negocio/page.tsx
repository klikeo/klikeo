"use client"

import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BUSINESS_CATEGORIES } from "@/src/constants/categories"
import Navbar from "@/src/components/Navbar"
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth"
import { dashboardClient, NegocioDashboard } from "@/src/lib/dashboard-client"

const negocioSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().trim().optional(),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  category: z.string().min(1, "Selecciona una categoría"),
  city: z.string().min(1, "La ciudad es requerida"),
  whatsappNumber: z.string().min(7, "Número inválido"),
  address: z.string().optional(),
  phone: z.string().optional(),
})

type NegocioForm = z.infer<typeof negocioSchema>

const CATEGORY_LABELS: Record<string, string> = {
  alimentos: "Alimentos",
  ropa: "Ropa",
  salud: "Salud",
  servicios: "Servicios",
  tecnologia: "Tecnología",
  educacion: "Educación",
  belleza: "Belleza",
  hogar: "Hogar",
  deportes: "Deportes",
  entretenimiento: "Entretenimiento",
  transporte: "Transporte",
  turismo: "Turismo",
  mascotas: "Mascotas",
  construccion: "Construcción",
  otros: "Otros",
}

export default function MiNegocioPage() {
  const { token, loading } = useRequireAuth()
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [success, setSuccess] = useState("")
  const [assetMessage, setAssetMessage] = useState("")
  const [assetError, setAssetError] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [fetchError, setFetchError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NegocioForm>({ resolver: zodResolver(negocioSchema) })

  useEffect(() => {
    if (!token) return
    dashboardClient.negocios
      .getByOwner(token)
      .then((n) => {
        setNegocio(n)
        reset({
          name: n.name,
          slug: n.slug,
          description: n.description,
          category: n.category,
          city: n.city,
          whatsappNumber: n.whatsappNumber,
          address: n.address,
          phone: n.phone,
        })
      })
      .catch((error) => {
        if (error instanceof Error && error.message !== 'No tienes un negocio registrado') {
          setFetchError(error.message)
        }
      })
  }, [token, reset])

  const onSubmit = async (data: NegocioForm) => {
    if (!token) return
    try {
      let updated: NegocioDashboard
      if (negocio) {
        updated = await dashboardClient.negocios.update(negocio.id, data, token)
      } else {
        updated = await dashboardClient.negocios.create(
          { ...data, whatsappNumber: data.whatsappNumber },
          token,
        )
      }
      setNegocio(updated)
      setSuccess("Negocio actualizado exitosamente")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Error al guardar",
      })
    }
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFile: Dispatch<SetStateAction<File | null>>,
    setPreview: Dispatch<SetStateAction<string | null>>,
  ) => {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setFile(null)
      setPreview(null)
      return
    }

    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleAssetUpload = async (type: 'logo' | 'banner') => {
    if (!token || !negocio) return

    const file = type === 'logo' ? logoFile : bannerFile
    if (!file) {
      setAssetError('Selecciona una imagen primero')
      return
    }

    const formData = new FormData()
    formData.append(type, file)

    try {
      if (type === 'logo') setIsUploadingLogo(true)
      if (type === 'banner') setIsUploadingBanner(true)
      setAssetError("")
      const updated = await dashboardClient.negocios.uploadAssets(
        negocio.id,
        formData,
        token,
      )
      setNegocio(updated)
      setAssetMessage(`Imagen de ${type} subida correctamente`)
      setTimeout(() => setAssetMessage(""), 3000)
      if (type === 'logo') {
        setLogoFile(null)
        setLogoPreview(null)
      } else {
        setBannerFile(null)
        setBannerPreview(null)
      }
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setIsUploadingLogo(false)
      setIsUploadingBanner(false)
    }
  }

  const handleRemoveAsset = async (type: 'logo' | 'banner') => {
    if (!token || !negocio) return

    try {
      setAssetError("")
      const updated =
        type === 'logo'
          ? await dashboardClient.negocios.deleteLogo(negocio.id, token)
          : await dashboardClient.negocios.deleteBanner(negocio.id, token)
      setNegocio(updated)
      setAssetMessage(`Imagen de ${type} eliminada correctamente`)
      setTimeout(() => setAssetMessage(""), 3000)
      if (type === 'logo') {
        setLogoFile(null)
        setLogoPreview(null)
      } else {
        setBannerFile(null)
        setBannerPreview(null)
      }
    } catch (err) {
      setAssetError(err instanceof Error ? err.message : 'Error al eliminar imagen')
    }
  }

  if (loading)
    return <div className="p-16 text-center text-muted">Cargando...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-text mb-6">
          {negocio ? "Editar mi negocio" : "Crear mi negocio"}
        </h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 text-green-700 text-sm">
            {success}
          </div>
        )}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {[
              {
                field: "name" as const,
                label: "Nombre del negocio *",
                type: "text",
              },
              {
                field: "slug" as const,
                label: "Slug público (opcional)",
                type: "text",
              },
              { field: "city" as const, label: "Ciudad *", type: "text" },
              {
                field: "whatsappNumber" as const,
                label: "Número de WhatsApp *",
                type: "tel",
              },
              {
                field: "phone" as const,
                label: "Teléfono (opcional)",
                type: "tel",
              },
              {
                field: "address" as const,
                label: "Dirección (opcional)",
                type: "text",
              },
            ].map(({ field, label, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1.5 text-text">
                  {label}
                </label>
                <input
                  {...register(field)}
                  type={type}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-surface text-text border-border focus:border-primary outline-none ${errors[field] ? "border-destructive" : ""}`}
                />
                {field === 'slug' && (
                  <p className="text-muted text-xs mt-1">
                    Dejar en blanco para generar el slug automáticamente desde el nombre.
                  </p>
                )}
                {errors[field] && (
                  <p className="text-destructive text-xs mt-1">
                    {errors[field]?.message}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Categoría *
              </label>
              <select
                {...register("category")}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-surface text-text border-border focus:border-primary outline-none ${errors.category ? "border-destructive" : ""}`}
              >
                <option value="">Selecciona una categoría</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-destructive text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Descripción (opcional)
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm bg-surface text-text border-border resize-y"
                placeholder="Describe tu negocio en pocas palabras..."
              />
              {errors.description && (
                <p className="text-destructive text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold disabled:opacity-50 min-h-44px hover:bg-primary-dark transition-colors"
            >
              {isSubmitting
                ? "Guardando..."
                : negocio
                  ? "Guardar cambios"
                  : "Crear negocio"}
            </button>
          </form>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8 mt-6">
          {negocio && (
            <div className="mb-6 rounded-3xl border border-border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Catálogo</p>
                  <p className="mt-2 text-sm text-muted">Accede directamente al catálogo de productos de tu negocio.</p>
                </div>
                <Link
                  href="/mi-negocio/productos"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Ver productos
                </Link>
              </div>
            </div>
          )}
          <h2 className="text-lg font-semibold text-text mb-4">Identidad visual</h2>
          <p className="text-sm text-muted mb-4">
            Sube tu logo y banner para que tu negocio se vea profesional en la página pública.
          </p>

          {assetMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700 text-sm">
              {assetMessage}
            </div>
          )}
          {assetError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
              {assetError}
            </div>
          )}

          <div className="grid gap-5">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface border border-border">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Vista previa del logo"
                      className="w-full h-full object-cover"
                    />
                  ) : negocio?.logoUrl ? (
                    <img
                      src={negocio.logoUrl}
                      alt="Logo actual"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                      Logo
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">Logo</p>
                  <p className="text-sm text-muted">Preferido: 1:1, PNG o JPG.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="block w-full sm:w-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event as ChangeEvent<HTMLInputElement>, setLogoFile, setLogoPreview)}
                    className="block w-full text-sm text-text"
                  />
                </label>
                <button
                  type="button"
                  disabled={isUploadingLogo}
                  onClick={() => handleAssetUpload('logo')}
                  className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {isUploadingLogo ? 'Subiendo...' : 'Subir logo'}
                </button>
                {negocio?.logoUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset('logo')}
                    className="py-2 px-4 bg-destructive text-white rounded-lg text-sm font-semibold"
                  >
                    Eliminar logo
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="w-full h-32 rounded-xl overflow-hidden bg-surface border border-border">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Vista previa del banner"
                      className="w-full h-full object-cover"
                    />
                  ) : negocio?.bannerUrl ? (
                    <img
                      src={negocio.bannerUrl}
                      alt="Banner actual"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                      Banner
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">Banner</p>
                  <p className="text-sm text-muted">Preferido: 16:9 o similar, PNG o JPG.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="block w-full sm:w-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event as ChangeEvent<HTMLInputElement>, setBannerFile, setBannerPreview)}
                    className="block w-full text-sm text-text"
                  />
                </label>
                <button
                  type="button"
                  disabled={isUploadingBanner}
                  onClick={() => handleAssetUpload('banner')}
                  className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {isUploadingBanner ? 'Subiendo...' : 'Subir banner'}
                </button>
                {negocio?.bannerUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset('banner')}
                    className="py-2 px-4 bg-destructive text-white rounded-lg text-sm font-semibold"
                  >
                    Eliminar banner
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {fetchError && <p className="text-muted text-sm mt-4">{fetchError}</p>}
      </div>
    </div>
  )
}
