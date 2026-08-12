'use client'

import { useEffect } from 'react'
import { useAuth } from '@/src/lib/auth-context'
import { usePathname, useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, accessToken, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    const authPages = ['/', '/login', '/register']
    if (user && accessToken && authPages.includes(pathname)) {
      router.replace('/dashboard')
    }
  }, [user, accessToken, loading, pathname, router])

  if (loading) {
    return null
  }

  if (user && accessToken) {
    return pathname === '/' || pathname === '/login' || pathname === '/register' ? null : <>{children}</>
  }

  return <>{children}</>
}