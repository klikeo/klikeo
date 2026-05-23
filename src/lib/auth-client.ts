const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "owner"
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
}

export async function registerUser(data: {
  email: string
  password: string
  name: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Error al registrar")
  return json
}

export async function loginUser(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Credenciales inválidas")

  return json
}

export async function logoutUser(accessToken: string): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  })
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Session expirada")
  return json.accessToken
}
