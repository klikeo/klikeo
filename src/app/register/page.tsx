"use client"

import Footer from "@/src/components/Footer"
import Navbar from "@/src/components/Navbar"
import { useAuth } from "@/src/lib/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Debe contener al menos una letra mayúscula",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Debe contener al menos una letra minúscula",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Debe contener al menos un número",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Debe contener al menos un carácter especial (!@#$%...)",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-danger">{message}</p>
}

export default function RegisterPage() {
  const { register: registerAuth } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerAuth(data.email, data.password, data.name)
      router.push("/dashboard")
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Error al registrarse",
      })
    }
  }

  const inputBaseClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-12 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">

          <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-6 shadow-card sm:rounded-3xl sm:p-10">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Es gratis durante el MVP
                </span>
              </div>

              <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
                Registra tu negocio
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Empieza a vender por WhatsApp en minutos
              </p>

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
                    Nombre completo
                  </label>
                  <input
                    {...register("name")}
                    autoComplete="name"
                    className={`${inputBaseClass} ${errors.name ? "border-danger" : ""}`}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className={`${inputBaseClass} ${errors.email ? "border-danger" : ""}`}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputBaseClass} ${errors.password ? "border-danger" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-transform hover:scale-110 hover:text-text"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputBaseClass} ${errors.confirmPassword ? "border-danger" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-transform hover:scale-110 hover:text-text"
                    >
                      {showConfirmPassword ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                  <FieldError message={errors.confirmPassword?.message} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 min-h-[44px] w-full rounded-lg bg-primary py-3 text-base font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? "Registrando..." : "Crear cuenta"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-text-secondary">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary no-underline hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}