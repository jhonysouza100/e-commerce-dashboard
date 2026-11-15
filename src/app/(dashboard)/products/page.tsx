"use client";

import { RiAddLargeLine, RiFunctionAddLine } from "@remixicon/react";
import Link from "next/link";
import { useProductsContext } from "@/components/product/context/useProductsContext";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import ListProductsTable from "@/components/product/ListProductsTable";
import Button from "@/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import MainContainer from "@/components/dashboard_layout/MainContainer";
import DuplicateProductsButton from "@/components/product/DuplicateProductsButton";
import EditProductsButton from "@/components/product/EditProductsButton";
import { useSearchParams } from "next/navigation";

function ListProductsHeader() {
  const { selectedRows, count } = useProductsContext();
  const searchParams = useSearchParams();
  const returnTo = `/products?${searchParams.toString()}`;
  const addParams = new URLSearchParams({ returnTo });

  return (
    <>
      <Pagination count={count} />
      <div className="flex gap-2 items-center justify-between">
        {selectedRows.length > 0 ? (
          <DuplicateProductsButton id={selectedRows} />
        ) : (
          <Link href={`/products/add?${addParams.toString()}`}>
            <Button
              icon={<RiAddLargeLine size={18} />}
              size="small"
              title="Crear nuevo item"
              variant="gradient"
            />
          </Link>
        )}
      </div>
    </>
  );
}

function ListProductsToolbar() {
  const { selectedRows } = useProductsContext();

  return (
    <>
    {selectedRows.length > 0 && (
      <div className="fixed bottom-10 right-8 p-1.5 bg-background-color shadow-md rounded-md z-50 flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <DeleteProductButton id={selectedRows} />
          <EditProductsButton id={selectedRows} />
        </div>
      </div>
    )}
    </>
  );
}

function ListProductsPage() {
  return (
    <>
      <MainContainer
        headerContent={<ListProductsHeader />}
        mainContent={<ListProductsTable />}
      />
      <ListProductsToolbar />
    </>
  );
}

export default ListProductsPage;
