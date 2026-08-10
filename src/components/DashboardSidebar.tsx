"use client";

import {
  Bot,
  Eye,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Store,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRequireAuth } from "../lib/hooks/useRequireAuth";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: ("owner" | "admin")[];
}

const sidebarItems: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["owner", "admin"],
  },
  {
    href: "/mi-negocio",
    label: "Mi negocio",
    icon: <Store size={18} />,
    roles: ["owner"],
  },
  {
    href: "/mi-negocio/productos",
    label: "Productos",
    icon: <Package size={18} />,
    roles: ["owner"],
  },
  {
    href: "/chats",
    label: "Conversaciones",
    icon: <MessageSquare size={18} />,
    roles: ["owner"],
  },
  {
    href: "/chatbot",
    label: "Entrenar IA",
    icon: <Bot size={18} />,
    roles: ["owner"],
  },
  {
    href: "/negocios",
    label: "Negocios",
    icon: <Eye size={18} />,
    roles: ["admin"],
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    icon: <Users size={18} />,
    roles: ["admin"],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useRequireAuth();

  const userRole = user?.role === "admin" ? "admin" : "owner";

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-border bg-card">

      {/* Perfil */}

      <div className="border-b border-border p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() ?? "K"}
          </div>

          <div>

            <h3 className="font-semibold text-text">
              {user?.name ?? "Usuario"}
            </h3>

            <p className="text-sm text-text-secondary capitalize">
              {userRole}
            </p>

          </div>

        </div>

      </div>

      {/* Navegación */}

      <nav className="flex-1 space-y-2 p-5">

        {filteredItems.map((item) => {

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-primary text-black shadow-lg"
                  : "text-text-secondary hover:bg-background hover:text-text"
              }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>

              <span className="font-medium">
                {item.label}
              </span>

            </Link>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-border p-5">

        <Link
          href="/mi-negocio/categorias"
          className="flex items-center gap-4 rounded-xl px-4 py-3 text-text-secondary transition hover:bg-background hover:text-text"
        >
          <Settings size={18} />

          <span>Configuración</span>

        </Link>

      </div>

    </aside>
  );
}