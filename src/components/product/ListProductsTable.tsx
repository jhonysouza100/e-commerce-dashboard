"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  RiBarChart2Line,
  RiBox3Line,
  RiEdit2Line,
  RiEyeLine,
  RiShoppingBag3Line,
} from "@remixicon/react";
import { useProductsContext } from "./context/useProductsContext";
import { Product } from "./interface/product.interface";
import DeleteProductButton from "./DeleteProductButton";

type Performance = {
  label: "Excellent" | "Good" | "Bad";
  score: number;
  orders: string;
};

const performanceByProduct: Record<string, Performance> = {};

function getPerformance(product: Product, index: number): Performance {
  const labels: Performance["label"][] = ["Excellent", "Good", "Good", "Excellent", "Bad"];
  const label = labels[index % labels.length];
  const score = Math.max(71, Math.round((product.average ?? 3.5) * 190 - index * 23));
  return { label, score, orders: `${(12.4 - index * 0.6).toFixed(1)}k` };
}

function PerformanceGauge({ score, label }: Pick<Performance, "score" | "label">) {
  const fill = Math.min(100, Math.max(16, Math.round(score / 10)));
  return (
    <div className="flex min-w-36 items-center gap-3" aria-label={`Performance ${label}`}>
      <div className="relative h-12 w-24 overflow-hidden">
        <div
          className="absolute inset-x-0 top-2 h-24 rounded-full border-[7px] border-muted"
          style={{ clipPath: "inset(0 0 50% 0)" }}
        />
        <div
          className="absolute inset-x-0 top-2 h-24 rounded-full border-[7px] border-emerald-500"
          style={{ clipPath: `inset(0 ${100 - fill}% 50% 0)` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ListProductsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchTerm = (searchParams.get("q") || "").trim().toLowerCase();
  const { products, setCount, count, setSelectedRows, selectedRows } = useProductsContext();
  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => a.name.localeCompare(b.name));
  const pageSize = 10;
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const visibleProductIds = visibleProducts.map((product) => product.id);
  const allVisibleSelected = visibleProductIds.length > 0 && visibleProductIds.every((id) => selectedRows.includes(id));

  useEffect(() => {
    if (count !== filteredProducts.length) setCount(filteredProducts.length);
  }, [count, filteredProducts.length, setCount]);

  const toggleAllVisible = () => {
    visibleProductIds.forEach((id) => {
      if (allVisibleSelected === selectedRows.includes(id)) setSelectedRows(id);
    });
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
      <div className="min-w-[1120px]">
        <div className="grid grid-cols-[40px_minmax(245px,1.7fr)_minmax(235px,1.4fr)_135px_170px_135px_120px] items-center gap-0 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
          <div>
            <input aria-label="Seleccionar todos los items visibles" title="Seleccionar todos los items visibles" type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
          </div>
          <div>Product</div>
          <div>Performance</div>
          <div>Stock</div>
          <div>Product Price</div>
          <div>Discount</div>
          <div>Visibility</div>
        </div>

        {visibleProducts.map((product: Product, index: number) => {
          const performance = performanceByProduct[product.id] ?? getPerformance(product, index);
          const isSelected = selectedRows.includes(product.id);
          const isVisible = product.isActive !== false;
          const price = product.price > 0 ? `$${product.price.toFixed(2)} USD` : "Custom";
          return (
            <div
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/products/${product.id}`)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") router.push(`/products/${product.id}`); }}
              className={`grid grid-cols-[40px_minmax(245px,1.7fr)_minmax(235px,1.4fr)_135px_170px_135px_120px] items-center border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "bg-muted/60" : ""}`}
            >
              <div onClick={(event) => event.stopPropagation()}>
                <input aria-label={`Seleccionar ${product.name}`} type="checkbox" checked={isSelected} onChange={() => setSelectedRows(product.id)} />
              </div>

              <div className="flex min-w-0 items-center gap-3 pr-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image className={`h-full w-full object-cover ${!isVisible ? "grayscale" : ""}`} src={product.images?.[0]?.secure_url ?? "/placeholder.svg"} alt={product.name} width={56} height={56} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Review&nbsp; : <span className="font-semibold text-foreground">{(product.average ?? 0).toFixed(1)}★</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-border pl-6">
                <div>
                  <p className="text-sm text-foreground">{performance.score}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><RiBarChart2Line className="size-4" /> {performance.orders}</p>
                </div>
                <PerformanceGauge score={performance.score} label={performance.label} />
              </div>

              <div className="border-l border-border pl-6">
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className={`mt-1 flex items-center gap-2 text-sm font-medium ${product.stock === 0 ? "text-destructive" : "text-foreground"}`}><RiBox3Line className="size-5 text-muted-foreground" /> {product.stock ?? 0}</p>
              </div>

              <div className="border-l border-border pl-6">
                <p className="text-xs text-muted-foreground">Product Price</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground"><span className="text-muted-foreground">$</span>{price.replace("$", "")}</p>
              </div>

              <div className="border-l border-border pl-6">
                <p className="text-xs text-muted-foreground">Discount</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-600"><RiShoppingBag3Line className="size-4" /> {Math.round(product.discount ?? 0)}%</p>
              </div>

              <div className="flex items-center justify-between border-l border-border pl-6">
                <div>
                  <p className="text-xs text-muted-foreground">Visibility</p>
                  <div className={`mt-2 flex h-5 w-9 items-center rounded-full p-0.5 ${isVisible ? "justify-end bg-foreground" : "justify-start bg-muted-foreground/30"}`} aria-label={isVisible ? "Visible" : "Hidden"}>
                    <span className={`size-4 rounded-full ${isVisible ? "bg-background" : "bg-background"}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                  <button type="button" aria-label={`Editar ${product.name}`} className="text-foreground transition-colors hover:text-primary" onClick={() => router.push(`/products/${product.id}`)}><RiEdit2Line className="size-5" /></button>
                  <button type="button" aria-label={`${isVisible ? "Ocultar" : "Ver"} ${product.name}`} className="text-foreground transition-colors hover:text-primary"><RiEyeLine className="size-5" /></button>
                  <DeleteProductButton id={product.id} />
                </div>
              </div>
            </div>
          );
        })}
        {visibleProducts.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No products found.</div>}
      </div>
    </div>
  );
}

export default ListProductsTable;
