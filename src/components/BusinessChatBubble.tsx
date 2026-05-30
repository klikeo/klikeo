'use client'

import { useState } from 'react'
import { apiClient, ChatMessage } from '@/src/lib/api-client'

interface BusinessChatBubbleProps {
  negocioId: string
  negocioName: string
}

export default function BusinessChatBubble({ negocioId, negocioName }: BusinessChatBubbleProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!input.trim() || isSending) return

    const newMessage: ChatMessage = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, newMessage]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsSending(true)

    try {
      const { reply } = await apiClient.negocios.chat(negocioId, nextMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="relative w-full max-w-[520px] text-left">
      <div className="bg-surface border border-border rounded-3xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 bg-primary text-white">
          <div>
            <p className="text-sm font-semibold">Chat con {negocioName}</p>
            <p className="text-xs text-white/80">Asistente entrenado con DeepSeek</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 transition"
          >
            {open ? 'Ocultar' : 'Abrir'}
          </button>
        </div>

        {open ? (
          <div className="px-4 py-4">
            <div className="max-h-[320px] overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 border border-border p-4 text-sm text-muted">
                  Haz tu primera pregunta al asistente virtual.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl p-3 text-sm max-w-[90%] ${
                      message.role === 'user'
                        ? 'ml-auto bg-primary text-white'
                        : 'mr-auto bg-gray-100 text-text'
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-3 py-2 mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm bg-white text-text outline-none focus:border-primary"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition"
              >
                {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        ) : (
          <div className="px-4 py-4 text-sm text-muted">
            Haz clic en &quot;Abrir&quot; para iniciar el chat con el asistente.
          </div>
        )}
      </div>
    </div>
  )
}
