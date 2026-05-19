'use client'

import { useAuth } from '@/src/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useRequireAuth() {
  const { user, getAccessToken } = useAuth()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAccessToken().then((t) => {
      if (!t) {
        router.push('/login')
      } else {
        setToken(t)
      }
      setLoading(false)
    })
  }, [getAccessToken, router])

  return { user, token, loading }
}
