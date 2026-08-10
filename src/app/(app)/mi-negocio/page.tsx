"use client"

import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, ImageIcon, Trash2, UploadCloud } from "lucide-react"
import { BUSINESS_CATEGORIES } from "@/src/constants/categories"
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

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary ${
    hasError ? "border-danger" : "border-border"
  }`

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
    return <div className="p-16 text-center text-text-secondary">Cargando...</div>

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">

      <h1 className="font-heading text-2xl font-semibold text-text sm:text-3xl">
        {negocio ? "Editar mi negocio" : "Crear mi negocio"}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Esta información aparece en tu página pública y la usa la IA para responder a tus clientes.
      </p>

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}
      {errors.root && (
        <div className="mt-5 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {errors.root.message}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:rounded-3xl sm:p-8">
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
              <label className="mb-1.5 block text-sm font-medium text-text">
                {label}
              </label>
              <input
                {...register(field)}
                type={type}
                className={inputClass(Boolean(errors[field]))}
              />
              {field === 'slug' && (
                <p className="mt-1 text-xs text-text-muted">
                  Dejar en blanco para generar el slug automáticamente desde el nombre.
                </p>
              )}
              {errors[field] && (
                <p className="mt-1 text-xs text-danger">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Categoría *
            </label>
            <select
              {...register("category")}
              className={inputClass(Boolean(errors.category))}
            >
              <option value="">Selecciona una categoría</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-danger">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Descripción (opcional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
              placeholder="Describe tu negocio en pocas palabras..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-danger">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 min-h-[44px] w-full rounded-lg bg-primary py-3 text-base font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting
              ? "Guardando..."
              : negocio
                ? "Guardar cambios"
                : "Crear negocio"}
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:rounded-3xl sm:p-8">

        {negocio && (
          <div className="mb-6 rounded-2xl border border-border bg-background p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Catálogo
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Accede directamente al catálogo de productos de tu negocio.
                </p>
              </div>
              <Link
                href="/mi-negocio/productos"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5"
              >
                Ver productos
              </Link>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold text-text">
          Identidad visual
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Sube tu logo y banner para que tu negocio se vea profesional en la página pública.
        </p>

        {assetMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
            <CheckCircle2 size={16} />
            {assetMessage}
          </div>
        )}
        {assetError && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {assetError}
          </div>
        )}

        <div className="mt-5 grid gap-5">

          {/* Logo */}
          <div className="rounded-2xl border border-border p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-border bg-background">
                {logoPreview ? (
                  <img src={logoPreview} alt="Vista previa del logo" className="h-full w-full object-cover" />
                ) : negocio?.logoUrl ? (
                  <img src={negocio.logoUrl} alt="Logo actual" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <ImageIcon size={22} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">Logo</p>
                <p className="text-sm text-text-secondary">Preferido: 1:1, PNG o JPG.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="block w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event as ChangeEvent<HTMLInputElement>, setLogoFile, setLogoPreview)}
                  className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-2 file:text-sm file:text-text"
                />
              </label>
              <button
                type="button"
                disabled={isUploadingLogo}
                onClick={() => handleAssetUpload('logo')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadCloud size={15} />
                {isUploadingLogo ? 'Subiendo...' : 'Subir logo'}
              </button>
              {negocio?.logoUrl && (
                <button
                  type="button"
                  onClick={() => handleRemoveAsset('logo')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
                >
                  <Trash2 size={15} />
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="rounded-2xl border border-border p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="h-24 w-full overflow-hidden rounded-xl border border-border bg-background sm:h-28">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Vista previa del banner" className="h-full w-full object-cover" />
                ) : negocio?.bannerUrl ? (
                  <img src={negocio.bannerUrl} alt="Banner actual" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <ImageIcon size={22} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">Banner</p>
                <p className="text-sm text-text-secondary">Preferido: 16:9 o similar, PNG o JPG.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="block w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFileChange(event as ChangeEvent<HTMLInputElement>, setBannerFile, setBannerPreview)}
                  className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-2 file:text-sm file:text-text"
                />
              </label>
              <button
                type="button"
                disabled={isUploadingBanner}
                onClick={() => handleAssetUpload('banner')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadCloud size={15} />
                {isUploadingBanner ? 'Subiendo...' : 'Subir banner'}
              </button>
              {negocio?.bannerUrl && (
                <button
                  type="button"
                  onClick={() => handleRemoveAsset('banner')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
                >
                  <Trash2 size={15} />
                  Eliminar
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {fetchError && <p className="mt-4 text-sm text-text-secondary">{fetchError}</p>}
    </div>
  )
}