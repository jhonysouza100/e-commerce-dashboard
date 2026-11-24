"use client";

import { RiAddLargeLine } from "@remixicon/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import DuplicateProductsButton from "@/components/product/DuplicateProductsButton";
import { useProductsContext } from "@/components/product/context/useProductsContext";

export default function ListProductsHeader() {
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
