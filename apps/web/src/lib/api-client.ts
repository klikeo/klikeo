const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// Types
export interface NegocioPublic {
  id: string
  name: string
  description?: string
  category: string
  address?: string
  city: string
  phone?: string
  whatsappNumber: string
  logoUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ListNegociosResponse {
  data: NegocioPublic[]
  total: number
  page: number
  totalPages: number
}

export interface ListNegociosParams {
  search?: string
  city?: string
  category?: string
  page?: number
  limit?: number
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  negocioId?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// Auth state management
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

// Base fetch function
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    ...options.headers,
  }
  
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for refresh token
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error((error as { error: string }).error ?? 'Error de API')
  }
  return res.json() as Promise<T>
}

// API Client
export const apiClient = {
  // Auth methods
  auth: {
    login(email: string, password: string): Promise<AuthResponse> {
      return apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    },

    register(email: string, password: string, name: string): Promise<AuthResponse> {
      return apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
    },

    logout(): Promise<{ message: string }> {
      return apiFetch<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      })
    },

    refresh(): Promise<{ accessToken: string }> {
      return apiFetch<{ accessToken: string }>('/api/auth/refresh', {
        method: 'POST',
      })
    },

    async getProfile(): Promise<User> {
      // For now, we get user from login response
      // In a full implementation, this would call /api/auth/me
      throw new Error('Not implemented yet')
    },
  },

  // Negocios methods
  negocios: {
    list(params: ListNegociosParams = {}): Promise<ListNegociosResponse> {
      const query = new URLSearchParams()
      if (params.search) query.set('search', params.search)
      if (params.city) query.set('city', params.city)
      if (params.category) query.set('category', params.category)
      if (params.page) query.set('page', String(params.page))
      if (params.limit) query.set('limit', String(params.limit))
      const qs = query.toString()
      return apiFetch<ListNegociosResponse>(`/api/negocios${qs ? `?${qs}` : ''}`, {
        cache: 'no-store',
      })
    },

    getById(id: string): Promise<NegocioPublic> {
      return apiFetch<NegocioPublic>(`/api/negocios/${id}`, {
        next: { revalidate: 3600 },
      })
    },

    create(data: {
      name: string
      category: string
      city: string
      whatsappNumber: string
      description?: string
      address?: string
      phone?: string
    }): Promise<NegocioPublic> {
      return apiFetch<NegocioPublic>('/api/negocios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    },

    update(id: string, data: Partial<NegocioPublic>): Promise<NegocioPublic> {
      return apiFetch<NegocioPublic>(`/api/negocios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    },

    train(id: string, trainingData: string): Promise<{ message: string }> {
      return apiFetch<{ message: string }>(`/api/negocios/${id}/chat/entrenar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingData }),
      })
    },
  },
}