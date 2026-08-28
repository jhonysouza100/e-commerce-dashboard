"use client"

import type React from "react"

import { useEffect } from "react"
import { RiInformationLine, RiCloseLine } from "@remixicon/react"
import Image from "next/image"
import ImageUploadDropzone from "./ImageUploadDropzone"
import { useQuery } from "@tanstack/react-query"
import EditProductSpecs from "./EditProductSpecs"
import CreateProductWithAI from "./CreateProductWithAI"
import { useProductsContext } from "./context/useProductsContext"
import { EMPTY_INITIAL_PRODUCT, Product } from "./interface/product.interface"
import { getProductRequest } from "./hooks/useProductsRequests"
import { ProductCategoryEnum } from "./enums/product-category.enum"
import Loading from "../ui/Loading"
import Alert from "../ui/Alert"

function CleanButton({ name }: { name: string; }) {
  const { updateProduct } = useProductsContext();
  return (
    <button
      type="button"
      onClick={() => updateProduct({ [name]: "" })}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow"
    >
      <RiCloseLine size={12} />
    </button>
  )
}

export default function EditProductForm({ id }: { id?: number }) {
  const { product, setProduct, updateProduct, removeFile } = useProductsContext();

  // Consulta de producto via useQuery
  const { data, isLoading, isError, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductRequest(id),
    enabled: !!id, // Solo se ejecuta si id es proporcionado
  });

  // Inicializamos el store cuando llega el producto de la query
  useEffect(() => {
    if (data) {
      // Exclude id, tenant_id, createdAt, modifiedAt if not needed for update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, tenant_id, createdAt, modifiedAt, ...filteredData } = data;
      setProduct(filteredData);
    }
    // Si no se provee id se trata como nuevo producto y se inicializa con valores por defecto
    if (!id) {
      setProduct(EMPTY_INITIAL_PRODUCT);
    }
  }, [id, data, setProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateProduct({
      [name]:
        name === "price" || name === "stock" || name === "discount"
          ? Number(value)
          : value,
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProduct({
      isActive: e.target.checked,
    })
  }

  const removeImage = (secure_url: string) => {
    if (!product) return
    // Actualizamos las imágenes del item en el store
    // (esto no se guardará en la base de datos, solo es para previsualización)
    updateProduct({
      images: product?.images?.filter((img) => img.secure_url !== secure_url),
    })

    // Eliminamos el archivo correspondiente del estado `files`
    // (files se mandan a la API para guardarse en cloudinary)
    removeFile(secure_url);
  }

  if (isLoading) return (<Loading message="producto" />)
  if (isError) return (<Alert message={error.message} />)

  return (
    <div className="w-full max-w-7xl pb-4 lg:pb-8 mx-auto">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Columna #1 */}
        <div className="grid grid-cols-1 gap-3 grid-rows-[repeat(2,max-content)]">
          {/* Grupo 1A */}
          <div className="grid grid-cols-2 gap-2">
            {/* Product Name */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label htmlFor="name" className="font-medium text-xs text-foreground-muted">
                  Nombre
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product?.name || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                  placeholder="Escribe el nombre del item..."
                />
                {product?.name && (<>
                  <CleanButton name="name" />
                  <CreateProductWithAI />
                </>
                )}
              </div>
            </div>

            {/* Product Slug */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label htmlFor="name" className="font-medium text-xs text-foreground-muted">
                  Slug
                </label>
                <span title="Nombre en formato de URL">
                  <RiInformationLine size={16} />
                </span>
                <span className="text-xs">(opcional)</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={product?.slug || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                  placeholder="Escribe el slug del item..."
                />
                {product?.slug && (<>
                  <CleanButton name="slug" />
                  <CreateProductWithAI />
                </>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label htmlFor="category" className="font-medium text-xs text-foreground-muted">
                  Categoría
                </label>
                <span title="Elije la categoría a donde pertenece el item">
                  <RiInformationLine size={16} className="text-foreground-muted" />
                </span>
                <span className="text-xs">(opcional)</span>
              </div>
              <select
                name="category"
                id="category"
                value={product?.category || ProductCategoryEnum.OTHER}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
              >
                {Object.values(ProductCategoryEnum).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid justify-center items-center">
              {/* Status */}
              <div className="flex flex-col items-center gap-2">
                <span className="font-medium text-xs text-foreground-muted">
                  {product?.isActive ? "Activo" : "Inactivo"}
                </span>
                <label htmlFor="status" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="status"
                    checked={product?.isActive ?? false}
                    onChange={handleStatusChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-foreground-muted peer-focus:outline-none rounded-full peer peer-checked:bg-green-400 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Grupo 1B */}
          <div className="grid grid-cols-2 gap-2">
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block font-medium mb-1 text-xs text-foreground-muted">
                Marca
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={product?.brand || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  placeholder="Escribe la marca del item..."
                />
                {product?.brand && (<CleanButton name="brand" />)}
              </div>
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block font-medium mb-1 text-xs text-foreground-muted">
                Modelo
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={product?.model || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  placeholder="Escribe el modelo del item..."
                />
                {product?.model && (<CleanButton name="model" />)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="description" className="font-medium text-xs text-foreground-muted">
                Descripción
              </label>
            </div>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={product?.description || ""}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-md border border-border bg-input p-2 pr-8 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                placeholder="Describa el item..."
              />
              {product?.description && (
                <button
                  type="button"
                  onClick={() => updateProduct({ description: "" })}
                  className="absolute right-2 top-2 text-red-500 hover:text-red-700 bg-white rounded-full p-[2px] shadow"
                >
                  <RiCloseLine className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-xs mt-1 text-foreground-muted">
              No exceda los 500 caracteres al ingresar la descripción del item.
            </p>
          </div>

          {/* Especificaciones (specifications) */}
          <EditProductSpecs />
        </div>

        {/* Columna #2 */}
        <div className="grid grid-cols-1 gap-3 grid-rows-[repeat(2,max-content)]">
          {/* Product Images */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="font-medium text-xs text-foreground-muted">Imágenes del item</label>
            </div>

            <div className="flex flex-wrap gap-2">
              {product?.images && product.images.length > 0
                ? product.images.map((img, index) => (
                  <div key={index} className="relative rounded p-1 aspect-square h-28 sm:h-32">
                    <Image
                      width={200}
                      height={200}
                      src={img.secure_url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-contain text-xs"
                    />
                    <button
                      onClick={() => removeImage(img.secure_url)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <RiCloseLine className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))
                : null}

              {product?.images && product.images.length < 5 && <ImageUploadDropzone />}
            </div>
          </div>

          {/* Price, Stock, Discount */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block font-medium text-xs text-foreground-muted">
                Precio
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product?.price !== undefined && product?.price !== null ? (product?.price !== 0 ? product?.price : "") : ""}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                />
              </div>
            </div>
            <div>
              <label htmlFor="stock" className="block font-medium text-xs text-foreground-muted">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={product?.stock !== undefined && product?.stock !== null ? (product?.stock !== 0 ? product?.stock : "") : ""}
                onChange={handleInputChange}
                min={0}
                className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
              />
            </div>
            <div>
              <label htmlFor="discount" className="block font-medium text-xs text-foreground-muted">
                Desc. (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={product?.discount !== undefined && product?.discount !== null ? (product?.discount !== 0 ? product?.discount : "") : ""}
                onChange={handleInputChange}
                min={0}
                max={100}
                className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
              />
            </div>
          </div>

          {/* Optional inventory and color fields */}
          <div className="rounded-lg border border-border bg-surface-secondary p-4">
            <h2 className="text-sm font-semibold text-foreground">Inventario y variante</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[['minCount', 'Mínimo de compra'], ['maxCount', 'Máximo de compra']].map(([name, label]) => (
                <label key={name} className="flex flex-col gap-1 text-xs text-foreground-muted">
                  {label}
                  <input type="number" min={0} name={name} value={product ? ((product as unknown as Record<string, unknown>)[name] as number ?? "") : ""} onChange={handleInputChange}
                    className="rounded-md border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </label>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs text-foreground-muted">Color
                <input name="colorName" value={product?.color?.name ?? ""} onChange={(e) => updateProduct({ color: { name: e.target.value, value: product?.color?.value ?? "" } })}
                  className="rounded-md border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30" placeholder="Nombre del color" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-foreground-muted">Valor del color
                <input name="colorValue" value={product?.color?.value ?? ""} onChange={(e) => updateProduct({ color: { name: product?.color?.name ?? "", value: e.target.value } })}
                  className="rounded-md border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30" placeholder="#000000" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}