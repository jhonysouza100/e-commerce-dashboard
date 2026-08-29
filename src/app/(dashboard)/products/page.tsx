"use client";

import { RiAddLargeLine, RiFunctionAddLine } from "@remixicon/react";
import Link from "next/link";
import { useProductsContext } from "@/components/product/context/useProductsContext";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import ListProductsTable from "@/components/product/ListProductsTable";
import Button from "@/ui/Button";
import Pagination from "@/components/ui/Pagination";
import MainContainer from "@/components/dashboard_layout/MainContainer";

function ListProductsHeader() {
  const { selectedRows, count } = useProductsContext();

  return (
    <>
      <Pagination count={count} />
      <div className="flex gap-2 items-center justify-between">
        {selectedRows.length > 0 && (<DeleteProductButton id={selectedRows} />)}
        <Link href="/products/add">
          <Button
            icon={<RiAddLargeLine size={18} />}
            size="small"
            title="Crear nuevo item"
          />
        </Link>
      </div>
    </>
  )
}

function ListProductsPage() {
  return (
    <>
      <MainContainer
        headerContent={<ListProductsHeader /> }
        mainContent={<ListProductsTable />}
      />
    </>
  );
}

export default ListProductsPage;