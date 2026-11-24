"use client";

import { useProductsContext } from "@/components/product/context/useProductsContext";
import DeleteProductButton from "@/components/product/DeleteProductButton";
import EditProductsButton from "@/components/product/EditProductsButton";

export default function EditSelectedProductsToolbar() {
  const { selectedRows } = useProductsContext();

  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-10 right-8 p-1.5 bg-background-color shadow-md rounded-md z-50 flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        <DeleteProductButton id={selectedRows} />
        <EditProductsButton id={selectedRows} />
      </div>
    </div>
  );
}
