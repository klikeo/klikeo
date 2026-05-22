"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { useAuth } from "@/src/lib/auth-context"
import Navbar from "@/src/components/Navbar"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      router.push("/???")
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Error al iniciar sesión",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-surface rounded-xl p-10 border border-border">
        <h1 className="text-2xl font-bold mb-2 text-text text-center">
          Iniciar sesión
        </h1>
        <p className="text-center text-muted text-sm mb-8">
          Accede a tu panel de control
        </p>

        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-text">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none bg-surface text-text border-border focus:border-primary"
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-text">
              Contraseña
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none bg-surface text-text border-border focus:border-primary"
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] hover:bg-primary-dark transition-colors"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-primary no-underline font-medium hover:underline"
          >
            Regístrala gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="text-center mt-16">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
