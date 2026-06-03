'use client'

import { useEffect, useRef, useState } from 'react'

const categorySections = [
  {
    id: 'hamburguesas',
    title: 'Hamburguesas',
    subtitle: 'Clásicas, gourmet y combos',
    description:
      'Prueba nuestras hamburguesas más vendidas con pan artesanal, queso fundido y vegetales frescos.',
    cards: [
      { name: 'Hamburguesa Beef', detail: 'Carne 100% vacuno, cheddar y salsa especial.' },
      { name: 'Hamburguesa Pollo Crispy', detail: 'Pechuga empanizada con lechuga y mayonesa de la casa.' },
      { name: 'Hamburguesa Veggie', detail: 'Beyond Meat, queso vegano y alioli de ajo.' },
    ],
  },
  {
    id: 'hotdogs',
    title: 'Hot Dogs',
    subtitle: 'Sencillos, dobles y premium',
    description:
      'Nuestra selección de hot dogs incluye opciones clásicas y combinaciones de sabores explosivos.',
    cards: [
      { name: 'Hot Dog Clásico', detail: 'Salchicha alemana, kétchup, mostaza y papitas fritas.' },
      { name: 'Hot Dog Bacon', detail: 'Con bacon crujiente, cebolla caramelizada y chimichurri.' },
      { name: 'Hot Dog Especial', detail: 'Queso fundido, pepinillos y salsa casera.' },
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    subtitle: 'Refrescos, jugos y cocteles',
    description:
      'Acompaña tu orden con bebidas frías, jugos naturales o cocteles preparados para compartir.',
    cards: [
      { name: 'Limonada Casera', detail: 'Natural con hierbabuena.' },
      { name: 'Malteada de Vainilla', detail: 'Cremosa y dulce con topping de oreo.' },
      { name: 'Gaseosa 500ml', detail: 'Variedad de marcas disponibles.' },
    ],
  },
  {
    id: 'postres',
    title: 'Postres',
    subtitle: 'Dulces para el final',
    description:
      'Cierra con lo mejor: brownies, helados y postres rápidos listos para compartir.',
    cards: [
      { name: 'Brownie Chocolate', detail: 'Con helado de vainilla y salsa de caramelo.' },
      { name: 'Helado Artesanal', detail: 'Sabores del día.' },
      { name: 'Churros', detail: 'Rellenos de chocolate o dulce de leche.' },
    ],
  },
]

export default function NegocioCategoriesSpy() {
  const [activeSection, setActiveSection] = useState(categorySections[0].id)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const rootRef = useRef<HTMLDivElement | null>(null)
  const categoriesNavRef = useRef<HTMLDivElement | null>(null)

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
      }
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
  }, [])

  useEffect(() => {
    centerActiveTab(activeSection)
  }, [activeSection])

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="mb-8">
        <label className="block text-sm font-medium text-muted mb-3">
          Buscar en el menú
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
              🔎
            </span>
            <input
              type="search"
              placeholder="Hamburguesa, hotdogs..."
              className="w-full rounded-2xl border border-border bg-background px-12 py-3 text-text placeholder:text-muted outline-none transition focus:border-primary"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Buscar
          </button>
        </div>
      </div>

      <div
        ref={categoriesNavRef}
        className="mb-6 overflow-x-auto pb-1 hide-scrollbar"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <div className="flex items-center gap-3 min-w-180">
          {categorySections.map((item) => (
            <button
              key={item.id}
              id={`category-tab-${item.id}`}
              type="button"
              onClick={() => {
                const section = document.getElementById(item.id)
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                centerActiveTab(item.id)
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeSection === item.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background text-text border border-border hover:bg-surface'
              }`}
              aria-current={activeSection === item.id ? 'true' : undefined}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rootRef}
        className="space-y-8 max-h-180 overflow-y-auto pr-2 scroll-smooth hide-scrollbar"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {categorySections.map((section, index) => (
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
                  <h2 className="text-2xl font-semibold text-text">{section.title}</h2>
                  <p className="text-sm text-muted">{section.subtitle}</p>
                </div>
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  {section.cards.length} opciones
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{section.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card) => (
                <div key={card.name} className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="text-lg font-semibold text-text">{card.name}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{card.detail}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Ver más
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              ))}
            </div>
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
