"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/src/lib/auth-context";

import {
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  Bot,
  Users,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const userRole = user?.role === "admin" ? "admin" : "owner";

  const dashboardLinks = user
    ? [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },

        ...(userRole === "owner"
          ? [
              {
                href: "/mi-negocio",
                label: "Mi Negocio",
                icon: Store,
              },
              {
                href: "/mi-negocio/productos",
                label: "Productos",
                icon: Package,
              },
              {
                href: "/chats",
                label: "Conversaciones",
                icon: MessageSquare,
              },
              {
                href: "/chatbot",
                label: "Entrenar IA",
                icon: Bot,
              },
            ]
          : [
              {
                href: "/negocios",
                label: "Negocios",
                icon: Eye,
              },
              {
                href: "/admin/users",
                label: "Usuarios",
                icon: Users,
              },
            ]),

        {
          href: "/politicas-de-privacidad",
          label: "Políticas",
          icon: Settings,
        },
      ]
    : [];

  return (
    <>
      {/* ==========================
            DESKTOP
      ========================== */}

      <nav className="ticket-perforated-bottom sticky top-0 z-50 hidden bg-background/80 backdrop-blur-xl md:block">

        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-8">

          <Link href={user ? "/dashboard" : "/"}>
            <Image
              src="/logo.svg"
              alt="Klikeo"
              width={165}
              height={46}
              priority
            />
          </Link>

          {!user ? (
            <div className="flex items-center gap-6">

              <Link
                href="/negocios"
                className="font-mono text-xs uppercase tracking-widest text-text-secondary transition hover:text-primary"
              >
                Explorar
              </Link>

              <Link
                href="/login"
                className="font-mono text-xs uppercase tracking-widest text-primary transition hover:opacity-80"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-on-primary transition hover:scale-[1.02]"
              >
                Registrar negocio
              </Link>

            </div>
          ) : (
            <div className="flex items-center gap-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-on-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                  <p className="text-sm font-semibold text-text">
                    {user.name}
                  </p>

                  <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                    {user.role}
                  </p>

                </div>

              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2 font-mono text-xs uppercase tracking-wide text-text-secondary transition hover:border-primary hover:text-primary"
              >
                <LogOut size={16} />
                Salir
              </button>

            </div>
          )}
        </div>
      </nav>

      {/* ==========================
            MOBILE
      ========================== */}

      <nav className="ticket-perforated-bottom sticky top-0 z-50 bg-background md:hidden">

        <div className="flex h-16 items-center justify-between px-5">

          <Link href={user ? "/dashboard" : "/"}>
            <Image
              src="/logo.svg"
              alt="Klikeo"
              width={145}
              height={40}
              priority
            />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl p-2 hover:bg-card"
          >
            <Menu size={24} />
          </button>

        </div>

      </nav>

      {/* ==========================
            MOBILE MENU
      ========================== */}

      {isOpen && (
        <div className="fixed inset-0 z-100">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-card shadow-2xl">

            <div className="flex items-center justify-between border-b border-dashed border-border p-5">

              <Image
                src="/logo.svg"
                alt="Klikeo"
                width={140}
                height={38}
              />

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 hover:bg-background"
              >
                <X size={22} />
              </button>

            </div>

            {user && (
              <div className="border-b border-dashed border-border p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <p className="font-semibold text-text">
                      {user.name}
                    </p>

                    <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                      {user.role}
                    </p>

                  </div>

                </div>

              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4">

              {user &&
                dashboardLinks.map((item) => {

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-text transition hover:bg-background"
                    >
                      <Icon size={20} />

                      <span>{item.label}</span>

                    </Link>
                  );
                })}

              {!user && (
                <>
                  <Link
                    href="/negocios"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 hover:bg-background"
                  >
                    Explorar
                  </Link>

                  <Link
                    href="/politicas-de-privacidad"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 hover:bg-background"
                  >
                    Políticas
                  </Link>
                </>
              )}

            </div>

            <div className="border-t border-dashed border-border p-5">

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 transition hover:border-primary hover:text-primary"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              ) : (
                <div className="space-y-3">

                  <Link
                    href="/login"
                    className="block rounded-xl border border-primary py-3 text-center text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar sesión
                  </Link>

                  <Link
                    href="/register"
                    className="block rounded-xl bg-primary py-3 text-center font-semibold text-on-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrar negocio
                  </Link>

                </div>
              )}

            </div>

          </aside>

        </div>
      )}
    </>
  );
}