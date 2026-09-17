import Alert from "@/ui/Alert";
import Loading from "@/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency, formatDate } from "@/utils/handleFormatPrice";
import type { Order, OrdersPagination } from "@/components/order/interface/order.interface";
import { amount, statusClass, statusLabels } from "./order.constants";

type ListOrdersProps = {
  orders: Order[];
  count: OrdersPagination;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onSelect: (orderId: number) => void;
};

export default function ListOrders({ orders, count, isLoading, isError, errorMessage, onSelect }: ListOrdersProps) {
  return (
    <div className="rounded-md bg-background shadow-md">
      <div className="flex justify-end p-3"><Pagination count={count} /></div>
      {isLoading && <Loading message="órdenes..." />}
      {isError && <div className="p-4"><Alert message={errorMessage || "No se pudieron obtener las órdenes"} /></div>}
      {!isLoading && !isError && <div className="overflow-x-auto"><table className="w-full min-w-170 border-collapse text-left"><thead className="bg-surface-secondary text-sm"><tr><th className="p-3">Orden</th><th className="p-3">Estado</th><th className="p-3">Productos</th><th className="p-3">Total</th><th className="p-3">Fecha</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} tabIndex={0} onClick={() => onSelect(order.id)} onKeyDown={(event) => { if (event.key === "Enter") onSelect(order.id); }} className="cursor-pointer border-t border-border hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-primary"><td className="p-3 font-semibold text-foreground">#{order.id}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{statusLabels[order.status]}</span></td><td className="p-3">{order.items?.reduce((total, item) => total + item.quantity, 0) || 0}</td><td className="p-3 font-semibold text-foreground">{formatCurrency(amount(order.total))}</td><td className="p-3 text-sm">{formatDate(order.createdAt)}</td></tr>)}{!orders.length && <tr><td colSpan={5} className="p-8 text-center text-foreground-muted">No hay órdenes con estos filtros.</td></tr>}</tbody></table></div>}
    </div>
  );
}
