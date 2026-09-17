"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  RiArrowLeftLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiFilter3Line,
  RiRefreshLine,
} from "@remixicon/react";
import Alert from "@/ui/Alert";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/ui/Button";
import Loading from "@/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import { formatCurrency, formatDate } from "@/utils/handleFormatPrice";
import {
  getOrderRequest,
  listOrdersRequest,
  updateOrderPaymentRequest,
  updateOrderShipmentRequest,
  updateOrderStatusRequest,
} from "./hooks/useOrdersRequests";
import {
  ORDER_STATUSES,
  type ListOrdersQuery,
  type Order,
  type OrderStatus,
  type OrdersPagination,
  type UpdateShipmentDto,
} from "./interface/order.interface";

const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  ACREDITADO: "Pago acreditado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

const deliveryStatuses = ["pending", "preparing", "ready_pickup", "shipped", "in_transit", "out_delivery", "delivered", "failed_attempt", "returned", "cancelled"];

function amount(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusClass(status: OrderStatus): string {
  if (status === "COMPLETADO" || status === "ACREDITADO") return "bg-success/15 text-success";
  if (status === "CANCELADO") return "bg-danger/15 text-danger";
  if (status === "PENDIENTE") return "bg-warning/20 text-warning-foreground";
  return "bg-info/15 text-info";
}

function Field({ label, name, value, onChange, type = "text", disabled = false }: { label: string; name: string; value?: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; type?: string; disabled?: boolean }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <input name={name} type={type} value={value ?? ""} onChange={onChange} disabled={disabled} className="rounded-md border border-border bg-input px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60" />
    </label>
  );
}

function OrderDetail({ order, canEdit, onClose }: { order: Order; canEdit: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState(order.payment?.method || "");
  const [shipment, setShipment] = useState<UpdateShipmentDto>({ ...order.shipment });

  useEffect(() => {
    setStatus(order.status);
    setPaymentMethod(order.payment?.method || "");
    setShipment({ ...order.shipment });
  }, [order]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["order", order.id] });
  };
  const statusMutation = useMutation({ mutationFn: (nextStatus: OrderStatus) => updateOrderStatusRequest(order.id, nextStatus), onSuccess: invalidate });
  const shipmentMutation = useMutation({ mutationFn: (payload: UpdateShipmentDto) => updateOrderShipmentRequest(order.id, payload), onSuccess: invalidate });
  const paymentMutation = useMutation({ mutationFn: (method: string) => updateOrderPaymentRequest(order.id, { method }), onSuccess: invalidate });

  const updateShipmentField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipment((current) => ({ ...current, [event.target.name]: event.target.value }));
  };
  const submitShipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allowedFields: (keyof UpdateShipmentDto)[] = ["deliveredType", "pickupLocation", "fullName", "dni", "phone", "email", "streetName", "streetNumber", "city", "provinceName", "provinceCode", "postalCodeDestination"];
    const payload = allowedFields.reduce<UpdateShipmentDto>((current, field) => {
      const value = shipment[field];
      if (value !== undefined && value !== "") current[field] = value;
      return current;
    }, {});
    shipmentMutation.mutate(payload);
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} aria-label="Volver a la lista" title="Volver a la lista" className="rounded-md p-2 text-foreground hover:bg-surface-hover"><RiArrowLeftLine /></button>
          <div><p className="text-sm text-foreground-muted">Detalle de orden</p><h2 className="text-xl font-bold text-foreground">#{order.id}</h2></div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(order.status)}`}>{statusLabels[order.status]}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div><p className="text-xs text-foreground-muted">Creada</p><p className="font-medium text-foreground">{formatDate(order.createdAt)}</p></div>
        <div><p className="text-xs text-foreground-muted">Última actualización</p><p className="font-medium text-foreground">{formatDate(order.updatedAt)}</p></div>
        <div><p className="text-xs text-foreground-muted">Total</p><p className="text-xl font-bold text-foreground">{formatCurrency(amount(order.total))}</p></div>
      </div>

      {canEdit && <section className="grid gap-2 rounded-md bg-surface-secondary p-4"><h3 className="font-bold text-foreground">Estado de la orden</h3><div className="flex flex-wrap items-end gap-2"><label className="grid min-w-52 gap-1 text-sm"><span className="font-semibold">Nuevo estado</span><select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className="rounded-md border border-border bg-input px-3 py-2">{ORDER_STATUSES.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}</select></label><AlertDialog title="Confirmar cambio de estado" message={`La orden #${order.id} cambiará a ${statusLabels[status]}.`} confirmButtonProps={{ children: statusMutation.isPending ? "Actualizando..." : "Confirmar", disabled: statusMutation.isPending, variant: "primary" }}><Button disabled={statusMutation.isPending || status === order.status} onClick={() => statusMutation.mutate(status)}>{statusMutation.isPending ? "Guardando" : "Actualizar"}</Button></AlertDialog></div>{statusMutation.isError && <p className="text-sm text-danger">{statusMutation.error.message}</p>}</section>}

      <section className="grid gap-3"><h3 className="font-bold text-foreground">Productos ({order.items?.length || 0})</h3><div className="overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[520px] border-collapse text-left text-sm"><thead className="bg-surface-secondary"><tr><th className="p-3">Producto</th><th className="p-3">Cantidad</th><th className="p-3">Precio</th><th className="p-3">Subtotal</th></tr></thead><tbody>{order.items?.map((item) => <tr key={`${item.item_id}-${item.name}`} className="border-t border-border"><td className="p-3 text-foreground">{item.name}</td><td className="p-3">{item.quantity}</td><td className="p-3">{formatCurrency(amount(item.price))}</td><td className="p-3 font-semibold text-foreground">{formatCurrency(amount(item.subtotal))}</td></tr>)}{!order.items?.length && <tr><td colSpan={4} className="p-4 text-center text-foreground-muted">Esta orden no tiene productos registrados.</td></tr>}</tbody></table></div><div className="flex justify-end gap-6 text-sm"><span>Subtotal: <strong className="text-foreground">{formatCurrency(amount(order.subtotal))}</strong></span><span>Total: <strong className="text-foreground">{formatCurrency(amount(order.total))}</strong></span></div></section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="grid content-start gap-3 rounded-md border border-border p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Pago</h3>{order.payment?.payment_url && <a href={order.payment.payment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Ver pago <RiExternalLinkLine size={14} /></a>}</div><dl className="grid gap-2 text-sm"><div className="flex justify-between gap-3"><dt>Método</dt><dd className="font-medium text-foreground">{order.payment?.method || "Sin informar"}</dd></div><div className="flex justify-between gap-3"><dt>Estado</dt><dd className="font-medium text-foreground">{order.payment?.status || "Sin informar"}</dd></div><div className="flex justify-between gap-3"><dt>Detalle</dt><dd className="font-medium text-foreground">{order.payment?.status_detail || "Sin informar"}</dd></div></dl>{canEdit && <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); paymentMutation.mutate(paymentMethod); }}><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="min-w-0 flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm"><option value="">Seleccionar método</option><option value="Mercadopago">Mercadopago</option><option value="Efectivo">Efectivo</option><option value="Acordar el método de pago">Acordar el método de pago</option></select><Button type="submit" size="small" disabled={paymentMutation.isPending || !paymentMethod}>{paymentMutation.isPending ? "..." : "Guardar"}</Button></form>}{paymentMutation.isError && <p className="text-sm text-danger">{paymentMutation.error.message}</p>}</div>

        <form onSubmit={submitShipment} className="grid gap-3 rounded-md border border-border p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Envío</h3>{order.shipment?.shipment_url && <a href={order.shipment.shipment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Seguimiento <RiExternalLinkLine size={14} /></a>}</div><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-sm"><span className="font-semibold">Tipo de entrega</span><select name="deliveredType" value={shipment.deliveredType || "D"} onChange={(event) => setShipment((current) => ({ ...current, deliveredType: event.target.value }))} disabled={!canEdit} className="rounded-md border border-border bg-input px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"><option value="D">Domicilio</option><option value="S">Sucursal</option></select></label><label className="grid gap-1 text-sm"><span className="font-semibold">Estado de envío</span><select value={order.shipment?.deliveryStatus || "pending"} disabled className="rounded-md border border-border bg-input px-3 py-2">{deliveryStatuses.map((value) => <option key={value}>{value}</option>)}</select></label><Field disabled={!canEdit} label="Nombre" name="fullName" value={shipment.fullName} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Teléfono" name="phone" value={shipment.phone} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Calle" name="streetName" value={shipment.streetName} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Número" name="streetNumber" value={shipment.streetNumber} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Ciudad" name="city" value={shipment.city} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Código postal" name="postalCodeDestination" value={shipment.postalCodeDestination} onChange={updateShipmentField} /></div>{canEdit && <Button type="submit" disabled={shipmentMutation.isPending}>{shipmentMutation.isPending ? "Guardando..." : "Guardar envío"}</Button>}{shipmentMutation.isError && <p className="text-sm text-danger">{shipmentMutation.error.message}</p>}</form>
      </section>

      <section className="rounded-md bg-surface-secondary p-4"><h3 className="mb-3 font-bold text-foreground">Línea de tiempo</h3><ol className="grid gap-2 border-l-2 border-border pl-4 text-sm"><li><strong className="text-foreground">Orden creada</strong><span className="ml-2 text-foreground-muted">{formatDate(order.createdAt)}</span></li><li><strong className="text-foreground">Estado actual: {statusLabels[order.status]}</strong><span className="ml-2 text-foreground-muted">{formatDate(order.updatedAt)}</span></li>{order.shipment?.deliveryStatus && <li><strong className="text-foreground">Envío: {order.shipment.deliveryStatus}</strong></li>}</ol></section>
    </div>
  );
}

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
  return <div className="grid gap-3"><div className="rounded-md bg-background p-4 shadow-md"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-bold text-foreground">Órdenes</h1><p className="text-sm text-foreground-muted">Consulta y administra las compras de tu tienda.</p></div><button type="button" onClick={() => listQuery.refetch()} title="Actualizar órdenes" aria-label="Actualizar órdenes" className="rounded-md p-2 text-foreground hover:bg-surface-hover"><RiRefreshLine /></button></div><form onSubmit={(event) => { event.preventDefault(); updateUrl(event.currentTarget); }} className="grid gap-3 rounded-md bg-surface-secondary p-3 md:grid-cols-2 xl:grid-cols-6"><label className="grid gap-1 text-sm"><span className="font-semibold">ID de orden</span><input name="order_id" type="number" min="1" defaultValue={searchParams.get("order_id") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label><label className="grid gap-1 text-sm"><span className="font-semibold">Estado</span><select name="status" defaultValue={searchParams.get("status") || ""} className="rounded-md border border-border bg-input px-3 py-2"><option value="">Todos</option>{ORDER_STATUSES.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label><label className="grid gap-1 text-sm"><span className="font-semibold">Importe mínimo</span><input name="min_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("min_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label><label className="grid gap-1 text-sm"><span className="font-semibold">Importe máximo</span><input name="max_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("max_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label><label className="grid gap-1 text-sm"><span className="font-semibold">Desde</span><input name="from" type="date" defaultValue={searchParams.get("from") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label><label className="grid gap-1 text-sm"><span className="font-semibold">Hasta</span><input name="to" type="date" defaultValue={searchParams.get("to") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label><div className="flex items-end gap-2 md:col-span-2 xl:col-span-6"><Button type="submit" icon={<RiFilter3Line size={17} />} size="small">Filtrar</Button><Button type="button" onClick={resetFilters} icon={<RiCloseLine size={17} />} size="small" variant="secondary">Limpiar</Button></div></form></div><div className="rounded-md bg-background shadow-md"><div className="flex justify-end p-3"><Pagination count={count} /></div>{listQuery.isLoading && <Loading message="órdenes..." />}{listQuery.isError && <div className="p-4"><Alert message={listQuery.error.message} /></div>}{!listQuery.isLoading && !listQuery.isError && <div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left"><thead className="bg-surface-secondary text-sm"><tr><th className="p-3">Orden</th><th className="p-3">Estado</th><th className="p-3">Productos</th><th className="p-3">Total</th><th className="p-3">Fecha</th></tr></thead><tbody>{listQuery.data?.data.map((order) => <tr key={order.id} tabIndex={0} onClick={() => setSelectedOrderId(order.id)} onKeyDown={(event) => { if (event.key === "Enter") setSelectedOrderId(order.id); }} className="cursor-pointer border-t border-border hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><td className="p-3 font-semibold text-foreground">#{order.id}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(order.status)}`}>{statusLabels[order.status]}</span></td><td className="p-3">{order.items?.reduce((total, item) => total + item.quantity, 0) || 0}</td><td className="p-3 font-semibold text-foreground">{formatCurrency(amount(order.total))}</td><td className="p-3 text-sm">{formatDate(order.createdAt)}</td></tr>)}{!listQuery.data?.data.length && <tr><td colSpan={5} className="p-8 text-center text-foreground-muted">No hay órdenes con estos filtros.</td></tr>}</tbody></table></div>}</div></div>;
}
