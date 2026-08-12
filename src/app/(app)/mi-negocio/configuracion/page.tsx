"use client"

import Link from "next/link"
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth"

export default function MiNegocioConfiguracionPage() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return <div className="py-16 text-center text-text-secondary">Cargando...</div>
  }

  if (user?.role !== "owner") {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="text-text-secondary">No tienes acceso a esta página.</p>
        <Link href="/dashboard" className="text-primary hover:underline">
          Volver al dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Configuración del negocio</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Ajusta la configuración de tu negocio y la presencia digital.
          </p>
        </div>
        <Link href="/mi-negocio" className="text-sm text-primary hover:underline">
          ← Volver a mi negocio
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 text-text-secondary">
        Esta sección está preparada para la configuración real del negocio y ya está protegida para owners.
      </div>
    </div>
  )
}
