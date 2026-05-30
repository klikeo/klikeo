"use client"

import { useState } from "react"
import Link from "next/link"

import { useAuth } from "@/src/lib/auth-context"

interface NavbarProps {
  isAdmin?: boolean
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/mi-negocio", label: "Mi Negocio" },
        { href: "/chats", label: "Chats" },
        { href: "/chatbot", label: "Chatbot" },
        ...(isAdmin ? [{ href: "/admin/users", label: "Usuarios" }] : []),
        { href: "/politicas-de-privacidad", label: "Políticas" },
      ]
    : [
        { href: "/negocios", label: "Explorar" },
        { href: "/politicas-de-privacidad", label: "Políticas" },
      ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16 w-full">
          <Link href={user ? "/dashboard" : "/"} className="no-underline">
            <img src="/logo.svg" alt="Klikeo Logo" width={160} height={48} />
          </Link>

          <div className="flex items-center gap-6">
            {!user && (
              <Link
                href="/negocios"
                className="text-text no-underline text-sm hover:text-primary transition-colors"
              >
                Explorar
              </Link>
            )}

            {user ? (
              <>
                <span className="text-muted text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-primary no-underline text-sm font-medium hover:text-primary-dark transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Registrar negocio
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href={user ? "/dashboard" : "/"} className="no-underline">
            <img src="/logo.svg" alt="Klikeo Logo" width={160} height={48} />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6 text-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay con blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú desde la izquierda */}
          <div className="absolute left-0 top-0 h-full w-72 bg-surface shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <span className="text-xl font-bold text-primary">Klikeo</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cerrar menú"
              >
                <svg
                  className="w-5 h-5 text-text"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-text hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-border mt-4"
                >
                  Cerrar sesión
                </button>
              )}

              {!user && (
                <div className="px-4 mt-4 space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Registrar negocio
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
