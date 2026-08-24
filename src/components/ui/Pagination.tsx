"use client";

import {  RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ITEMS_PER_PAGE } from "@/const/constants";

function Pagination({ count }: { count: number }) {
  const searchPrams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = searchPrams.get("page") || "1";

  const params = new URLSearchParams(searchPrams);
  
  const hasPrev = ITEMS_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext = ITEMS_PER_PAGE * (parseInt(page) - 1) + ITEMS_PER_PAGE < count;

  // Aquí tipamos `type` como un literal de cadena
  const handleChangePage = (type: "prev" | "next"): void => {
    if (type === "prev") {
      params.set("page", (parseInt(page) - 1).toString());
    } else {
      params.set("page", (parseInt(page) + 1).toString());
    }
    replace(`${pathname}?${params}`);
  };

  // const itemsInCurrentPage =
  //   parseInt(page) === 1
  //     ? Math.min(ITEMS_PER_PAGE, count)
  //     : Math.min(ITEMS_PER_PAGE, count - ITEMS_PER_PAGE * (parseInt(page) - 1));

  // Ej. ITEMS_PER_PAGE: 12
  // Print the number of items in the current page and the total number of items
  // console.log(`Items in current page: ${itemsInCurrentPage} of ${count}`);
  // Page 3: 25-36  of 100
  // console.log(`Page ${page}: ${ITEMS_PER_PAGE * (parseInt(page) - 1) + 1}-${Math.min(ITEMS_PER_PAGE * parseInt(page), count)} of ${count}`);

  return (
    <div className="flex align-middle justify-between bg-white p-2 gap-2 shadow-md rounded-full">
      <button
        className="bg-background rounded-full text-foreground disabled:bg-transparent disabled:cursor-not-allowed disabled:text-foreground-muted"
        disabled={!hasPrev}
        aria-label="Pagina anterior"
        onClick={() => handleChangePage("prev")}>
        <RiArrowLeftSLine />
      </button>
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
      <span className="font-semibold">{`Pagína ${page}, items ${ITEMS_PER_PAGE * (parseInt(page) - 1) + 1}-${Math.min(ITEMS_PER_PAGE * parseInt(page), count)} de ${count}`}</span>
      </div>
      <button
        className="bg-background rounded-full text-foreground disabled:bg-transparent disabled:cursor-not-allowed disabled:text-foreground-muted"
        disabled={!hasNext}
        aria-label="Pagina siguinte"
        onClick={() => handleChangePage("next")}>
        <RiArrowRightSLine />
      </button>
    </div>
  );
}

export default Pagination;