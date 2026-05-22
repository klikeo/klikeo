'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser({ email, password })
    console.log('=result===================================');
    console.log(result);
    console.log('====================================');
    setUser(result.user)
    setAccessToken(result.accessToken)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const result = await registerUser({ email, password, name })
    setUser(result.user)
    setAccessToken(result.accessToken)
  }, [])

  const logout = useCallback(async () => {
    if (accessToken) {
      await logoutUser(accessToken).catch(() => {})
    }
    setUser(null)
    setAccessToken(null)
  }, [accessToken])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken
    try {
      const newToken = await refreshAccessToken()
      setAccessToken(newToken)
      return newToken
    } catch {
      return null
    }
  }, [accessToken])

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
