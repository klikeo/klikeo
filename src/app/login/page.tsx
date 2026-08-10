"use client"
import Footer from "@/src/components/Footer"
import Navbar from "@/src/components/Navbar"
import { useAuth } from "@/src/lib/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      router.push("/dashboard")
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Error al iniciar sesión",
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-12 sm:px-6">
      <div className="w-full max-w-md animate-fade-up">

        <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-6 shadow-card sm:rounded-3xl sm:p-10">

          {/* Glow decorativo */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Bienvenido de nuevo
              </span>
            </div>

            <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Accede a tu panel de control
            </p>

            {/* Línea de corte tipo ticket */}
            <div className="my-6 border-t border-dashed border-border" />

            {errors.root && (
              <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                {errors.root.message}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-text">
                    Contraseña
                  </label>
                  <Link
                    href="/recuperar-contrasena"
                    className="text-xs text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-transform hover:scale-110 hover:text-text"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 min-h-[44px] w-full rounded-lg bg-primary py-3 text-base font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-primary no-underline hover:underline"
              >
                Regístrala gratis
              </Link>
            </p>

          </div>

        </div>

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
      <Footer />
    </div>
  )
}