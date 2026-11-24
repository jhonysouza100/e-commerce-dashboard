"use client";

import { RiFilter3Line } from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

const FILTER_PARAMS = ["id", "topic", "minPrice", "maxPrice", "isActive", "stock"];

const inputClassName =
  "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30";

const setOrDelete = (params: URLSearchParams, key: string, value: string) => {
  if (value) params.set(key, value);
  else params.delete(key);
};

const FilterProductsButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [topic, setTopic] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isActive, setIsActive] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeFiltersCount = FILTER_PARAMS.filter((key) =>
    Boolean(searchParams.get(key)?.trim()),
  ).length;

  const toggleFilters = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setProductId(searchParams.get("id") ?? "");
    setTopic(searchParams.get("topic") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setIsActive(searchParams.get("isActive") ?? "");
    setStock(searchParams.get("stock") ?? "");
    setError("");
    setIsOpen(true);
  };

  const updateFilters = (values: {
    id: string;
    topic: string;
    minPrice: string;
    maxPrice: string;
    isActive: string;
    stock: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    setOrDelete(params, "id", values.id);
    setOrDelete(params, "topic", values.topic);
    setOrDelete(params, "minPrice", values.minPrice);
    setOrDelete(params, "maxPrice", values.maxPrice);
    setOrDelete(params, "isActive", values.isActive);
    setOrDelete(params, "stock", values.stock);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedId = productId.trim();
    if (trimmedId && (!/^[1-9]\d*$/.test(trimmedId) || !Number.isSafeInteger(Number(trimmedId)))) {
      setError("El ID debe ser un entero positivo.");
      return;
    }

    const trimmedMinPrice = minPrice.trim();
    const trimmedMaxPrice = maxPrice.trim();
    const parsedMinPrice = trimmedMinPrice ? Number(trimmedMinPrice) : undefined;
    const parsedMaxPrice = trimmedMaxPrice ? Number(trimmedMaxPrice) : undefined;
    if (
      (parsedMinPrice !== undefined &&
        (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0)) ||
      (parsedMaxPrice !== undefined &&
        (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0))
    ) {
      setError("Los precios deben ser números iguales o mayores que cero.");
      return;
    }
    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      setError("El precio mínimo no puede superar al máximo.");
      return;
    }

    updateFilters({
      id: trimmedId,
      topic: topic.trim(),
      minPrice: trimmedMinPrice,
      maxPrice: trimmedMaxPrice,
      isActive,
      stock,
    });
    setError("");
    setIsOpen(false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_PARAMS.forEach((key) => params.delete(key));
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setProductId("");
    setTopic("");
    setMinPrice("");
    setMaxPrice("");
    setIsActive("");
    setStock("");
    setError("");
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative shrink-0 inline-flex items-center justify-center">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Filtros de productos${activeFiltersCount ? `, ${activeFiltersCount} activos` : ""}`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggleFilters}
        className="inline-flex cursor-pointer items-center justify-center p-1 rounded-full"
        title={`Filtros de productos${activeFiltersCount ? `, ${activeFiltersCount} activos` : ""}`}
      >
        <RiFilter3Line size={24} aria-hidden="true" />
        {activeFiltersCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-xs font-semibold text-background">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <form
          id={panelId}
          role="dialog"
          aria-labelledby={`${panelId}-title`}
          onSubmit={handleSubmit}
          className="absolute right-0 top-full z-60 mt-2 max-h-[calc(100dvh-6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-border bg-background p-4 text-foreground shadow-lg"
        >
          <div className="mb-4">
            <h2 id={`${panelId}-title`} className="text-base font-semibold">
              Filtrar productos
            </h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Combina criterios para acotar los resultados.
            </p>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">ID exacto</span>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                className={inputClassName}
                placeholder="Ej. 25"
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Tema</span>
              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className={inputClassName}
                placeholder="Ej. nuevo"
              />
            </label>

            <fieldset className="grid gap-1.5">
              <legend className="mb-1 text-sm font-medium">Rango de precio</legend>
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-xs text-foreground-muted">
                  <span>Mínimo</span>
                  <input
                    aria-label="Precio mínimo"
                    type="number"
                    min="0"
                    step="any"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    className={inputClassName}
                    placeholder="0"
                  />
                </label>
                <label className="grid gap-1 text-xs text-foreground-muted">
                  <span>Máximo</span>
                  <input
                    aria-label="Precio máximo"
                    type="number"
                    min="0"
                    step="any"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className={inputClassName}
                    placeholder="Sin límite"
                  />
                </label>
              </div>
            </fieldset>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Estado</span>
              <select
                value={isActive}
                onChange={(event) => setIsActive(event.target.value)}
                className={inputClassName}
              >
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Disponibilidad</span>
              <select
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className={inputClassName}
              >
                <option value="">Cualquier stock</option>
                <option value="true">Con stock</option>
                <option value="false">Sin stock</option>
              </select>
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterProductsButton;
