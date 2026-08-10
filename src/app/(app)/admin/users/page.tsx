"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

interface Usuario {
  id: string
  email: string
  name: string
  role: "admin" | "owner"
  negocioId?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const { user, token, loading } = useRequireAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsuarios = async (pageNum: number, searchTerm?: string) => {
      try {
        const params = new URLSearchParams({ page: String(pageNum) })
        if (searchTerm) params.set("search", searchTerm)

        const res = await fetch(
          `${API_URL}/api/admin/users?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          },
        )

        if (!res.ok) throw new Error("Error al cargar usuarios")

        const data = await res.json()
        setUsuarios(data.data)
        setTotal(data.total)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido")
      }
    }

    if (token && user?.role === "admin") {
      fetchUsuarios(page, search)
    }
  }, [token, user, page, search])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    setDeleting(id)
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al eliminar")
      }

      // Refresh lista
      setPage(1)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar")
    } finally {
      setDeleting(null)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  if (loading)
    return <div className="py-16 text-center text-text-secondary">Cargando...</div>

  // Redirect si no es admin
  if (user?.role !== "admin") {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6 text-center">
        <p className="text-text-secondary">No tienes acceso a esta página.</p>
        <Link href="/dashboard" className="text-primary hover:underline">
          Volver al dashboard
        </Link>
      </div>
    )
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text">
            Gestión de Usuarios
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {total} usuario{total !== 1 ? "s" : ""} registrado
            {total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-primary hover:underline text-sm"
        >
          ← Volver al dashboard
        </Link>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border border-border rounded-lg text-sm bg-surface text-text focus:border-primary outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 mb-4 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                Nombre
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                Email
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                Rol
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">
                Fecha
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-text-secondary">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-sm text-text">
                    {u.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-carbon/15 text-carbon" : "bg-primary/15 text-primary"}`}
                  >
                    {u.role === "admin" ? "Admin" : "Owner"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {new Date(u.createdAt).toLocaleDateString("es-CO")}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.id !== u.id && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deleting === u.id}
                      className="text-danger hover:opacity-80 text-sm disabled:opacity-50"
                    >
                      {deleting === u.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="py-2 px-4 border border-border rounded-lg bg-surface text-text text-sm disabled:opacity-50 hover:border-primary transition-colors"
          >
            Anterior
          </button>
          <span className="py-2 px-4 text-text-secondary text-sm">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="py-2 px-4 border border-border rounded-lg bg-surface text-text text-sm disabled:opacity-50 hover:border-primary transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}