"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  MessageSquare,
  Bot,
  Store,
} from "lucide-react";

import StatCard from "@/src/components/dashboard/StatCard";
import QuickActions from "@/src/components/dashboard/QuickActions";
import RecentChats from "@/src/components/dashboard/RecentChats";

import {
  dashboardClient,
  NegocioDashboard,
  ChatSessionItem,
} from "@/src/lib/dashboard-client";

const cardStyle =
  "rounded-2xl border border-border bg-card p-6 shadow-card";

function OwnerDashboard({ token }: { token: string }) {
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null);
  const [recentChats, setRecentChats] = useState<ChatSessionItem[]>([]);
  const [chatsHoy, setChatsHoy] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardClient.negocios
      .getByOwner(token)
      .then(async (n) => {
        setNegocio(n);

        const chatResult = await dashboardClient.negocios.getChats(
          n.id,
          token
        );

        setRecentChats(chatResult.data.slice(0, 5));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayChats = chatResult.data.filter(
          (c) => new Date(c.createdAt) >= today
        ).length;

        setChatsHoy(todayChats);
      })
      .catch(() => {
        setError("No tienes un negocio registrado aún.");
      });
  }, [token]);

  if (error && !negocio) {
    return (
      <div className={`${cardStyle} text-center animate-fade-up`}>
        <p className="mb-6 text-text-secondary">
          {error}
        </p>

        <Link
          href="/mi-negocio"
          className="inline-flex items-center rounded-xl bg-primary px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
        >
          Crear mi negocio
        </Link>
      </div>
    );
  }

  if (!negocio) {
    return (
      <div className="py-20 text-center text-text-secondary">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <>
      {/* Estadísticas */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Chats de hoy"
          value={chatsHoy}
          subtitle="Conversaciones recibidas"
          icon={MessageSquare}
          delay={0}
        />

        <StatCard
          title="Conversaciones"
          value={recentChats.length}
          subtitle="Últimos registros"
          icon={MessageSquare}
          delay={80}
        />

        <StatCard
          title="Estado IA"
          value={negocio.trainingData ? "Entrenada" : "Pendiente"}
          subtitle="Asistente virtual"
          icon={Bot}
          delay={160}
        />

        <StatCard
          title="Negocio"
          value={negocio.name}
          subtitle={negocio.city}
          icon={Store}
          delay={240}
        />
      </div>

      {/* Acciones rápidas */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Conversaciones recientes */}
      <RecentChats chats={recentChats} />
    </>
  );
}

export default OwnerDashboard;