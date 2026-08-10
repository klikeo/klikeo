"use client"

import Footer from "@/src/components/Footer"
import Navbar from "@/src/components/Navbar"
import { useAuth } from "@/src/lib/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z
  .object({
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

type FormData = z.infer<typeof schema>

export default function ActualizarContrasenaPage() {
  const { updatePassword } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await updatePassword(data.password)
      setDone(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "No se pudo actualizar la contraseña",
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

              {done ? (
                <>
                  <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
                    ¡Listo! 🎉
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Tu contraseña se actualizó. Te llevamos al login...
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                    <KeyRound size={14} className="text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Nueva contraseña
                    </span>
                  </div>

                  <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
                    Crea tu nueva contraseña
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    Elegí una contraseña segura para tu cuenta.
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
                        Contraseña nueva
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
                      {errors.password && (
                        <p className="mt-1 text-xs text-danger">
                          {errors.password.message}
                        </p>
                      )}
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-transform hover:scale-110 hover:text-text"
                        >
                          {showConfirmPassword ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-danger">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-1 min-h-[44px] w-full rounded-lg bg-primary py-3 text-base font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? "Guardando..." : "Guardar contraseña"}
                    </button>
                  </form>
                </>
              )}

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}