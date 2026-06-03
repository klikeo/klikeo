'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/src/components/Navbar'
import { useRequireAuth } from '@/src/lib/hooks/useRequireAuth'
import { dashboardClient, NegocioDashboard, ProductCategoryDashboard } from '@/src/lib/dashboard-client'

export default function ProductCategoryManagementPage() {
  const { token, loading } = useRequireAuth()
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [categories, setCategories] = useState<ProductCategoryDashboard[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryDashboard | null>(null)
  const [name, setName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      setIsBusy(true)
      try {
        const ownerBusiness = await dashboardClient.negocios.getByOwner(token)
        setNegocio(ownerBusiness)
        const categoriesResult = await dashboardClient.productCategories.listByBusiness(ownerBusiness.id, token)
        setCategories(categoriesResult.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudieron cargar las categorías'
        setStatusMessage({ type: 'error', text: message })
      } finally {
        setIsBusy(false)
      }
    }

    fetchData()
  }, [token])

  const resetForm = () => {
    setSelectedCategory(null)
    setName('')
    setIsActive(true)
  }

  const refreshCategories = async () => {
    if (!token || !negocio) return
    const categoriesResult = await dashboardClient.productCategories.listByBusiness(negocio.id, token)
    setCategories(categoriesResult.data)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || !negocio) return
    const trimmedName = name.trim()
    if (!trimmedName) {
      setStatusMessage({ type: 'error', text: 'El nombre de la categoría es obligatorio.' })
      return
    }

    try {
      setIsBusy(true)
      setStatusMessage(null)

      if (selectedCategory) {
        await dashboardClient.productCategories.update(selectedCategory.id, { name: trimmedName, isActive }, token)
        setStatusMessage({ type: 'success', text: 'Categoría actualizada correctamente.' })
      } else {
        await dashboardClient.productCategories.create(negocio.id, { name: trimmedName, isActive }, token)
        setStatusMessage({ type: 'success', text: 'Categoría creada correctamente.' })
      }

      resetForm()
      await refreshCategories()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la categoría'
      setStatusMessage({ type: 'error', text: message })
    } finally {
      setIsBusy(false)
    }
  }

  const handleEditCategory = (category: ProductCategoryDashboard) => {
    setSelectedCategory(category)
    setName(category.name)
    setIsActive(category.isActive)
    setStatusMessage(null)
  }

  const handleDeleteCategory = async (category: ProductCategoryDashboard) => {
    if (!token) return
    const confirmed = window.confirm(`¿Eliminar la categoría "${category.name}"? Esto solo la marcará como eliminada.`)
    if (!confirmed) return

    try {
      setIsBusy(true)
      await dashboardClient.productCategories.delete(category.id, token)
      setStatusMessage({ type: 'success', text: 'Categoría eliminada correctamente.' })
      if (selectedCategory?.id === category.id) {
        resetForm()
      }
      await refreshCategories()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la categoría'
      setStatusMessage({ type: 'error', text: message })
    } finally {
      setIsBusy(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background p-16 text-center text-muted">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Categorías</p>
            <h1 className="mt-3 text-3xl font-semibold text-text">Categorías de productos</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Administra las categorías de productos de tu negocio. Hasta que tengas al menos una categoría activa, no podrás crear productos.
            </p>
          </div>
          <Link href="/mi-negocio/productos" className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition hover:bg-surface/90">
            Volver al catálogo de productos
          </Link>
        </div>

        {statusMessage && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          } mb-6`}>
            {statusMessage.text}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text">Lista de categorías</h2>
                  <p className="text-sm text-muted">Edita, activa o elimina las categorías de tu catálogo.</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {categories.length} categorías
                </span>
              </div>

              {categories.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-border bg-background p-6 text-center text-muted">
                  <p className="text-sm">Aún no hay categorías definidas.</p>
                  <p className="mt-2 text-sm">Crea la primera categoría usando el formulario de la derecha.</p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {categories.map((category) => (
                    <article key={category.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-text">{category.name}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted">
                            {category.isActive ? 'Activa' : 'Inactiva'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            className="rounded-2xl border border-border bg-white px-4 py-2 text-sm font-semibold text-text transition hover:bg-surface"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category)}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Formulario</p>
                <h2 className="mt-2 text-xl font-semibold text-text">
                  {selectedCategory ? 'Editar categoría' : 'Nueva categoría'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-text">
                    Nombre de la categoría
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                      placeholder="Ej. Hamburguesas"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-sm font-medium text-text">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    Categoría activa
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
                  >
                    {selectedCategory ? 'Guardar cambios' : 'Crear categoría'}
                  </button>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-border bg-white px-5 py-3 text-sm font-semibold text-text transition hover:bg-surface"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
