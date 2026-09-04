"use client"

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RiEdit2Fill, RiProhibited2Line } from "@remixicon/react";
import { useAuthContext } from "../session/context/useAuthContext";
import { useProductsContext } from "./context/useProductsContext";
import { Product } from "./interface/product.interface";
import DeleteProductButton from "./DeleteProductButton";
import { ListProductsQuery, listProductsRequest } from "./hooks/useProductsRequests";
import Loading from "@/ui/Loading";
import Alert from "@/ui/Alert";
import { useRouter } from "next/navigation";

function ListProductsTable() {
  const { session } = useAuthContext();
  const searchParams = useSearchParams(); // pasar estos parámetros a useQuery de manera reactiva.
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10); // Parámetro 'page' es para la paginación
  const query: ListProductsQuery[] = [
    {
      key: "name",
      value: searchParams.get("q") || ""
    }
  ];

  const { setCount, count, setSelectedRows, selectedRows } =
    useProductsContext();
  const { data, isLoading, isError, error } = useQuery<{
    count: number;
    products: Product[];
  }>({
    queryKey: ["products", query, page, session?.id], // useQuery depende de los parámetros de búsqueda y paginación, lo que garantizará que la consulta se vuelva a ejecutar cada vez que cambien
    queryFn: () => {
      if (session) {
        return listProductsRequest(query, page, session.id);
      }
      return Promise.resolve({ count: 0, products: [] });
    },
    select: ({ count, products }) => ({
      // devuelve { count: number, products: Product[] }
      count,
      // Ordenar alfabéticamente por nombre
      products: products
        ? products.sort((a: Product, b: Product) =>
            a.name.localeCompare(b.name)
          )
        : [],
    }),
  });

  const visibleProductIds = data?.products.map((product) => product.id) ?? [];
  const allVisibleSelected = visibleProductIds.length > 0 && visibleProductIds.every((id) => selectedRows.includes(id));
  const toggleAllVisible = () => visibleProductIds.forEach((id) => {
    if (allVisibleSelected === selectedRows.includes(id)) setSelectedRows(id);
  });

  // Actualizar el número total de products en Zustand
  useEffect(() => {
    if (data && data.count !== count) {
      // Comprobamos si el count realmente ha cambiado
      setCount(data.count); // Actualizamos el count en Zustand
    }
  }, [data, setCount, count]); // Este useEffect se ejecuta cuando `data` cambia

  if (isLoading) return <Loading message="items..." />;
  if (isError) return <Alert message={error.message} />;

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
        {session &&
          data?.products.map((product: Product, index: number) => (
            // Si la fila está seleccionada, se le aplica un fondo de color claro
            <tr key={product.id} tabIndex={0} 
              onClick={(event) => { event.stopPropagation(); router.push(`/products/${product.id}`)} }
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
              <td className="table_data border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                <div className="flex gap-3 items-center justify-center z-10">
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