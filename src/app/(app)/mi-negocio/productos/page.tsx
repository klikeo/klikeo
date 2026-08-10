"use client"

import {
  dashboardClient,
  NegocioDashboard,
  ProductCategoryDashboard,
  ProductDashboard,
} from "@/src/lib/dashboard-client"
import { useRequireAuth } from "@/src/lib/hooks/useRequireAuth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Resolver, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const ingredientSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  extraPrice: z
    .preprocess(
      (value) => (typeof value === "string" ? Number(value) : value),
      z.number().min(0, "Debe ser un número válido"),
    )
    .optional(),
  isDefault: z.boolean().optional(),
})

const additionSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  price: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(0, "Debe ser un número válido"),
  ),
  description: z.string().max(200, "Máximo 200 caracteres").optional(),
  isDefault: z.boolean().optional(),
})

const productSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  category: z.string().min(1, "Categoría requerida"),
  price: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(0, "El precio debe ser mayor o igual a 0"),
  ),
  stock: z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().min(0, "El stock debe ser mayor o igual a 0"),
  ),
  isActive: z.boolean(),
  ingredients: z.array(ingredientSchema).optional(),
  additions: z.array(additionSchema).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const defaultValues: ProductFormValues = {
  name: "",
  description: undefined,
  category: "",
  price: 0,
  stock: 0,
  isActive: true,
  ingredients: [],
  additions: [],
}

export default function ProductCatalogPage() {
  const { token, loading } = useRequireAuth()
  const [negocio, setNegocio] = useState<NegocioDashboard | null>(null)
  const [products, setProducts] = useState<ProductDashboard[]>([])
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDashboard | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<ProductCategoryDashboard[]>([])
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues,
  })

  const ingredientsFieldArray = useFieldArray({ control, name: "ingredients" })
  const additionsFieldArray = useFieldArray({ control, name: "additions" })

  const categoryOptions = useMemo(
    () => categories.map((category) => category.name),
    [categories],
  )

  useEffect(() => {
    if (!token) return

    const loadBusinessAndProducts = async () => {
      setIsBusy(true)
      try {
        const ownerBusiness = await dashboardClient.negocios.getByOwner(token)
        setNegocio(ownerBusiness)
        const [productsResult, categoriesResult] = await Promise.all([
          dashboardClient.productos.listByBusiness(ownerBusiness.id, token),
          dashboardClient.productCategories.listByBusiness(
            ownerBusiness.id,
            token,
          ),
        ])
        setProducts(productsResult.data)
        setCategories(categoriesResult.data)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo cargar el negocio"
        setStatusMessage({ type: "error", text: message })
      } finally {
        setIsBusy(false)
      }
    }

    loadBusinessAndProducts()
  }, [token])

  useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name,
        description: selectedProduct.description ?? undefined,
        category: selectedProduct.category,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        isActive: selectedProduct.isActive,
        ingredients: selectedProduct.ingredients ?? [],
        additions: selectedProduct.additions ?? [],
      })
    }
  }, [reset, selectedProduct])

  useEffect(() => {
    if (selectedProduct) {
      setImagePreview(selectedProduct.imageUrl ?? null)
    }
  }, [selectedProduct])

  useEffect(() => {
    if (!selectedProduct && categories.length > 0) {
      reset((current) => ({
        ...current,
        category: categories[0].name,
      }))
    }
  }, [categories, reset, selectedProduct])

  const refreshProducts = async () => {
    if (!token || !negocio) return
    const result = await dashboardClient.productos.listByBusiness(
      negocio.id,
      token,
    )
    setProducts(result.data)
  }

  const resetForm = () => {
    setSelectedProduct(null)
    setImageFile(null)
    setImagePreview(null)
    reset(defaultValues)
    ingredientsFieldArray.remove(
      ingredientsFieldArray.fields.map((_, index) => index),
    )
    additionsFieldArray.remove(
      additionsFieldArray.fields.map((_, index) => index),
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDeleteProduct = async (product: ProductDashboard) => {
    if (!token) return
    const confirmed = window.confirm(
      `Eliminar ${product.name}? Esta acción es lógica y borra la imagen de Cloudinary.`,
    )
    if (!confirmed) return

    try {
      setIsBusy(true)
      await dashboardClient.productos.delete(product.id, token)
      setStatusMessage({
        type: "success",
        text: "Producto eliminado correctamente",
      })
      if (selectedProduct?.id === product.id) {
        resetForm()
      }
      await refreshProducts()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar el producto"
      setStatusMessage({ type: "error", text: message })
    } finally {
      setIsBusy(false)
    }
  }

  const onSubmit = async (values: ProductFormValues) => {
    if (!token || !negocio) return
    if (categories.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Crea al menos una categoría antes de crear productos.",
      })
      return
    }

    try {
      setStatusMessage(null)
      setIsBusy(true)
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        stock: values.stock,
        isActive: values.isActive,
        ingredients:
          values.ingredients?.filter((item) => item.name.trim()) ?? [],
        additions: values.additions?.filter((item) => item.name.trim()) ?? [],
      }

      let product: ProductDashboard
      if (selectedProduct) {
        product = await dashboardClient.productos.update(
          selectedProduct.id,
          payload,
          token,
        )
      } else {
        product = await dashboardClient.productos.create(
          negocio.id,
          payload,
          token,
        )
      }

      if (imageFile) {
        const formData = new FormData()
        formData.append("image", imageFile)
        product = await dashboardClient.productos.uploadImage(
          product.id,
          formData,
          token,
        )
      }

      setSelectedProduct(product)
      setImagePreview(product.imageUrl ?? null)
      setStatusMessage({
        type: "success",
        text: selectedProduct ? "Producto actualizado" : "Producto creado",
      })
      await refreshProducts()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al guardar el producto"
      setStatusMessage({ type: "error", text: message })
    } finally {
      setIsBusy(false)
    }
  }

  const handleEditProduct = (product: ProductDashboard) => {
    setSelectedProduct(product)
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-text-secondary">
        Cargando...
      </div>
    )
  }

  if (!negocio) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6 text-center">
        <h1 className="text-2xl font-semibold text-text mb-4">
          Tu negocio aún no está creado
        </h1>
        <p className="text-text-secondary mb-6">
          Primero completa el perfil de tu negocio y luego podrás crear un
          catálogo de productos.
        </p>
        <Link
          href="/mi-negocio"
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-background hover:bg-primary-hover transition-colors"
        >
          Completar negocio
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Catálogo
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text">
            Productos de {negocio.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Administra los productos de tu negocio con precios, stock,
            ingredientes opcionales y adicionales configurables.
          </p>
        </div>
        <Link
          href="/mi-negocio"
          className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition hover:border-primary"
        >
          Volver a mi negocio
        </Link>
      </div>

      {statusMessage && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm mb-6 ${
            statusMessage.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-danger/10 border-danger/30 text-danger"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {categories.length === 0 && (
        <div className="rounded-3xl border border-warning/30 bg-warning/10 px-6 py-4 text-sm text-warning mb-6">
          <p className="font-semibold">
            No puedes crear productos sin categorías.
          </p>
          <p className="mt-1">
            Agrega al menos una categoría para tu negocio y luego vuelve a
            crear productos.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1.4fr]">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text">Productos</h2>
                <p className="text-sm text-text-secondary">
                  Usa las tarjetas para editar o eliminar rápidamente.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:bg-primary-hover"
                >
                  Nuevo producto
                </button>
                <Link
                  href="/mi-negocio/categorias"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-text transition hover:border-primary"
                >
                  Administrar categorías
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-background p-8 text-center text-text-secondary">
                <p className="text-sm">Aún no tienes productos.</p>
                <p className="mt-3 text-sm">
                  Crea el primero usando el formulario de la derecha.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-border bg-card transition hover:border-primary/40"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                      <div className="min-h-[120px] min-w-[120px] overflow-hidden rounded-3xl bg-background">
                        <img
                          src={
                            product.imageUrl ??
                            "https://via.placeholder.com/320x240?text=Producto"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-primary">
                              {product.category}
                            </p>
                            <h3 className="text-lg font-semibold text-text line-clamp-2">
                              {product.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="text-base font-semibold text-text">
                              ${product.price.toFixed(2)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                product.isActive
                                  ? "bg-success/15 text-success"
                                  : "bg-border text-text-secondary"
                              }`}
                            >
                              {product.isActive ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-text-secondary line-clamp-3">
                          {product.description ??
                            "Sin descripción disponible."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-secondary">
                          <span className="rounded-full bg-background px-2 py-1">
                            Stock: {product.stock}
                          </span>
                          <span className="rounded-full bg-background px-2 py-1">
                            Ingredientes: {product.ingredients?.length ?? 0}
                          </span>
                          <span className="rounded-full bg-background px-2 py-1">
                            Adicionales: {product.additions?.length ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 border-t border-border bg-background px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text transition hover:border-primary"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product)}
                        className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Formulario
                </p>
                <h2 className="mt-2 text-xl font-semibold text-text">
                  {selectedProduct ? "Editar producto" : "Nuevo producto"}
                </h2>
              </div>
              {selectedProduct && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    selectedProduct.isDeleted
                      ? "bg-danger/15 text-danger"
                      : "bg-success/15 text-success"
                  }`}
                >
                  {selectedProduct.isDeleted ? "Eliminado" : "Activo"}
                </span>
              )}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-4">
                <label className="block text-sm font-medium text-text">
                  Nombre
                  <input
                    {...register("name")}
                    className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.name.message}
                    </p>
                  )}
                </label>

                <label className="block text-sm font-medium text-text">
                  Categoría
                  <select
                    {...register("category")}
                    disabled={categories.length === 0}
                    className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.category.message}
                    </p>
                  )}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-text">
                    Precio
                    <input
                      {...register("price", { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.price.message}
                      </p>
                    )}
                  </label>
                  <label className="block text-sm font-medium text-text">
                    Stock
                    <input
                      {...register("stock", { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="1"
                      className="mt-2 w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.stock.message}
                      </p>
                    )}
                  </label>
                </div>

                <label className="block text-sm font-medium text-text">
                  Descripción
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="mt-2 w-full rounded-[1.75rem] border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.description.message}
                    </p>
                  )}
                </label>

                <label className="flex items-center gap-3 text-sm font-medium text-text">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Producto activo
                </label>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-text">
                    Ingredientes opcionales
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      ingredientsFieldArray.append({
                        name: "",
                        extraPrice: 0,
                        isDefault: false,
                      })
                    }
                    className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-background transition hover:bg-primary-hover"
                  >
                    Agregar
                  </button>
                </div>
                {ingredientsFieldArray.fields.length === 0 ? (
                  <p className="mt-4 text-sm text-text-secondary">
                    No hay ingredientes configurados.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {ingredientsFieldArray.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid gap-3 rounded-3xl border border-border bg-surface p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-text">
                            Ingrediente {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              ingredientsFieldArray.remove(index)
                            }
                            className="text-sm font-semibold text-danger hover:opacity-80"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                          <label className="block text-sm text-text">
                            Nombre
                            <input
                              {...register(
                                `ingredients.${index}.name` as const,
                              )}
                              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text outline-none"
                            />
                          </label>
                          <label className="block text-sm text-text">
                            Extra
                            <input
                              {...register(
                                `ingredients.${index}.extraPrice` as const,
                                { valueAsNumber: true },
                              )}
                              type="number"
                              min="0"
                              step="0.01"
                              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text outline-none"
                            />
                          </label>
                        </div>
                        <label className="inline-flex items-center gap-2 text-sm text-text">
                          <input
                            type="checkbox"
                            {...register(
                              `ingredients.${index}.isDefault` as const,
                            )}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          Seleccionado por defecto
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-text">
                    Adicionales
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      additionsFieldArray.append({
                        name: "",
                        price: 0,
                        description: "",
                        isDefault: false,
                      })
                    }
                    className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-background transition hover:bg-primary-hover"
                  >
                    Agregar
                  </button>
                </div>
                {additionsFieldArray.fields.length === 0 ? (
                  <p className="mt-4 text-sm text-text-secondary">
                    No hay extras configurados.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {additionsFieldArray.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid gap-3 rounded-3xl border border-border bg-surface p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-text">
                            Extra {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => additionsFieldArray.remove(index)}
                            className="text-sm font-semibold text-danger hover:opacity-80"
                          >
                            Eliminar
                          </button>
                        </div>
                        <label className="block text-sm text-text">
                          Nombre
                          <input
                            {...register(`additions.${index}.name` as const)}
                            className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text outline-none"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                          <label className="block text-sm text-text">
                            Precio
                            <input
                              {...register(
                                `additions.${index}.price` as const,
                                { valueAsNumber: true },
                              )}
                              type="number"
                              min="0"
                              step="0.01"
                              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text outline-none"
                            />
                          </label>
                          <label className="block text-sm text-text">
                            Por defecto
                            <input
                              type="checkbox"
                              {...register(
                                `additions.${index}.isDefault` as const,
                              )}
                              className="mt-2 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                          </label>
                        </div>
                        <label className="block text-sm text-text">
                          Descripción
                          <input
                            {...register(
                              `additions.${index}.description` as const,
                            )}
                            className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-text outline-none"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="mb-3 text-sm font-semibold text-text">
                  Imagen del producto
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl bg-surface">
                    <img
                      src={
                        imagePreview ??
                        "https://via.placeholder.com/240x240?text=Producto"
                      }
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer rounded-2xl border border-dashed border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary transition hover:border-primary hover:text-text">
                    Seleccionar imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting || isBusy || categories.length === 0}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-primary/60"
                >
                  {selectedProduct ? "Guardar cambios" : "Crear producto"}
                </button>
                {selectedProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-text transition hover:border-primary"
                  >
                    Crear uno nuevo
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}