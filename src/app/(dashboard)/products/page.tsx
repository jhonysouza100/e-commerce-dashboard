"use client";

import { RiFunctionAddLine } from "@remixicon/react";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import { useProductsContext } from "@/components/product/context/useProductsContext";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import ListProductsTable from "@/components/product/ListProductsTable";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";

function ListProductsPage() {
  const { selectedRows, count } = useProductsContext();

return (
    <div className="main_container text-foreground flex justify-center items-center rounded-xl">
      
      <div className="section_container h-full w-full grid gap-4 p-4 grid-rows-[auto_1fr] backdrop-blur shadow-md rounded-xl overflow-hidden min-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] max-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_5rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_5rem))]">

        {/* Header 1ts grid */}
        <section className="header_container h-fit overflow-hidden gap-2 flex justify-end sm:justify-between items-center">
          <Pagination count={count} />
          <div className="flex gap-2 items-center justify-between">
            {selectedRows.length > 0 && (<DeleteProductButton id={selectedRows} />)}
            <Link href="/products/add">
              <Button
                icon={<RiFunctionAddLine size={18}/>}
                size="small"
                title="Crear nuevo item"
               />
            </Link>
          </div>
        </section>

        {/* Main content 2nd grid */}
        <section className="table_container w-full mx-auto rounded-md max-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_5rem))] [overflow:auto_overlay]">
          <ListProductsTable />
        </section>

      </div>
    </div>
  );
}

export default ListProductsPage;