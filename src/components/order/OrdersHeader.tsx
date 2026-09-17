"use client";

import { FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiCloseLine, RiFilter3Line } from "@remixicon/react";
import Button from "@/ui/Button";
import { Pagination } from "../ui/Pagination";
import { ORDER_STATUSES } from "./interface/order.interface";
import { statusLabels } from "./constants/order.constants";
import { listOrdersRequest } from "./hooks/useOrdersRequests";
import { useAuthContext } from "../session/context/useAuthContext";
import { getOrdersQuery } from "./utils/orderQuery";

export default function OrdersHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useAuthContext();
  const query = getOrdersQuery(searchParams);
  const ordersQuery = useQuery({
    queryKey: ["orders", query],
    queryFn: () => listOrdersRequest(query),
    enabled: Boolean(session),
  });

  const updateUrl = (form: HTMLFormElement) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    ["order_id", "status", "min_price", "max_price", "from", "to"].forEach(
      (name) => {
        const value = new FormData(form).get(name)?.toString().trim();
        if (value) params.set(name, value);
        else params.delete(name);
      },
    );
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUrl(event.currentTarget);
  };

  return (
    <div className="grid w-full gap-3">
      <Pagination count={ordersQuery.data?.count || { page: 1, limit: 6, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false }} />
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-md bg-surface-secondary p-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="grid gap-1 text-sm"><span className="font-semibold">ID de orden</span><input name="order_id" type="number" min="1" defaultValue={searchParams.get("order_id") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="font-semibold">Estado</span><select name="status" defaultValue={searchParams.get("status") || ""} className="rounded-md border border-border bg-input px-3 py-2"><option value="">Todos</option>{ORDER_STATUSES.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label>
        <label className="grid gap-1 text-sm"><span className="font-semibold">Importe mínimo</span><input name="min_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("min_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="font-semibold">Importe máximo</span><input name="max_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("max_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="font-semibold">Desde</span><input name="from" type="date" defaultValue={searchParams.get("from") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
        <label className="grid gap-1 text-sm"><span className="font-semibold">Hasta</span><input name="to" type="date" defaultValue={searchParams.get("to") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-6">
          <Button type="submit" icon={<RiFilter3Line size={17} />} size="small">Filtrar</Button>
          <Button type="button" onClick={() => router.replace(pathname)} icon={<RiCloseLine size={17} />} size="small" variant="secondary">Limpiar</Button>
        </div>
      </form>
    </div>
  );
}