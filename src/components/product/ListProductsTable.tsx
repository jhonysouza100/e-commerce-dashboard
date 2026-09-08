"use client"

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RiProhibited2Line, RiStarFill, RiBox3Line, RiLineChartLine, RiShoppingBag4Line } from "@remixicon/react";
import { useAuthContext } from "../session/context/useAuthContext";
import { useProductsContext } from "./context/useProductsContext";
import { Product } from "./interface/product.interface";
import DeleteProductButton from "./DeleteProductButton";
import { ListProductsQuery, listProductsRequest } from "./hooks/useProductsRequests";
import Loading from "@/ui/Loading";
import Alert from "@/ui/Alert";
import { useRouter } from "next/navigation";
import { formatCurrency, handleFormatPrice } from "@/utils/handleFormatPrice";
import FormLabel from "../ui/FormLabel";
import DesactiveProductsButton from "./DesactiveProductsButton";


export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Auriculares Pro X',
    slug: 'auriculares-pro-x',
    description: 'Auriculares inalámbricos con sonido envolvente y cancelación activa de ruido.',
    images: [
      {
        public_id: 'mock-1',
        secure_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      },
    ],
    specifications: [
      { label: 'Bluetooth', value: '5.3' },
      { label: 'Batería', value: '30h' },
    ],
    dimensions: { weight: 250, height: 18, width: 16, length: 8 },
    brand: 'AudioMax',
    model: 'APX-2024',
    color: { name: 'Negro', value: '#111827' },
    price: 2499,
    stock: 12,
    discount: 0,
    isActive: false,
    tenant_id: 1,
    rating: 4.8,
    average: 4.8,
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
    modifiedAt: new Date('2024-02-10T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Smartwatch Vega',
    slug: 'smartwatch-vega',
    description: 'Reloj inteligente con monitor de actividad, GPS y resistencia al agua.',
    images: [
      {
        public_id: 'mock-2',
        secure_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      },
    ],
    specifications: [
      { label: 'Pantalla', value: '1.9" AMOLED' },
      { label: 'Resistencia', value: '5 ATM' },
    ],
    dimensions: { weight: 340, height: 41, width: 35, length: 11 },
    brand: 'TimeLoop',
    model: 'VGA-9',
    color: { name: 'Azul', value: '#2563eb' },
    price: 1899,
    stock: 7,
    discount: 15,
    isActive: false,
    tenant_id: 1,
    rating: 4.6,
    average: 4.6,
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
    modifiedAt: new Date('2024-02-22T00:00:00.000Z'),
  },
  {
    id: 3,
    name: 'Cámara Lite 4K',
    slug: 'camara-lite-4k',
    description: 'Cámara compacta para videos en 4K, ideal para vloggers y contenido diario.',
    images: [
      {
        public_id: 'mock-3',
        secure_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      },
    ],
    specifications: [
      { label: 'Resolución', value: '4K UHD' },
      { label: 'Sensor', value: '24MP' },
    ],
    dimensions: { weight: 520, height: 64, width: 55, length: 91 },
    brand: 'PixelNest',
    model: 'CL4K',
    color: { name: 'Gris', value: '#6b7280' },
    price: 3299,
    stock: 4,
    discount: 20,
    isActive: false,
    tenant_id: 1,
    rating: 4.9,
    average: 4.9,
    createdAt: new Date('2024-01-10T00:00:00.000Z'),
    modifiedAt: new Date('2024-03-05T00:00:00.000Z'),
  },
];

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
      <thead className="table_head bg-background">
        <tr className="table_row">
          <th className="head_rows border-collapse p-2 md:p-3 text-center z-30">
            <input aria-label="Seleccionar todos los items visibles" title="Seleccionar todos los items visibles" type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
          </th>
          <th className="head_rows border-collapse py-3 px-4 text-center lg:text-left sticky top-0 left-0 z-20 !min-w-4 bg-background">Producto</th>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Estadísticas</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Precio</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Stock</td>
          <td className="head_rows border-collapse py-2 px-4 text-center lg:text-left sticky top-0 left-0 z-10 !min-w-4">Acciones</td>
        </tr>
      </thead>
      <tbody className="table_body">
        {session &&
          data?.products.map((product: Product, index: number) => (
        // {mockProducts.map((product: Product, index: number) => (
            // Si la fila está seleccionada, se le aplica un fondo de color claro
            <tr key={product.id} tabIndex={index} 
              onClick={() => router.push(`/products/${product.id}`)}
              onKeyDown={(event) => { if (event.key === "Enter") router.push(`/products/${product.id}`); }} 
              className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-secondary ${selectedRows.includes(product.id) ? "!bg-surface-hover" : ""}`}
            >
              {/* CHECKBOX */}
              <td className="table_row border-collapse p-2 md:p-3 text-center z-0">
                <input aria-label={`Seleccionar ${product.name}`} type="checkbox" checked={selectedRows.includes(product.id)} onChange={() => setSelectedRows(product.id)} onClick={(e) => e.stopPropagation()} />
              </td>
              <td className="table_row border-collapse p-2 gap-2 md:p-3 text-center lg:text-left z-0 !min-w-max flex items-center">
                {/* IMAGEN DEL ITEM */}
                <div className="relative">
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
                </div>
                {/* NOMBRE DEL ITEM */}
                <div className="min-w-0 max-w-20 md:max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  <div className="text-xs text-start space-x-1">
                    <span>Reseñas:</span>
                    <span className="inline-flex items-center gap-0.25 text-foreground">
                      <span className="font-semibold">{product.rating}</span>
                      <RiStarFill size={12} />
                    </span>
                  </div>
                </div>
              </td>
              <td className="table_row border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                <div className="text-xs space-y-1">
                  <div className="text-start space-x-1">
                    <span>Ventas: </span>
                    <span className="text-foreground font-medium">Good</span>
                  </div>
                  <div className="text-start space-x-4">
                    <div className="inline-flex items-center gap-0.25">
                      <span>
                        <RiLineChartLine size={12} />
                      </span>
                      <span className="text-foreground">123</span>
                    </div>
                    <div className="inline-flex items-center gap-0.25">
                      <span>
                        <RiShoppingBag4Line size={12} />
                      </span>
                      <span className="text-foreground">12.5K</span>
                    </div>
                  </div>
                </div>
              </td>
              {/* PRECIOS DEL ITEM */}
              <td className="table_row border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                <div className="min-w-0 max-w-20 md:max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="truncate text-start text-sm font-medium text-foreground">{formatCurrency(product.price)}</p>
                  <div className="text-xs text-start space-x-1">
                    <span className={`${
                        product.discount > 0 
                          ? "text-green-500 font-semibold "
                          : ""
                      }`
                    }>{product.discount}%</span>
                    <span className="text-foreground-muted">OFF</span>
                  </div>
                </div>
              </td>
              {/* STOCK DEL ITEM */}
              <td className="table_row border-collapse p-2 md:p-3 text-center lg:text-left !min-w-4">
                <span className="inline-flex items-center gap-1 text-xs">
                  <RiBox3Line size={16} />
                  <span className={`text-sm ${
                    product.stock <= 1
                      ? "text-red-500 font-medium"
                      : product.stock <= 5
                      ? "text-yellow-500 font-medium"
                      : "text-foreground font-medium"
                  }`}
                  >
                    {product.stock}
                  </span>
                </span>
              </td>
              {/* ACCIONES PARA EL ITEM */}
              <td className="table_row border-collapse p-2 md:p-3 text-center lg:text-left z-0 !min-w-4"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-4 items-center justify-start">
                  <DesactiveProductsButton id={product.id} status={product.isActive} />
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