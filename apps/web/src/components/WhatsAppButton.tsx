'use client'

interface WhatsAppButtonProps {
  whatsappNumber: string
  negocioName: string
}

export default function WhatsAppButton({ whatsappNumber, negocioName }: WhatsAppButtonProps) {
  const number = whatsappNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hola, me gustaría obtener información sobre ${negocioName}.`)
  const url = `https://wa.me/${number}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-7 py-3.5 rounded-lg no-underline text-base font-semibold min-h-[44px] hover:opacity-90 transition-opacity"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.529 5.835L.057 23.571a.5.5 0 00.6.6l5.757-1.477A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.5a9.443 9.443 0 01-4.862-1.346l-.348-.206-3.617.928.947-3.489-.228-.362A9.443 9.443 0 012.5 12C2.5 6.71 6.71 2.5 12 2.5S21.5 6.71 21.5 12 17.29 21.5 12 21.5z" />
      </svg>
      Chatear en WhatsApp
    </a>
  )
}