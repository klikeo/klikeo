'use client'

import { useAuth } from '@/src/lib/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useRequireAuth() {
  const { user, loading: authLoading, getAccessToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) {
      setLoading(true)
      return
    }

    const resolveToken = async () => {
      const t = await getAccessToken()
      setToken(t)

      if (!user && !t) {
        const redirect = pathname && pathname !== '/login' ? `?redirect=${encodeURIComponent(pathname)}` : ''
        router.replace(`/login${redirect}`)
      }

      setLoading(false)
    }

    void resolveToken()
  }, [authLoading, getAccessToken, pathname, router, user])

  return { user, token, loading: authLoading || loading }
}
