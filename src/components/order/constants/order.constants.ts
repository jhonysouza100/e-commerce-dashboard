import type { OrderStatus } from "@/components/order/interface/order.interface";

export const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  ACREDITADO: "Pago acreditado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

export const deliveryStatuses = [
  "pending",
  "preparing",
  "ready_pickup",
  "shipped",
  "in_transit",
  "out_delivery",
  "delivered",
  "failed_attempt",
  "returned",
  "cancelled",
];

export const deliveryStatusLabels: Record<string, string> = {
  pending: "Pendiente",
  preparing: "En preparación",
  ready_pickup: "Listo para despacho",
  shipped: "Despachado",
  in_transit: "En tránsito",
  out_delivery: "En reparto",
  delivered: "Entregado",
  failed_attempt: "Visita fallida",
  returned: "Devuelto",
  cancelled: "Cancelado",
};

export function amount(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function statusClass(status: OrderStatus): string {
  if (status === "COMPLETADO" || status === "ACREDITADO") return "bg-success/15 text-success";
  if (status === "CANCELADO") return "bg-danger/15 text-danger";
  if (status === "PENDIENTE") return "bg-warning/20 text-warning-foreground";
  return "bg-info/15 text-info";
}
