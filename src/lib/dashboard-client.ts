const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface FetchOptions extends RequestInit {
  token: string
}

async function authFetch<T>(path: string, options: FetchOptions): Promise<T> {
  const { token, ...rest } = options
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...rest.headers,
  }

  if (!(rest.body instanceof FormData)) {
    ;(headers as Record<string, string>)['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
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
  bannerUrl?: string
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

export interface ProductIngredient {
  name: string
  extraPrice?: number
  isDefault?: boolean
}

export interface ProductAddition {
  name: string
  price: number
  description?: string
  isDefault?: boolean
}

export interface ProductDashboard {
  id: string
  negocioId: string
  name: string
  description?: string
  category: string
  price: number
  stock: number
  imageUrl?: string
  imagePublicId?: string
  isActive: boolean
  isDeleted: boolean
  ingredients?: ProductIngredient[]
  additions?: ProductAddition[]
  createdAt: string
  updatedAt: string
}

export interface ProductCategoryDashboard {
  id: string
  negocioId: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ListProductCategoriesByBusinessResponse {
  data: ProductCategoryDashboard[]
  total: number
  page: number
  totalPages: number
}

export interface ListProductsByBusinessResponse {
  data: ProductDashboard[]
  total: number
  page: number
  totalPages: number
}

export interface CreateProductPayload {
  name: string
  description?: string
  category: string
  price: number
  stock: number
  isActive: boolean
  ingredients?: ProductIngredient[]
  additions?: ProductAddition[]
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

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
    uploadAssets(id: string, formData: FormData, token: string): Promise<NegocioDashboard> {
      return authFetch(`/api/negocios/${id}/assets`, { token, method: 'POST', body: formData })
    },
    deleteLogo(id: string, token: string): Promise<NegocioDashboard> {
      return authFetch(`/api/negocios/${id}/logo`, { token, method: 'DELETE' })
    },
    deleteBanner(id: string, token: string): Promise<NegocioDashboard> {
      return authFetch(`/api/negocios/${id}/banner`, { token, method: 'DELETE' })
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
  productCategories: {
    listByBusiness(id: string, token: string, page = 1, limit = 50): Promise<ListProductCategoriesByBusinessResponse> {
      return authFetch(`/api/negocios/${id}/categorias?page=${page}&limit=${limit}`, { token, method: 'GET' })
    },
    create(id: string, data: { name: string; isActive?: boolean }, token: string): Promise<ProductCategoryDashboard> {
      return authFetch(`/api/negocios/${id}/categorias`, {
        token,
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update(id: string, data: { name?: string; isActive?: boolean }, token: string): Promise<ProductCategoryDashboard> {
      return authFetch(`/api/categorias/${id}`, {
        token,
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    delete(id: string, token: string): Promise<{ message: string }> {
      return authFetch(`/api/categorias/${id}`, { token, method: 'DELETE' })
    },
  },
  productos: {
    listByBusiness(id: string, token: string, page = 1, limit = 50): Promise<ListProductsByBusinessResponse> {
      return authFetch(`/api/negocios/${id}/productos?page=${page}&limit=${limit}`, { token, method: 'GET' })
    },
    getById(id: string, token: string): Promise<ProductDashboard> {
      return authFetch(`/api/productos/${id}`, { token, method: 'GET' })
    },
    create(id: string, data: CreateProductPayload, token: string): Promise<ProductDashboard> {
      return authFetch(`/api/negocios/${id}/productos`, {
        token,
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update(id: string, data: UpdateProductPayload, token: string): Promise<ProductDashboard> {
      return authFetch(`/api/productos/${id}`, {
        token,
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    delete(id: string, token: string): Promise<{ message: string }> {
      return authFetch(`/api/productos/${id}`, { token, method: 'DELETE' })
    },
    uploadImage(id: string, formData: FormData, token: string): Promise<ProductDashboard> {
      return authFetch(`/api/productos/${id}/image`, { token, method: 'POST', body: formData })
    },
  },
}
