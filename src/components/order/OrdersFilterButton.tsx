"use client";

import { RiCloseLine, RiFilter3Line } from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ORDER_STATUSES } from "./interface/order.interface";
import { statusLabels } from "./constants/order.constants";

const FILTER_NAMES = [
  "order_id",
  "status",
  "min_price",
  "max_price",
  "from",
  "to",
];

const inputClassName =
  "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const setOrDelete = (params: URLSearchParams, name: string, value: string) => {
  if (value) params.set(name, value);
  else params.delete(name);
};

export default function OrdersFilterButton() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const activeFiltersCount = FILTER_NAMES.filter((name) =>
    Boolean(searchParams.get(name)?.trim()),
  ).length;
  const canClearFilters =
    activeFiltersCount > 0 ||
    (searchParams.has("page") && searchParams.get("page") !== "1") ||
    searchParams.has("q");

  const closeFilters = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

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

  const toggleFilters = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setOrderId(searchParams.get("order_id") ?? "");
    setStatus(
      ORDER_STATUSES.find(
        (option) => option === searchParams.get("status"),
      ) ?? "",
    );
    setMinPrice(searchParams.get("min_price") ?? "");
    setMaxPrice(searchParams.get("max_price") ?? "");
    setFrom(searchParams.get("from") ?? "");
    setTo(searchParams.get("to") ?? "");
    setError("");
    setIsOpen(true);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_NAMES.forEach((name) => params.delete(name));
    params.delete("q");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOrderId("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    setFrom("");
    setTo("");
    setError("");
    closeFilters();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();
    if (
      trimmedOrderId &&
      (!/^[1-9]\d*$/.test(trimmedOrderId) ||
        !Number.isSafeInteger(Number(trimmedOrderId)))
    ) {
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
      setError("Los importes deben ser números iguales o mayores que cero.");
      return;
    }
    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      setError("El importe mínimo no puede superar al máximo.");
      return;
    }
    if (from && to && from > to) {
      setError("La fecha inicial no puede ser posterior a la fecha final.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    setOrDelete(params, "order_id", trimmedOrderId);
    setOrDelete(params, "status", status);
    setOrDelete(params, "min_price", trimmedMinPrice);
    setOrDelete(params, "max_price", trimmedMaxPrice);
    setOrDelete(params, "from", from);
    setOrDelete(params, "to", to);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setError("");
    closeFilters();
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Filtros de órdenes${activeFiltersCount ? `, ${activeFiltersCount} activos` : ""}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={toggleFilters}
        className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-background px-3 text-sm text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>Filtros</span>
        <RiFilter3Line size={19} aria-hidden="true" />
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
          className="absolute right-0 top-full z-60 mt-2 max-h-[calc(100dvh-6rem)] w-[min(27rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-border bg-background p-4 text-foreground shadow-lg sm:p-5"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id={`${panelId}-title`} className="text-base font-semibold">
                Filtrar órdenes
              </h2>
              <p className="mt-1 text-xs text-foreground-muted">
                Combiná ID, estado, importe o fecha.
              </p>
            </div>
            <button
              type="button"
              onClick={closeFilters}
              aria-label="Cerrar filtros"
              className="rounded-full p-1.5 text-foreground-muted transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RiCloseLine size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">ID de orden</span>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Ej. 125"
                className={inputClassName}
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Estado</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClassName}
              >
                <option value="">Todos</option>
                {ORDER_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {statusLabels[option]}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Importe mínimo</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="$ 0"
                className={inputClassName}
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Importe máximo</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Sin límite"
                className={inputClassName}
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Desde</span>
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className={inputClassName}
              />
            </label>

            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Hasta</span>
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className={inputClassName}
              />
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
              disabled={!canClearFilters}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RiCloseLine size={16} aria-hidden="true" />
              Limpiar
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
