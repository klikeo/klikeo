'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/src/components/Navbar'
import { useRequireAuth } from '@/src/lib/hooks/useRequireAuth'
import { dashboardClient, NegocioDashboard } from '@/src/lib/dashboard-client'

const chatbotSchema = z.object({
  trainingData: z.string().min(10, 'Escribe al menos 10 caracteres para entrenar el chatbot'),
})

type ChatbotForm = z.infer<typeof chatbotSchema>

export default function ChatbotPage() {
  const { token, loading } = useRequireAuth()
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<ChatbotForm>({
    resolver: zodResolver(chatbotSchema),
  })

  useEffect(() => {
    if (!token) return
    dashboardClient.negocios.getByOwner(token)
      .then((n) => {
        setNegocio(n)
        if (n.trainingData) reset({ trainingData: n.trainingData })
      })
      .catch(() => {})
  }, [token, reset])

  const onSubmit = async (data: ChatbotForm) => {
    if (!token || !negocio) return
    try {
      await dashboardClient.negocios.trainChatbot(negocio.id, data.trainingData, token)
      setSuccess('¡Chatbot entrenado exitosamente!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : 'Error al entrenar' })
    }
  }

  if (loading) return <div className="py-16 text-center text-muted">Cargando...</div>

  const isDisabled = isSubmitting || !negocio

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-text mb-2">
          Entrenar Chatbot
        </h1>
        <p className="text-muted text-sm mb-8">
          Escribe la información de tu negocio para que el asistente virtual pueda responder a tus clientes.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 text-green-700 text-sm">
            {success}
          </div>
        )}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm mb-6">
            <strong>Ejemplo de información:</strong><br />
            Somos Panadería El Sol, ubicada en Calle 10 #5-20, Bogotá. Horario: L-V 6am–8pm, Sáb 7am–6pm. Ofrecemos: pan artesanal, tortas personalizadas, café, pastelería. Para pedidos especiales llamar al 3001234567. Hacemos domicilios en la zona norte.
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium mb-2 text-text">
              Información para entrenar el chatbot
            </label>
            <textarea
              {...register('trainingData')}
              rows={10}
              placeholder="Describe tu negocio: horarios, productos, servicios, precios, políticas, dirección, formas de pago..."
              className={`w-full px-3.5 py-3 border rounded-lg text-sm bg-surface text-text border-border focus:border-primary outline-none resize-y font-inherit ${errors.trainingData ? 'border-destructive' : ''}`}
            />
            {errors.trainingData && (
              <p className="text-destructive text-xs mt-1">{errors.trainingData.message}</p>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              className={`mt-5 w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold disabled:opacity-50 min-h-[44px] transition-colors ${isDisabled ? '' : 'hover:bg-primary-dark'}`}
            >
              {isSubmitting ? 'Entrenando...' : 'Entrenar chatbot'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}