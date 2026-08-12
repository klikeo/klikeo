"use client"

import Footer from "@/src/components/Footer"
import Navbar from "@/src/components/Navbar"
import { useAuth } from "@/src/lib/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  email: z.string().email("Email inválido"),
})

type FormData = z.infer<typeof schema>

export default function RecuperarContrasenaPage() {
  const { resetPassword } = useAuth()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error ? err.message : "No se pudo enviar el correo",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-12 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">

          <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-6 shadow-card sm:rounded-3xl sm:p-10">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">

              {sent ? (
                <>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
                    <CheckCircle2 size={14} className="text-success" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-success">
                      Correo enviado
                    </span>
                  </div>

                  <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
                    Revisa tu correo
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    Te enviamos un link para crear una contraseña nueva.
                    Si no lo ves, revisá la carpeta de spam.
                  </p>

                  <Link
                    href="/login"
                    className="mt-8 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    ← Volver a iniciar sesión
                  </Link>
                </>
              ) : (
                <>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Recuperar acceso
                    </span>
                  </div>

                  <h1 className="font-heading text-3xl font-semibold text-text sm:text-4xl">
                    ¿Olvidaste tu contraseña?
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    Escribí tu email y te mandamos un link para crear una nueva.
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
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                        />
                        <input
                          {...register("email")}
                          type="email"
                          autoComplete="email"
                          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm text-text outline-none transition-colors focus:border-primary"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-danger">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-1 min-h-11 w-full rounded-lg bg-primary py-3 text-base font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar link"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-text-secondary">
                    <Link
                      href="/login"
                      className="font-medium text-primary no-underline hover:underline"
                    >
                      ← Volver a iniciar sesión
                    </Link>
                  </p>
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