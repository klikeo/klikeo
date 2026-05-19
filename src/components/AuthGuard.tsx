'use client'

import { useEffect } from 'react'
import { useAuth } from '@/src/lib/auth-context'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, accessToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si tenemos token pero no usuario (cargando)
    // o si ya tenemos usuario (ya logueado)
    if (accessToken && user) {
      router.replace('/dashboard')
    }
  }, [user, accessToken, router])

  // Si está logueado, no renderizamos nada (el useEffect se encarga de redirigir)
  if (user && accessToken) {
    return null
  }

  return <>{children}</>
}