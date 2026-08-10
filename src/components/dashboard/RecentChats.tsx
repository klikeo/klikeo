"use client";

import { ChatSessionItem } from "@/src/lib/dashboard-client";
import { MessageCircle, Clock } from "lucide-react";

interface Props {
  chats: ChatSessionItem[];
}

export default function RecentChats({ chats }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-semibold text-text">
            Conversaciones recientes
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Últimos clientes que interactuaron con tu asistente.
          </p>

        </div>

      </div>

      {chats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">

          <MessageCircle
            size={42}
            className="mx-auto mb-4 text-text-muted"
          />

          <h3 className="text-lg font-semibold text-text">
            Sin conversaciones
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            Cuando un cliente escriba a tu negocio aparecerá aquí.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {chats.map((chat) => (

            <div
              key={chat.id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-border
                bg-background
                p-5
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-card
              "
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {chat.clientePhone.slice(-2)}
                </div>

                <div>

                  <p className="font-semibold text-text">
                    {chat.clientePhone}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {chat.historial.length} mensaje
                    {chat.historial.length !== 1 && "s"}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-text-muted text-sm">

                <Clock size={16} />

                {new Date(chat.updatedAt).toLocaleDateString("es-CO")}

              </div>

            </div>

          ))}

        </div>
      )}
    </section>
  );
}