"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import OwnerDashboard from "@/src/components/dashboard/OwnerDashboard";
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth";

import {
  dashboardClient,
  NegocioDashboard,
} from "@/src/lib/dashboard-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const cardStyle = "bg-surface border border-border rounded-xl p-6";

interface AdminStats {
  totalNegocios: number;
  negociosActivos: number;
  negociosConChatbot: number;
  totalChats: number;
  chatsHoy: number;
}

function AdminDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [negocios, setNegocios] = useState<NegocioDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${API_URL}/api/negocios/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (res.ok) {
          setStats(await res.json());
        }

        const resNeg = await fetch(
          `${API_URL}/api/negocios?limit=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (resNeg.ok) {
          const data = await resNeg.json();
          setNegocios(data.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-10 text-text-secondary">
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 mb-8">
        {[
          {
            label: "Total Negocios",
            value: stats?.totalNegocios ?? 0,
          },
          {
            label: "Negocios Activos",
            value: stats?.negociosActivos ?? 0,
          },
          {
            label: "Chatbots",
            value: stats?.negociosConChatbot ?? 0,
          },
          {
            label: "Total Chats",
            value: stats?.totalChats ?? 0,
          },
          {
            label: "Chats Hoy",
            value: stats?.chatsHoy ?? 0,
          },
        ].map((item) => (
          <div key={item.label} className={cardStyle}>
            <p className="text-sm text-text-secondary mb-2">
              {item.label}
            </p>

            <h2 className="text-3xl font-bold">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className={cardStyle}>
        <h2 className="text-xl font-semibold mb-6">
          Negocios recientes
        </h2>

        <div className="space-y-4">
          {negocios.slice(0, 10).map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between border-b border-border pb-4"
            >
              <div>
                <h3 className="font-semibold">
                  {n.name}
                </h3>

                <p className="text-sm text-text-secondary">
                  {n.city} · {n.category}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  n.isActive
                    ? "bg-success/15 text-success"
                    : "bg-border text-text-secondary"
                }`}
              >
                {n.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user, token, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="py-16 text-center">
        Cargando...
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="flex-1 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title={isAdmin ? "Panel de Administración" : "Dashboard"}
          subtitle={
            user
              ? `Bienvenido nuevamente, ${user.name}${isAdmin ? " 👑" : ""}`
              : ""
          }
        />

        {isAdmin ? (
          <AdminDashboard token={token!} />
        ) : (
          <OwnerDashboard token={token!} />
        )}
      </div>
    </main>
  );
}