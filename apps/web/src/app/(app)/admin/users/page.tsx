'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useRequireAuth } from '@/lib/hooks/useRequireAuth'

interface Usuario {
  id: string
  email: string
  name: string
  role: 'admin' | 'owner'
  negocioId?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const { user, token, loading } = useRequireAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchUsuarios = async (pageNum: number, searchTerm?: string) => {
    try {
      const params = new URLSearchParams({ page: String(pageNum) })
      if (searchTerm) params.set('search', searchTerm)
      
      const res = await fetch(`http://localhost:3001/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
      
      if (!res.ok) throw new Error('Error al cargar usuarios')
      
      const data = await res.json()
      setUsuarios(data.data)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    }
  }

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchUsuarios(page, search)
    }
  }, [token, user, page, search])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    
    setDeleting(id)
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al eliminar')
      }
      
      // Refresh lista
      fetchUsuarios(page, search)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsuarios(1, search)
  }

  if (loading) return <div className="py-16 text-center text-muted">Cargando...</div>

  // Redirect si no es admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto py-10 px-6 text-center">
          <p className="text-muted">No tienes acceso a esta página.</p>
          <Link href="/dashboard" className="text-primary hover:underline">Volver al dashboard</Link>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text">Gestión de Usuarios</h1>
            <p className="text-muted text-sm mt-1">{total} usuario{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/dashboard" className="text-primary hover:underline text-sm">
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
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Buscar
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted">Nombre</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted">Rol</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted">Fecha</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm text-text">{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Owner'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {new Date(u.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.id !== u.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deleting === u.id}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {deleting === u.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="py-2 px-4 border border-border rounded-lg bg-surface text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="py-2 px-4 text-muted text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="py-2 px-4 border border-border rounded-lg bg-surface text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}