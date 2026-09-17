"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/ui/Alert";
import Loading from "@/ui/Loading";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import { formatCurrency, formatDate } from "@/utils/handleFormatPrice";
import type {
  Order,
} from "@/components/order/interface/order.interface";
import { amount, statusClass, statusLabels } from "./constants/order.constants";
import { listOrdersRequest } from "./hooks/useOrdersRequests";
import { getOrdersQuery } from "./utils/orderQuery";

export default function ListOrders() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useAuthContext();
  const query = getOrdersQuery(searchParams);
  const listQuery = useQuery({
    queryKey: ["orders", query],
    queryFn: () => listOrdersRequest(query),
    enabled: Boolean(session),
  });

  const orders: Order[] = listQuery.data?.data || [];

  return (
    <div className="rounded-md bg-background shadow-md">
      {listQuery.isLoading && <Loading message="órdenes..." />}
      {listQuery.isError && (
        <div className="p-4">
          <Alert
            message={listQuery.error.message || "No se pudieron obtener las órdenes"}
          />
        </div>
      )}
      {!listQuery.isLoading && !listQuery.isError && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-170 border-collapse text-left">
            <thead className="text-sm">
              <tr>
                <th className="p-3">Orden</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Productos</th>
                <th className="p-3">Total</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") router.push(`/orders/${order.id}`);
                  }}
                  className="cursor-pointer hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <td className="p-3 font-semibold text-foreground">
                    #{order.id}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.items?.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    ) || 0}
                  </td>
                  <td className="p-3 font-semibold text-foreground">
                    {formatCurrency(amount(order.total))}
                  </td>
                  <td className="p-3 text-sm">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-foreground-muted"
                  >
                    No hay órdenes con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
