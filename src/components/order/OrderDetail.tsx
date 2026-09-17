"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiExternalLinkLine } from "@remixicon/react";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/ui/Button";
import { formatCurrency, formatDate } from "@/utils/handleFormatPrice";
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type UpdateShipmentDto,
} from "@/components/order/interface/order.interface";
import {
  updateOrderPaymentRequest,
  updateOrderShipmentRequest,
  updateOrderStatusRequest,
} from "@/components/order/hooks/useOrdersRequests";
import { amount, deliveryStatuses, statusLabels } from "./constants/order.constants";

type OrderDetailProps = {
  order: Order;
  canEdit: boolean;
};

type FieldProps = {
  label: string;
  name: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

function Field({ label, name, value, onChange, disabled = false }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <input name={name} value={value ?? ""} onChange={onChange} disabled={disabled} className="rounded-md border border-border bg-input px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60" />
    </label>
  );
}

export default function OrderDetail({ order, canEdit }: OrderDetailProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState(order.payment?.method || "");
  const [shipment, setShipment] = useState<UpdateShipmentDto>({ ...order.shipment });

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
      <div className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-foreground-muted">Creada</p><p className="font-medium text-foreground">{formatDate(order.createdAt)}</p></div><div><p className="text-xs text-foreground-muted">Última actualización</p><p className="font-medium text-foreground">{formatDate(order.updatedAt)}</p></div><div><p className="text-xs text-foreground-muted">Total</p><p className="text-xl font-bold text-foreground">{formatCurrency(amount(order.total))}</p></div></div>
      {canEdit && <section className="grid gap-2 rounded-md bg-surface-secondary p-4"><h3 className="font-bold text-foreground">Estado de la orden</h3><div className="flex flex-wrap items-end gap-2"><label className="grid min-w-52 gap-1 text-sm"><span className="font-semibold">Nuevo estado</span><select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className="rounded-md border border-border bg-input px-3 py-2">{ORDER_STATUSES.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}</select></label><AlertDialog title="Confirmar cambio de estado" message={`La orden #${order.id} cambiará a ${statusLabels[status]}.`} confirmButtonProps={{ children: statusMutation.isPending ? "Actualizando..." : "Confirmar", disabled: statusMutation.isPending, variant: "primary" }}><Button disabled={statusMutation.isPending || status === order.status} onClick={() => statusMutation.mutate(status)}>{statusMutation.isPending ? "Guardando" : "Actualizar"}</Button></AlertDialog></div>{statusMutation.isError && <p className="text-sm text-danger">{statusMutation.error.message}</p>}</section>}
      <section className="grid gap-3"><h3 className="font-bold text-foreground">Productos ({order.items?.length || 0})</h3><div className="overflow-x-auto rounded-md border border-border"><table className="w-full min-w-130 border-collapse text-left text-sm"><thead className="bg-surface-secondary"><tr><th className="p-3">Producto</th><th className="p-3">Cantidad</th><th className="p-3">Precio</th><th className="p-3">Subtotal</th></tr></thead><tbody>{order.items?.map((item) => <tr key={`${item.item_id}-${item.name}`} className="border-t border-border"><td className="p-3 text-foreground">{item.name}</td><td className="p-3">{item.quantity}</td><td className="p-3">{formatCurrency(amount(item.price))}</td><td className="p-3 font-semibold text-foreground">{formatCurrency(amount(item.subtotal))}</td></tr>)}{!order.items?.length && <tr><td colSpan={4} className="p-4 text-center text-foreground-muted">Esta orden no tiene productos registrados.</td></tr>}</tbody></table></div><div className="flex justify-end gap-6 text-sm"><span>Subtotal: <strong className="text-foreground">{formatCurrency(amount(order.subtotal))}</strong></span><span>Total: <strong className="text-foreground">{formatCurrency(amount(order.total))}</strong></span></div></section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="grid content-start gap-3 rounded-md border border-border p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Pago</h3>{order.payment?.payment_url && <a href={order.payment.payment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Ver pago <RiExternalLinkLine size={14} /></a>}</div><dl className="grid gap-2 text-sm"><div className="flex justify-between gap-3"><dt>Método</dt><dd className="font-medium text-foreground">{order.payment?.method || "Sin informar"}</dd></div><div className="flex justify-between gap-3"><dt>Estado</dt><dd className="font-medium text-foreground">{order.payment?.status || "Sin informar"}</dd></div><div className="flex justify-between gap-3"><dt>Detalle</dt><dd className="font-medium text-foreground">{order.payment?.status_detail || "Sin informar"}</dd></div></dl>{canEdit && <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); paymentMutation.mutate(paymentMethod); }}><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="min-w-0 flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm"><option value="">Seleccionar método</option><option value="Mercadopago">Mercadopago</option><option value="Efectivo">Efectivo</option><option value="Acordar el método de pago">Acordar el método de pago</option></select><Button type="submit" size="small" disabled={paymentMutation.isPending || !paymentMethod}>{paymentMutation.isPending ? "..." : "Guardar"}</Button></form>}{paymentMutation.isError && <p className="text-sm text-danger">{paymentMutation.error.message}</p>}</div>
        <form onSubmit={submitShipment} className="grid gap-3 rounded-md border border-border p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Envío</h3>{order.shipment?.shipment_url && <a href={order.shipment.shipment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Seguimiento <RiExternalLinkLine size={14} /></a>}</div><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-sm"><span className="font-semibold">Tipo de entrega</span><select name="deliveredType" value={shipment.deliveredType || "D"} onChange={(event) => setShipment((current) => ({ ...current, deliveredType: event.target.value }))} disabled={!canEdit} className="rounded-md border border-border bg-input px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"><option value="D">Domicilio</option><option value="S">Sucursal</option></select></label><label className="grid gap-1 text-sm"><span className="font-semibold">Estado de envío</span><select value={order.shipment?.deliveryStatus || "pending"} disabled className="rounded-md border border-border bg-input px-3 py-2">{deliveryStatuses.map((value) => <option key={value}>{value}</option>)}</select></label><Field disabled={!canEdit} label="Nombre" name="fullName" value={shipment.fullName} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Teléfono" name="phone" value={shipment.phone} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Calle" name="streetName" value={shipment.streetName} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Número" name="streetNumber" value={shipment.streetNumber} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Ciudad" name="city" value={shipment.city} onChange={updateShipmentField} /><Field disabled={!canEdit} label="Código postal" name="postalCodeDestination" value={shipment.postalCodeDestination} onChange={updateShipmentField} /></div>{canEdit && <Button type="submit" disabled={shipmentMutation.isPending}>{shipmentMutation.isPending ? "Guardando..." : "Guardar envío"}</Button>}{shipmentMutation.isError && <p className="text-sm text-danger">{shipmentMutation.error.message}</p>}</form>
      </section>
      <section className="rounded-md bg-surface-secondary p-4"><h3 className="mb-3 font-bold text-foreground">Línea de tiempo</h3><ol className="grid gap-2 border-l-2 border-border pl-4 text-sm"><li><strong className="text-foreground">Orden creada</strong><span className="ml-2 text-foreground-muted">{formatDate(order.createdAt)}</span></li><li><strong className="text-foreground">Estado actual: {statusLabels[order.status]}</strong><span className="ml-2 text-foreground-muted">{formatDate(order.updatedAt)}</span></li>{order.shipment?.deliveryStatus && <li><strong className="text-foreground">Envío: {order.shipment.deliveryStatus}</strong></li>}</ol></section>
    </div>
  );
}
