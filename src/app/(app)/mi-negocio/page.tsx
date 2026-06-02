"use client"

import { useEffect, useState } from "react"
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

  if (loading)
    return <div className="p-16 text-center text-muted">Cargando...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
        {fetchError && <p className="text-muted text-sm mt-4">{fetchError}</p>}
      </div>
    </div>
  )
}
