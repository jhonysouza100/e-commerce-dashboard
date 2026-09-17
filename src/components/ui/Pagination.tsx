"use client";

import {  RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export interface PaginationInterface {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function Pagination({ count }: { count: PaginationInterface }) {
  const searchPrams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = count.page;

  const params = new URLSearchParams(searchPrams);

  const hasPrev = count.hasPreviousPage;
  const hasNext = count.hasNextPage;

  // Aquí tipamos `type` como un literal de cadena
  const handleChangePage = (type: "prev" | "next"): void => {
    if (type === "prev") {
      params.set("page", (page - 1).toString());
    } else {
      params.set("page", (page + 1).toString());
    }
    replace(`${pathname}?${params}`);
  };

  const firstItem = count.total === 0 ? 0 : (page - 1) * count.limit + 1;
  const lastItem = Math.min(page * count.limit, count.total);

  return (
    <div className="flex align-middle justify-between bg-bacground p-2 gap-2 rounded-full">
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <span className="font-semibold">{`${firstItem}-${lastItem} de ${count.total}`}</span>
      </div>
      <button
        className="bg-background rounded-full text-foreground disabled:bg-transparent disabled:cursor-not-allowed disabled:text-foreground-light/50"
        disabled={!hasPrev}
        aria-label="Página anterior"
        onClick={() => handleChangePage("prev")}>
        <RiArrowLeftSLine />
      </button>
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <span className="inline-flex">Página</span>
        <span className="font-semibold">{` ${page} de ${count.totalPages}`}</span>
      </div>
      <button
        className="bg-background rounded-full text-foreground disabled:bg-transparent disabled:cursor-not-allowed disabled:text-foreground-light/50"
        disabled={!hasNext}
        aria-label="Página siguinte"
        onClick={() => handleChangePage("next")}>
        <RiArrowRightSLine />
      </button>
    </div>
  );
}