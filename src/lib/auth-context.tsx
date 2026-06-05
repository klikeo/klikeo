'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AuthUser, loginUser, logoutUser, refreshAccessToken, registerUser } from './auth-client'

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  login(email: string, password: string): Promise<void>
  register(email: string, password: string, name: string): Promise<void>
  logout(): Promise<void>
  getAccessToken(): Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_STORAGE_KEY = 'klikeo.user'
const ACCESS_TOKEN_STORAGE_KEY = 'klikeo.accessToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const setPersistedUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser)
    if (typeof window === 'undefined') return
    if (nextUser) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [])

  const setPersistedAccessToken = useCallback((token: string | null) => {
    setAccessToken(token)
    if (typeof window === 'undefined') return
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY)
    const storedToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY)
      }
    }

    if (storedToken) {
      setAccessToken(storedToken)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser({ email, password })
    setPersistedUser(result.user)
    setPersistedAccessToken(result.accessToken)
  }, [setPersistedAccessToken, setPersistedUser])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const result = await registerUser({ email, password, name })
    setPersistedUser(result.user)
    setPersistedAccessToken(result.accessToken)
  }, [setPersistedAccessToken, setPersistedUser])

  const logout = useCallback(async () => {
    if (accessToken) {
      await logoutUser(accessToken).catch(() => {})
    }
    setPersistedUser(null)
    setPersistedAccessToken(null)
  }, [accessToken, setPersistedAccessToken, setPersistedUser])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken
    try {
      const newToken = await refreshAccessToken()
      setPersistedAccessToken(newToken)
      return newToken
    } catch {
      setPersistedAccessToken(null)
      return null
    }
  }, [accessToken, setPersistedAccessToken])

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
