'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { BUSINESS_CATEGORIES } from '../constants/categories'

const CATEGORY_LABELS: Record<string, string> = {
  alimentos: 'Alimentos',
  ropa: 'Ropa',
  salud: 'Salud',
  servicios: 'Servicios',
  tecnologia: 'Tecnología',
  educacion: 'Educación',
  belleza: 'Belleza',
  hogar: 'Hogar',
  deportes: 'Deportes',
  entretenimiento: 'Entretenimiento',
  transporte: 'Transporte',
  turismo: 'Turismo',
  mascotas: 'Mascotas',
  construccion: 'Construcción',
  otros: 'Otros',
}

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    router.push(`/negocios?${params.toString()}`)
  }, [search, category, city, router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Buscar negocios..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3.5 py-2.5 border border-border rounded-lg text-sm outline-none bg-surface text-text min-w-0 focus:border-primary flex-2 min-w-[200px]"
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-3.5 py-2.5 border border-border rounded-lg text-sm outline-none bg-surface text-text min-w-0 focus:border-primary flex-1 min-w-[120px]"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3.5 py-2.5 border border-border rounded-lg text-sm outline-none bg-surface text-text min-w-0 focus:border-primary flex-1 min-w-[140px]"
      >
        <option value="">Todas las categorías</option>
        {BUSINESS_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat] ?? cat}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="px-5 py-2.5 bg-primary text-white border-none rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap min-h-[44px] hover:bg-primary-dark transition-colors"
      >
        Buscar
      </button>
    </div>
  )
}