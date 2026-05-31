"use client"

import { useState } from "react"
import { apiClient, ChatMessage } from "@/src/lib/api-client"
import {
  LoaderCircle,
  MessageSquareMore,
  MessageSquareX,
  SendHorizontal,
} from "lucide-react"

interface BusinessChatBubbleProps {
  negocioId: string
  negocioName: string
}

export default function BusinessChatBubble({
  negocioId,
  negocioName,
}: BusinessChatBubbleProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!input.trim() || isSending) return

    const newMessage: ChatMessage = { role: "user", content: input.trim() }
    const nextMessages = [...messages, newMessage]
    setMessages(nextMessages)
    setInput("")
    setError("")
    setIsSending(true)

    try {
      const { reply } = await apiClient.negocios.chat(negocioId, nextMessages)
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el mensaje",
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 w-full ${open ? "max-w-[520px]" : "max-w-[60px]"} text-left`}
    >
      <div
        className={`bg-surface border border-border shadow-lg overflow-hidden ${open ? "rounded-3xl" : "rounded-full"}`}
      >
        <div
          className={`flex items-center ${open ? "justify-between px-4 py-4" : "justify-center px-1 py-1"} bg-primary text-white`}
        >
          {open && (
            <div>
              <p className="text-sm font-semibold">Chat con {negocioName}</p>
              {/* <p className="text-xs text-white/80">
                Asistente entrenado
              </p> */}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className={`rounded-full border border-white/25 px-3 text-xs font-medium ${open ? "bg-white/10 py-1" : "py-3"} hover:bg-white/20 transition cursor-pointer`}
          >
            {open ? <MessageSquareX /> : <MessageSquareMore />}
          </button>
        </div>

        {open ? (
          <div className="px-4 py-4">
            <div className="max-h-[320px] overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 border border-border p-4 text-sm text-muted">
                  Haz tu primera pregunta al nuestro asistente.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`p-3 text-sm w-fit max-w-[90%] ${
                      message.role === "user"
                        ? "rounded-t-2xl rounded-bl-2xl ml-auto bg-primary text-white"
                        : "rounded-t-2xl rounded-br-2xl mr-auto bg-gray-100 text-text"
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
                className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition cursor-pointer"
              >
                {isSending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <SendHorizontal />
                )}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
