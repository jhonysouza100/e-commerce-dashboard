"use client"


import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RiProhibited2Line } from "@remixicon/react";
import { useProductsContext } from "./context/useProductsContext";
import { Product } from "./interface/product.interface";
import DeleteProductButton from "./DeleteProductButton";

import { useRouter } from "next/navigation";

function ListProductsTable() {

  const searchParams = useSearchParams(); // pasar estos parámetros a useQuery de manera reactiva.
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10); // Parámetro 'page' es para la paginación
  const searchTerm = (searchParams.get("q") || "").trim().toLowerCase();
  const { products, setCount, count, setSelectedRows, selectedRows } =
    useProductsContext();
  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => a.name.localeCompare(b.name));
  const pageSize = 10;
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const visibleProductIds = visibleProducts.map((product) => product.id);
  const allVisibleSelected = visibleProductIds.length > 0 && visibleProductIds.every((id) => selectedRows.includes(id));
  const toggleAllVisible = () => visibleProductIds.forEach((id) => {
    if (allVisibleSelected === selectedRows.includes(id)) setSelectedRows(id);
  });

  // La paginación usa el total filtrado sin consultar la API.
  useEffect(() => {
    if (count !== filteredProducts.length) setCount(filteredProducts.length);
  }, [count, filteredProducts.length, setCount]);

  return (
    <table className="my_table w-full h-0 border-collapse text-left">
      <thead className="table_head">
        <tr className="table_row">
          <th className="head_rows border-collapse p-2 md:p-3 text-center z-30">
            <input aria-label="Seleccionar todos los items visibles" title="Seleccionar todos los items visibles" type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
          </th>
          <th className="head_rows border-collapse py-3 px-4 text-center lg:text-left sticky top-0 left-0 z-20 !min-w-4 bg-background">Producto</th>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Precio</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Stock</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Descuento</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Actions</td>
        </tr>
      </thead>
      <tbody className="table_body">
        {visibleProducts.map((product: Product, index: number) => (
            // Si la fila está seleccionada, se le aplica un fondo de color claro
            <tr key={product.id} tabIndex={index} 
              onClick={() => router.push(`/products/${product.id}`)}
              onKeyDown={(event) => { if (event.key === "Enter") router.push(`/products/${product.id}`); }} 
              className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary ${selectedRows.includes(product.id) ? "!bg-surface-hover" : ""}`}
            >
              <td className="table_data border-collapse p-2 md:p-3 text-center z-0">
                <input aria-label={`Seleccionar ${product.name}`} type="checkbox" checked={selectedRows.includes(product.id)} onChange={() => setSelectedRows(product.id)} onClick={(e) => e.stopPropagation()} />
              </td>
              <td className="table_data border-collapse p-2 gap-2 md:p-3 text-center lg:text-left z-0 !min-w-max flex items-center">
                <span className="relative">
                  <Image
                    className={`table_img w-12 h-12 mr-2 text-xs rounded-md align-middle object-cover aspect-square ${
                      !product.isActive ? "grayscale" : ""
                    }`}
                    src={product?.images[0]?.secure_url}
                    alt="product image"
                    width={50}
                    height={50}
                  />
                  {!product.isActive && (
                    <RiProhibited2Line className="text-red-500 w-4 h-4 absolute top-0 right-0" />
                  )}
                </span>
                {/* NOMBRE DEL PRODUCTO */}
                <span className="max-w-20 md:max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.name}
                </span>
              </td>
              <td className="price_money table_data border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                ${product.price}
              </td>
              <td
                className={`table_data border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4 ${
                  product.stock <= 1
                    ? "text-red-500 font-bold"
                    : product.stock <= 5
                    ? "text-yellow-500 font-bold"
                    : ""
                }`}
              >
                {product.stock}
              </td>
              <td className="table_data border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                {Math.round(product.discount)}%
              </td>
              <td className="table_data border-collapse p-2 md:p-3 text-center lg:text-left z-0 !min-w-4"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-3 items-center justify-center">
                  <DeleteProductButton id={product.id} />
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default ListProductsTable;
