"use client"

import type React from "react"

import { useEffect } from "react"
import { RiCloseLine } from "@remixicon/react"
import Image from "next/image"
import ImageUploadDropzone from "./ImageUploadDropzone"
import { useQuery } from "@tanstack/react-query"
import EditProductSpecs from "./EditProductSpecs"
import { useProductsContext } from "./context/useProductsContext"
import { EMPTY_INITIAL_PRODUCT, Product } from "./interface/product.interface"
import { getProductRequest } from "./hooks/useProductsRequests"
import { ProductCategoryEnum, ProductCategoryLabel } from "./enums/product-category.enum"
import Loading from "@/ui/Loading"
import Alert from "@/ui/Alert"
import FormLabel from "@/ui/FormLabel"

function CleanButton({ name }: { name: string; }) {
  const { updateProduct } = useProductsContext();
  return (
    <button
      type="button"
      onClick={() => updateProduct({ [name]: "" })}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 bg-background rounded-full p-1 shadow"
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
        ["price", "stock", "discount", "minCount", "maxCount"].includes(name)
          ? (value === "" ? undefined : Number(value))
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

  if (isLoading) return (<Loading message="item" />)
  if (isError) return (<Alert message={error.message} />)

  return (
    <div className="w-full max-w-7xl mx-auto">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Columna #1 */}
        <div className="grid grid-cols-1 gap-3 grid-rows-[repeat(2,max-content)]">
          {/* Grupo A1 */}
          <div className="rounded-lg border border-border bg-surface-secondary p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Nombre y características</h2>
            <div className="grid lg:grid-cols-2 gap-3">
              {([
                ['name', 'Nombre', 'Ingresa el nombre', false, false, ""],
                ['alias', 'Alias', 'Alias comercial', true, true, "Nombre alternativo para facturación"],
              ] as const).map(([name, label, placeholder, optional, showInfoIcon, info]) => (
                <div key={name}>
                  <FormLabel
                    htmlFor={name}
                    title={label}
                    optional={optional}
                    info={info}
                    showInfoIcon={showInfoIcon}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        id={name}
                        name={name}
                        value={product?.[name] || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                        placeholder={`${placeholder}`}
                      />
                      {product?.[name] && (<>
                        <CleanButton name={name} />
                      </>
                      )}
                    </div>
                  </FormLabel>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                ['brand', 'Marca', 'Ingresa la marca', false, false, ""],
                ['model', 'Modelo', 'Ingresa el modelo', false, false, ""]
              ] as const).map(([name, label, placeholder, optional, showInfoIcon, info]) => (
                <div key={name}>
                  <FormLabel
                    htmlFor={name}
                    title={label}
                    optional={optional}
                    info={info}
                    showInfoIcon={showInfoIcon}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        id={name}
                        name={name}
                        value={product?.[name] || ""}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                        placeholder={`${placeholder}`}
                      />
                      {product?.[name] && (<>
                        <CleanButton name={name} />
                      </>
                      )}
                    </div>
                  </FormLabel>
                </div>
              ))}
              {/* Category */}
              <FormLabel
                htmlFor="category"
                title="Categoría"
                info="Elije la categoría a donde pertenece el item"
                optional
                showInfoIcon={true}
              >
                <select
                  name="category"
                  id="category"
                  value={product?.category || ProductCategoryEnum.OTHER}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                >
                  {Object.values(ProductCategoryEnum).map((category) => (
                    <option key={category} value={category}>
                      {ProductCategoryLabel[category]}
                    </option>
                  ))}
                </select>
              </FormLabel>
            </div>
          </div>

          {/* Description */}
          <FormLabel
            htmlFor="description"
            title="Descripción"
          >
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
                <CleanButton name="description" />
              )}
            </div>
            <p className="text-xs text-foreground-muted">
              No exceda los 500 caracteres al ingresar la descripción del item.
            </p>
          </FormLabel>

          {/* Especificaciones (specifications) */}
          <EditProductSpecs />
        </div>

        {/* Columna #2 */}
        <div className="grid grid-cols-1 gap-3 grid-rows-[repeat(2,max-content)]">
          {/* Product Images */}
          <div>
            <FormLabel
              title="Imágenes del item (Max. 5)"
              showInfoIcon={true}
              info="Agregue imágenes del item. Puede subir hasta 5 imágenes. Se recomienda que las imágenes sean en formato .png o .webp sin fondo."
            />
            <div className="flex flex-wrap gap-2 mt-1.5">
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
                      className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md"
                    >
                      <RiCloseLine className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))
                : null}

              {product?.images && product.images.length < 5 && <ImageUploadDropzone />}
            </div>
          </div>

          {/* Color */}
          <div className="flex items-center justify-start">
            <FormLabel
              htmlFor="colorName"
              title="Color"
              optional
            >
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <input
                        name="colorName" 
                        id="colorName"
                        value={product?.color?.name ?? ""}
                        onChange={(e) => updateProduct({ color: { name: e.target.value, value: product?.color?.value ?? "" } })}
                        className="rounded-l-md border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                        placeholder="Nombre del color"
                        />
                      {(product?.color?.name || product?.color?.value) && (
                        <button
                          onClick={() => updateProduct({ color: { name: "", value: "" }})}
                          className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md"
                        >
                          <RiCloseLine className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                    <input
                      name="colorValue"
                      id="colorValue"
                      type="color"
                      value={product?.color?.value ?? ""}
                      onChange={(e) => updateProduct({ color: { name: product?.color?.name ?? "", value: e.target.value } })}
                      className="rounded-r-md h-full border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </div>
            </FormLabel>
          </div>

          {/* Inventory */}
          <div className="rounded-lg border border-border bg-surface-secondary p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Inventario</h2>
            {/* Price, Stock, Discount */}
            <div className="grid grid-cols-3 gap-3">
              {([
                ['price', 'Precio', undefined, true, 'Ingresá el precio con punto para los decimales (ej: 10.50)'],
                ['stock', 'Stock', undefined],
                ['discount', 'Desc. (%)', 100, false, ""]
              ] as const).map(([name, label, max, showInfoIcon, info]) => (
                <div key={name}>
                  <FormLabel
                    htmlFor={name}
                    title={label}
                    showInfoIcon={showInfoIcon}
                    info={info}
                  >
                    <div className="relative">
                      <input
                        type="number"
                        id={name}
                        name={name}
                        value={product?.[name] !== undefined && product?.[name] !== null ? (product?.[name] !== 0 ? product?.[name] : "") : ""}
                        onChange={handleInputChange}
                        min={0}
                        max={max}
                        className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                      />
                    </div>
                  </FormLabel>
                </div>
              ))}
            </div>
            {/* Minimo y Maximo de compra */}
            <div className="grid grid-cols-3 gap-3">
              {[['minCount', 'Mínimo de compra (1)'], ['maxCount', 'Máximo de compra']].map(([name, label]) => (
                <div key={name}>
                  <FormLabel
                    htmlFor={name}
                    title={label}
                  >
                    <div className="relative">
                      <input
                        type="number"
                        id={name}
                        name={name}
                        value={product ? ((product as unknown as Record<string, unknown>)[name] as number ?? "") : ""}
                        onChange={handleInputChange}
                        min={1}
                        className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-foreground-light"
                      />
                    </div>
                  </FormLabel>
                </div>
              ))}
              {/* Status */}
              <div className="flex justify-center items-center">
                <FormLabel
                  htmlFor="status"
                  title={product?.isActive ? "Activo" : "Inactivo"}
                >
                  <input
                    type="checkbox"
                    id="status"
                    checked={product?.isActive ?? false}
                    onChange={handleStatusChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-foreground-muted peer-focus:outline-none rounded-full relative peer-checked:[background:var(--gradient-color)] peer-checked:after:translate-x-5 after:transition-translate after:ease-in-out after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5"></div>
                </FormLabel>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="rounded-lg border border-border bg-surface-secondary p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Peso y dimensiones</h2>
            <div className="grid grid-cols-4 gap-3">
              {([['weight', 'Peso (g)'], ['height', 'Alto (cm)'], ['width', 'Ancho (cm)'], ['length', 'Largo (cm)']] as const).map(([name, label]) => (
                <div key={name}>
                  <FormLabel
                    htmlFor={name}
                    title={label}
                  >
                    <input
                      type="number"
                      id={name}
                      name={name}
                      min={0}
                      value={product?.dimensions?.[name] !== undefined && product?.dimensions?.[name] !== null ? (product?.dimensions?.[name] !== 0 ? product?.dimensions?.[name] : "") : ""}
                      onChange={(event) => updateProduct({ dimensions: { ...(product?.dimensions ?? { weight: 0, height: 0, width: 0, length: 0 }), [name]: event.target.value === "" ? 0 : Number(event.target.value) } })}
                      className="rounded-md border border-border bg-input p-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                  </FormLabel>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}