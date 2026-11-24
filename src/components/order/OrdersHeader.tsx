"use client";

import { Pagination } from "@/components/ui/Pagination";
import OrdersFilterButton from "./OrdersFilterButton";
import { useOrdersListQuery } from "./hooks/useOrdersListQuery";

export default function OrdersHeader() {
  const { count } = useOrdersListQuery();

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Pagination count={count} />
      <OrdersFilterButton />
    </div>
  );
}
