'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/src/components/Navbar'
import { useRequireAuth } from '@/src/lib/hooks/useRequireAuth'
import { dashboardClient, NegocioDashboard, ChatSessionItem } from '@/src/lib/dashboard-client'

const cardStyle = "bg-surface border border-border rounded-xl p-6"

interface AdminStats {
  totalNegocios: number
  negociosActivos: number
  negociosConChatbot: number
  totalChats: number
  chatsHoy: number
}

// Owner Dashboard Component
function OwnerDashboard({ token }: { token: string }) {
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [recentChats, setRecentChats] = useState<ChatSessionItem[]>([])
  const [chatsHoy, setChatsHoy] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardClient.negocios
      .getByOwner(token)
      .then(async (n) => {
        setNegocio(n)
        const chatResult = await dashboardClient.negocios.getChats(n.id, token)
        setRecentChats(chatResult.data.slice(0, 5))
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayChats = chatResult.data.filter(
          (c) => new Date(c.createdAt) >= today
        ).length
        setChatsHoy(todayChats)
      })
      .catch(() => {
        setError('No tienes un negocio registrado aún.')
      })
  }, [token])

  if (error && !negocio) {
    return (
      <div className={`${cardStyle} mb-6 text-center`}>
        <p className="text-muted mb-4">{error}</p>
        <Link
          href="/mi-negocio"
          className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg no-underline font-semibold hover:bg-primary-dark transition-colors"
        >
          Crear mi negocio
        </Link>
      </div>
    )
  }

  if (!negocio) return null

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Chats hoy', value: chatsHoy },
          { label: 'Total chats', value: recentChats.length },
          { label: 'Chatbot', value: negocio.trainingData ? '✅ Entrenado' : '⚠️ Sin entrenar' },
        ].map((stat) => (
          <div key={stat.label} className={cardStyle}>
            <p className="text-muted text-sm mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-text m-0">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { href: '/mi-negocio', label: 'Editar negocio', desc: 'Actualiza tu perfil público' },
          { href: '/mi-negocio/productos', label: 'Productos', desc: 'Administra el catálogo de tu negocio' },
          { href: '/chatbot', label: 'Entrenar chatbot', desc: 'Enseña a tu asistente virtual' },
          { href: '/chats', label: 'Ver conversaciones', desc: 'Historial de chats de WhatsApp' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="no-underline">
            <div className={`${cardStyle} hover:shadow-md transition-shadow cursor-pointer`}>
              <p className="font-semibold text-primary mb-1">{link.label}</p>
              <p className="text-sm text-muted m-0">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent chats */}
      <div className={cardStyle}>
        <h2 className="text-lg font-semibold text-text mb-4">
          Conversaciones recientes
        </h2>
        {recentChats.length === 0 ? (
          <p className="text-muted text-sm">Aún no hay conversaciones.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentChats.map((chat) => (
              <div key={chat.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{chat.clientePhone}</span>
                  <span className="text-xs text-muted">
                    {new Date(chat.updatedAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <p className="text-xs text-muted m-0">
                  {chat.historial.length} mensaje{chat.historial.length !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// Admin Dashboard Component
function AdminDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [negocios, setNegocios] = useState<NegocioDashboard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const res = await fetch('http://localhost:3001/api/negocios/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })
        if (res.ok) {
          setStats(await res.json())
        }
        
        // Fetch negocios
        const resNeg = await fetch('http://localhost:3001/api/negocios?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })
        if (resNeg.ok) {
          const data = await resNeg.json()
          setNegocios(data.data || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  if (loading) return <div className="text-center text-muted py-8">Cargando estadísticas...</div>

  return (
    <>
      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Negocios', value: stats?.totalNegocios ?? 0 },
          { label: 'Negocios Activos', value: stats?.negociosActivos ?? 0 },
          { label: 'Chatbots Entrenados', value: stats?.negociosConChatbot ?? 0 },
          { label: 'Total Chats', value: stats?.totalChats ?? 0 },
          { label: 'Chats Hoy', value: stats?.chatsHoy ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className={cardStyle}>
            <p className="text-muted text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text m-0">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/negocios" className="no-underline">
          <div className={`${cardStyle} hover:shadow-md transition-shadow cursor-pointer`}>
            <p className="font-semibold text-primary mb-1">🔍 Ver Todos los Negocios</p>
            <p className="text-sm text-muted m-0">Explorar el directorio completo</p>
          </div>
        </Link>
        <Link href="/admin/users" className="no-underline">
          <div className={`${cardStyle} hover:shadow-md transition-shadow cursor-pointer`}>
            <p className="font-semibold text-primary mb-1">👥 Gestión de Usuarios</p>
            <p className="text-sm text-muted m-0">Administrar usuarios registrados</p>
          </div>
        </Link>
      </div>

      {/* Recent Businesses */}
      <div className={cardStyle}>
        <h2 className="text-lg font-semibold text-text mb-4">
          Negocios Recientes ({negocios.length} total)
        </h2>
        {negocios.length === 0 ? (
          <p className="text-muted text-sm">No hay negocios registrados.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {negocios.slice(0, 10).map((n) => (
              <div key={n.id} className="border-b border-border pb-3 last:border-0 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{n.name}</p>
                  <p className="text-xs text-muted">{n.city} · {n.category}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${n.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {n.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user, token, loading } = useRequireAuth()

  if (loading) return <div className="py-16 text-center text-muted">Cargando...</div>

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-text mb-1">
          {isAdmin ? 'Panel de Administración' : 'Dashboard'}
        </h1>
        {user && (
          <p className="text-muted mb-8">Bienvenido, {user.name} {isAdmin && '👑'}</p>
        )}

        {isAdmin ? (
          <AdminDashboard token={token!} />
        ) : (
          <OwnerDashboard token={token!} />
        )}
      </div>
    </div>
  )
}