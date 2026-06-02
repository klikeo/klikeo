const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface FetchOptions extends RequestInit {
  token: string
}

async function authFetch<T>(path: string, options: FetchOptions): Promise<T> {
  const { token, ...rest } = options
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...rest.headers,
    },
    credentials: 'include',
  })
  const json = await res.json()
  if (!res.ok) throw new Error((json as { error: string }).error ?? 'Error de API')
  return json as T
}

export interface NegocioDashboard {
  id: string
  slug?: string
  name: string
  description?: string
  category: string
  city: string
  phone?: string
  whatsappNumber: string
  address?: string
  logoUrl?: string
  trainingData?: string
  isActive: boolean
}

export interface ChatSessionItem {
  id: string
  clientePhone: string
  estado: 'active' | 'closed'
  historial: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>
  createdAt: string
  updatedAt: string
}

export const dashboardClient = {
  negocios: {
    getByOwner(token: string): Promise<NegocioDashboard> {
      return authFetch('/api/negocios/me', { token, method: 'GET' })
    },
    getById(id: string, token: string): Promise<NegocioDashboard> {
      return authFetch(`/api/negocios/${id}`, { token, method: 'GET' })
    },
    update(id: string, data: Partial<NegocioDashboard>, token: string): Promise<NegocioDashboard> {
      return authFetch(`/api/negocios/${id}`, { token, method: 'PUT', body: JSON.stringify(data) })
    },
    create(data: Omit<NegocioDashboard, 'id' | 'isActive'>, token: string): Promise<NegocioDashboard> {
      return authFetch('/api/negocios', { token, method: 'POST', body: JSON.stringify(data) })
    },
    trainChatbot(id: string, trainingData: string, token: string): Promise<{ message: string }> {
      return authFetch(`/api/negocios/${id}/chat/entrenar`, {
        token,
        method: 'POST',
        body: JSON.stringify({ trainingData }),
      })
    },
    getChats(id: string, token: string, page = 1): Promise<{ data: ChatSessionItem[]; total: number }> {
      return authFetch(`/api/negocios/${id}/chats?page=${page}`, { token, method: 'GET' })
    },
  },
}
