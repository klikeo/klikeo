"use client"

import Link from "next/link"
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth"

export default function PerfilPage() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return <div className="py-16 text-center text-text-secondary">Cargando...</div>
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="text-text-secondary">Debes iniciar sesión para ver tu perfil.</p>
        <Link href="/login" className="text-primary hover:underline">
          Ir al login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">Mi perfil</h1>
        <p className="mt-1 text-sm text-text-secondary">Información básica de la cuenta.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-bold text-background">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text">{user.name}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Rol</p>
            <p className="mt-2 font-medium text-text">{user.role}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Estado</p>
            <p className="mt-2 font-medium text-text">Cuenta activa</p>
          </div>
        </div>
      </div>
    </div>
  )
}
