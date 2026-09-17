"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Alert from "@/ui/Alert";
import Loading from "@/ui/Loading";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import {
  getOrderRequest,
  listOrdersRequest,
} from "./hooks/useOrdersRequests";
import {
  type ListOrdersQuery,
  type OrderStatus,
  type OrdersPagination,
} from "./interface/order.interface";
import ListOrders from "@/components/orders/ListOrders";
import OrderDetail from "@/components/orders/OrderDetail";
import OrdersFilters from "@/components/orders/OrdersFilters";
import OrdersHeader from "@/components/orders/OrdersHeader";

export default function OrdersManager() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useAuthContext();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const canEdit = session?.role === "ADMIN" || session?.role === "ROOT";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const query: ListOrdersQuery = {
    page,
    limit: 6,
    order_id: searchParams.get("order_id") ? Number(searchParams.get("order_id")) : undefined,
    status: (searchParams.get("status") as OrderStatus) || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };
  const listQuery = useQuery({ queryKey: ["orders", query], queryFn: () => listOrdersRequest(query), enabled: Boolean(session) });
  const detailQuery = useQuery({ queryKey: ["order", selectedOrderId], queryFn: () => getOrderRequest(selectedOrderId as number), enabled: selectedOrderId !== null });

  const updateUrl = (form: HTMLFormElement) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    ["order_id", "status", "min_price", "max_price", "from", "to"].forEach((name) => {
      const value = new FormData(form).get(name)?.toString().trim();
      if (value) params.set(name, value); else params.delete(name);
    });
    router.replace(`${pathname}?${params.toString()}`);
  };
  const resetFilters = () => router.replace(pathname);

  if (selectedOrderId !== null) {
    if (detailQuery.isLoading) return <div className="rounded-md bg-background p-5 shadow-md"><Loading message="orden..." /></div>;
    if (detailQuery.isError) return <div className="rounded-md bg-background p-5 shadow-md"><Alert message={detailQuery.error.message} /></div>;
    if (detailQuery.data) return <div className="rounded-md bg-background p-5 shadow-md"><OrderDetail order={detailQuery.data} canEdit={canEdit} onClose={() => setSelectedOrderId(null)} /></div>;
  }

  const count: OrdersPagination = listQuery.data?.count || { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  return <div className="grid gap-3"><div className="rounded-md bg-background p-4 shadow-md"><OrdersHeader onRefresh={() => listQuery.refetch()} /><OrdersFilters searchParams={searchParams} onSubmit={updateUrl} onReset={resetFilters} /></div><ListOrders orders={listQuery.data?.data || []} count={count} isLoading={listQuery.isLoading} isError={listQuery.isError} errorMessage={listQuery.error?.message} onSelect={setSelectedOrderId} /></div>;
}
