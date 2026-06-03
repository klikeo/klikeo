'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { apiClient, ProductCategoryPublic, ProductPublic } from '@/src/lib/api-client'

interface NegocioCategoriesSpyProps {
  businessSlug: string
}

interface CategorySection {
  id: string
  name: string
  products: ProductPublic[]
}

export default function NegocioCategoriesSpy({ businessSlug }: NegocioCategoriesSpyProps) {
  const [categories, setCategories] = useState<ProductCategoryPublic[]>([])
  const [products, setProducts] = useState<ProductPublic[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const rootRef = useRef<HTMLDivElement | null>(null)
  const categoriesNavRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      setError(null)
      try {
        const [categoriesResult, productsResult] = await Promise.all([
          apiClient.negocios.getCategories(businessSlug),
          apiClient.negocios.getProducts(businessSlug),
        ])
        setCategories(categoriesResult.data)
        setProducts(productsResult.data)
        setActiveSection(categoriesResult.data[0]?.id ?? '')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo cargar el menú del negocio'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (businessSlug) {
      fetchMenu()
    }
  }, [businessSlug])

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) => product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query))
  }, [products, searchTerm])

  const sections = useMemo<CategorySection[]>(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      products: filteredProducts.filter((product) => product.category === category.name),
    }))
  }, [categories, filteredProducts])

  const centerActiveTab = (id: string) => {
    const button = document.getElementById(`category-tab-${id}`)
    const container = categoriesNavRef.current
    if (!button || !container) return

    const offset = button.offsetLeft - container.clientWidth / 2 + button.clientWidth / 2
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }

  const updateActiveSection = () => {
    const container = rootRef.current
    if (!container) return

    const containerTop = container.getBoundingClientRect().top
    let bestSectionId = activeSection
    let bestDistance = Number.POSITIVE_INFINITY

    sectionRefs.current.forEach((section) => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.abs(rect.top - containerTop - 32)
      if (distance < bestDistance) {
        bestDistance = distance
        bestSectionId = section.id
      }
    })

    if (bestSectionId !== activeSection) {
      setActiveSection(bestSectionId)
    }
  }

  useEffect(() => {
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root: rootRef.current,
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0.25,
      },
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    const container = rootRef.current
    const handleScroll = () => updateActiveSection()
    container?.addEventListener('scroll', handleScroll, { passive: true })
    updateActiveSection()

    return () => {
      observer.disconnect()
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [sections, activeSection])

  useEffect(() => {
    if (activeSection) {
      centerActiveTab(activeSection)
    }
  }, [activeSection])

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-2xl bg-background" />
          <div className="h-10 rounded-2xl bg-background" />
          <div className="h-72 rounded-3xl bg-background" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 shadow-sm">
        {error}
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 text-sm text-text shadow-sm">
        <p className="font-semibold">Este negocio aún no tiene categorías públicas.</p>
        <p className="mt-2 text-muted">Cuando el comercio agregue su catálogo, aquí verás las categorías disponibles.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="mb-8">
        <label className="block text-sm font-medium text-muted mb-3">Buscar en el menú</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">🔎</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Hamburguesa, hotdogs..."
              className="w-full rounded-2xl border border-border bg-background px-12 py-3 text-text placeholder:text-muted outline-none transition focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div
        ref={categoriesNavRef}
        className="mb-6 overflow-x-auto pb-1 hide-scrollbar"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <div className="flex items-center gap-3 min-w-180">
          {sections.map((section) => (
            <button
              key={section.id}
              id={`category-tab-${section.id}`}
              type="button"
              onClick={() => {
                const sectionElement = document.getElementById(section.id)
                sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                centerActiveTab(section.id)
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeSection === section.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background text-text border border-border hover:bg-surface'
              }`}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rootRef}
        className="space-y-8 max-h-180 overflow-y-auto pr-2 scroll-smooth hide-scrollbar"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            data-index={index}
            ref={(el) => {
              if (el) sectionRefs.current[index] = el
            }}
            className="scroll-mt-24"
          >
            <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-border bg-background p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-text">{section.name}</h2>
                  <p className="text-sm text-muted">{section.products.length} opciones</p>
                </div>
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  {section.products.length} artículos
                </span>
              </div>
            </div>

            {section.products.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface p-6 text-sm text-muted">
                Aún no hay productos en esta categoría.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.products.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="h-40 overflow-hidden rounded-3xl bg-slate-100">
                      <img
                        src={product.imageUrl ?? 'https://via.placeholder.com/320x240?text=Producto'}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-text">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed min-h-[3rem]">
                      {product.description ?? 'Producto sin descripción.'}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-text">
                      <span>${product.price.toFixed(2)}</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{product.isActive ? 'Disponible' : 'No disponible'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          height: 0;
          width: 0;
        }
      `}</style>
    </div>
  )
}
