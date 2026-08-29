"use client";

import { RiAddLargeLine, RiFunctionAddLine } from "@remixicon/react";
import Link from "next/link";
import { useProductsContext } from "@/components/product/context/useProductsContext";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import ListProductsTable from "@/components/product/ListProductsTable";
import Button from "@/ui/Button";
import Pagination from "@/components/ui/Pagination";

function ListProductsPage() {
  const { selectedRows, count } = useProductsContext();

return (
    <div className="main_container text-foreground flex justify-center items-center rounded-xl">
      
      <div className="section_container w-full shadow-md rounded-xl overflow-hidden min-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_5rem))]">

        {/* Header 1ts grid */}
        <section className="header_container gap-4 h-max flex justify-end sm:justify-between items-center bg-transparent-md px-4 py-2">
          <Pagination count={count} />
          <div className="flex gap-2 items-center justify-between">
            {selectedRows.length > 0 && (<DeleteProductButton id={selectedRows} />)}
            <Link href="/products/add">
              <Button
                icon={<RiAddLargeLine size={18}/>}
                size="small"
                title="Crear nuevo item"
               />
            </Link>
          </div>
        </section>

        {/* Main content 2nd grid */}
        <section className="table_container py-3 px-4 rounded-md max-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_5rem))] [overflow:auto_overlay]">
          <ListProductsTable />
        </section>

      </div>
    </div>
  );
}

export default ListProductsPage;