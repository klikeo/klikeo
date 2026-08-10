'use client'

import { useEffect, useState } from 'react'
import { useRequireAuth } from '@/src/lib/hooks/useRequireAuth'
import { dashboardClient, NegocioDashboard, ChatSessionItem } from '@/src/lib/dashboard-client'

export default function ChatsPage() {
  const { token, loading } = useRequireAuth()
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [chats, setChats] = useState<ChatSessionItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    dashboardClient.negocios.getByOwner(token)
      .then((n) => {
        setNegocio(n)
        return dashboardClient.negocios.getChats(n.id, token, page)
      })
      .then((result) => {
        setChats(result.data)
        setTotal(result.total)
      })
      .catch(() => setError('No se pudieron cargar las conversaciones.'))
  }, [token, page])

  if (loading) return <div className="py-16 text-center text-text-secondary">Cargando...</div>

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">
        Conversaciones de WhatsApp
      </h1>
      {negocio && (
        <p className="text-text-secondary text-sm mb-6">
          {total} conversación{total !== 1 ? 'es' : ''} para {negocio.name}
        </p>
      )}
      {error && <p className="text-danger">{error}</p>}

      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <div key={chat.id} className="bg-surface border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === chat.id ? null : chat.id)}
              className="w-full py-4 px-5 flex justify-between items-center bg-none border-none cursor-pointer text-left"
            >
              <div>
                <p className="font-semibold text-sm text-text m-0">{chat.clientePhone}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {chat.historial.length} mensajes · {new Date(chat.updatedAt).toLocaleDateString('es-CO')}
                </p>
              </div>
              <span className="text-text-secondary text-xl">{expanded === chat.id ? '▲' : '▼'}</span>
            </button>

            {expanded === chat.id && (
              <div className="border-t border-border py-4 px-5 flex flex-col gap-2 bg-background">
                {chat.historial.map((msg, i) => (
                  <div
                    key={i}
                    className={`px-3.5 py-2.5 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'self-start bg-surface' : 'self-end bg-primary'}`}
                  >
                    <p className={`text-sm m-0 ${msg.role === 'user' ? 'text-text' : 'text-background'}`}>
                      {msg.content}
                    </p>
                    <p className={`text-xs mt-1 text-right ${msg.role === 'user' ? 'text-text-secondary' : 'text-background/70'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {chat.historial.length === 0 && (
                  <p className="text-text-secondary text-sm">Sin mensajes aún.</p>
                )}
              </div>
            )}
          </div>
        ))}
        {chats.length === 0 && !error && (
          <div className="text-center py-16 text-text-secondary">
            Aún no hay conversaciones de WhatsApp.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="py-2 px-4 rounded-lg border border-border cursor-pointer bg-surface text-text disabled:opacity-50 hover:border-primary transition-colors">Anterior</button>
          <span className="py-2 px-4 text-text-secondary">Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="py-2 px-4 rounded-lg border border-border cursor-pointer bg-surface text-text disabled:opacity-50 hover:border-primary transition-colors">Siguiente</button>
        </div>
      )}
    </div>
  )
}