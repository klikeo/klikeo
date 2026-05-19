"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/src/lib/auth-context"
import Navbar from "@/src/components/Navbar"

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-destructive text-xs mt-1">{message}</p>
}

export default function RegisterPage() {
  const { register: registerAuth } = useAuth()
  const router = useRouter()
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
    "w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none bg-surface text-text border-border focus:border-primary"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto mt-16 px-6">
        <div className="bg-surface rounded-xl p-10 border border-border">
          <h1 className="text-2xl font-bold mb-2 text-text text-center">
            Registra tu negocio
          </h1>
          <p className="text-center text-muted text-sm mb-8">
            Es gratis durante el MVP
          </p>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-red-600 text-sm">
              {errors.root.message}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Nombre completo
              </label>
              <input
                {...register("name")}
                autoComplete="name"
                className={`${inputBaseClass} ${errors.name ? "border-destructive" : ""}`}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className={`${inputBaseClass} ${errors.email ? "border-destructive" : ""}`}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                className={`${inputBaseClass} ${errors.password ? "border-destructive" : ""}`}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-text">
                Confirmar contraseña
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                className={`${inputBaseClass} ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] mt-1 hover:bg-primary-dark transition-colors"
            >
              {isSubmitting ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-primary no-underline font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
