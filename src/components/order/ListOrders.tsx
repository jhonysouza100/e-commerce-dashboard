"use client";

import Link from "next/link";
import { RiBox3Line } from "@remixicon/react";
import Loading from "@/ui/Loading";
import Message from "@/ui/Message";
import { formatCurrency, formatDate } from "@/utils/handleFormatPrice";
import type { Order } from "./interface/order.interface";
import {
  amount,
  deliveryStatusLabels,
  statusClass,
  statusLabels,
} from "./constants/order.constants";
import { useOrdersListQuery } from "./hooks/useOrdersListQuery";

function getUnits(order: Order) {
  return order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
}

function getCustomerName(order: Order) {
  return order.shipment?.fullName || (order.user_id ? `Cliente #${order.user_id}` : "Sin datos del cliente");
}

function getPaymentLabel(order: Order) {
  return (
    order.payment?.status_detail ||
    order.payment?.status ||
    order.payment?.method ||
    "Sin información"
  );
}

export default function ListOrders() {
  const { count, listQuery, searchParams } = useOrdersListQuery();

  const orders = listQuery.data?.data ?? [];
  const returnTo = `/orders?${searchParams.toString()}`;
  const detailHref = (id: number) =>
    `/orders/${id}?${new URLSearchParams({ returnTo }).toString()}`;

  return (
    <section className="grid gap-4">
      {listQuery.isLoading && (
        <div className="rounded-2xl border border-border bg-background p-6">
          <Loading message="órdenes..." />
        </div>
      )}

      {listQuery.isError && (
        <div className="rounded-2xl border border-danger-border bg-background p-4">
          <Message
            message={listQuery.error.message || "No se pudieron obtener las órdenes"}
            variant="danger"
          />
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && orders.length === 0 && (
        <div className="grid justify-items-center gap-2 rounded-2xl border border-dashed border-border bg-background px-5 py-12 text-center">
          <RiBox3Line size={28} className="text-foreground-muted" aria-hidden="true" />
          <h3 className="font-semibold text-foreground">
            No hay órdenes para mostrar
          </h3>
          <p className="max-w-md text-sm text-foreground-muted">
            Probá cambiar los filtros o limpiar la búsqueda para volver a ver todas las órdenes.
          </p>
        </div>
      )}

      {!listQuery.isLoading && !listQuery.isError && orders.length > 0 && (
        <>
          <div className="grid gap-3 md:hidden">
            {orders.map((order) => {
              const shipmentStatus = order.shipment?.deliveryStatus;
              return (
                <Link
                  key={order.id}
                  href={detailHref(order.id)}
                  aria-label={`Ver orden ${order.id}, ${statusLabels[order.status]}`}
                  className="grid gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-foreground">Orden #{order.id}</p>
                      <p className="mt-1 truncate text-sm text-foreground-muted">
                        {getCustomerName(order)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
                    <div>
                      <p className="text-xs text-foreground-muted">Unidades</p>
                      <p className="mt-1 font-medium text-foreground">{getUnits(order)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Pago</p>
                      <p className="mt-1 truncate font-medium text-foreground">
                        {getPaymentLabel(order)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Envío</p>
                      <p className="mt-1 truncate font-medium text-foreground">
                        {shipmentStatus
                          ? deliveryStatusLabels[shipmentStatus] ?? shipmentStatus
                          : order.shipment
                            ? "Pendiente"
                            : "No informado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">Fecha</p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <span className="text-xs text-foreground-muted">
                      Total registrado · envío aparte
                    </span>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-foreground">
                        {formatCurrency(amount(order.total))}
                      </span>
                      {order.shipment && (
                        <span className="text-xs text-foreground-muted">
                          Envío {formatCurrency(amount(order.shipment.shipment_cost))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-background shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 border-collapse text-left">
                <thead className="bg-surface-secondary text-xs uppercase tracking-wide text-foreground-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Orden</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Estado</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Unidades</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Pago / envío</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Total</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const shipmentStatus = order.shipment?.deliveryStatus;
                    return (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-surface-hover"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={detailHref(order.id)}
                            className="font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline"
                          >
                            #{order.id}
                          </Link>
                          <p className="mt-1 max-w-48 truncate text-xs text-foreground-muted">
                            {getCustomerName(order)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground">
                          {getUnits(order)}
                          <span className="ml-1 text-xs text-foreground-muted">
                            {getUnits(order) === 1 ? "unidad" : "unidades"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-52 truncate text-sm font-medium text-foreground">
                            {getPaymentLabel(order)}
                          </p>
                          <p className="mt-1 text-xs text-foreground-muted">
                            {shipmentStatus
                              ? deliveryStatusLabels[shipmentStatus] ?? shipmentStatus
                              : order.shipment
                                ? "Pendiente"
                                : "Sin envío"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-foreground">
                          {formatCurrency(amount(order.total))}
                          {Number(order.shipment?.shipment_cost ?? 0) > 0 && (
                            <p className="mt-1 text-xs font-normal text-foreground-muted">
                              + envío {formatCurrency(amount(order.shipment?.shipment_cost))}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground-muted">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}
    </section>
  );
}
