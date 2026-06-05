'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  Bot,
  Users,
  Eye,
  Settings,
} from 'lucide-react'

interface SidebarItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: ('owner' | 'admin')[]
}

const sidebarItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    roles: ['owner', 'admin'],
  },
  {
    href: '/mi-negocio',
    label: 'Mi Negocio',
    icon: <Store size={20} />,
    roles: ['owner'],
  },
  {
    href: '/mi-negocio/productos',
    label: 'Productos',
    icon: <Package size={20} />,
    roles: ['owner'],
  },
  {
    href: '/chats',
    label: 'Conversaciones',
    icon: <MessageSquare size={20} />,
    roles: ['owner'],
  },
  {
    href: '/chatbot',
    label: 'Entrenar Chatbot',
    icon: <Bot size={20} />,
    roles: ['owner'],
  },
  {
    href: '/negocios',
    label: 'Ver Negocios',
    icon: <Eye size={20} />,
    roles: ['admin'],
  },
  {
    href: '/admin/users',
    label: 'Gestión Usuarios',
    icon: <Users size={20} />,
    roles: ['admin'],
  },
]

interface DashboardSidebarProps {
  userRole: 'owner' | 'admin'
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname()

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <aside className="hidden lg:flex w-64 bg-surface border-r border-border flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-text">Navegación</h2>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text hover:bg-border/50 text-opacity-80'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/mi-negocio/categorias"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text hover:bg-border/50 no-underline transition-all"
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Configuración</span>
        </Link>
      </div>
    </aside>
  )
}
