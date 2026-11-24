"use client";

import { useState, type ChangeEvent, type FormEvent, type HTMLInputTypeAttribute } from "react";
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
import {
  amount,
  deliveryStatusLabels,
  statusClass,
  statusLabels,
} from "./constants/order.constants";

type OrderDetailProps = {
  order: Order;
  canEdit: boolean;
};

type ShipmentFieldName = keyof UpdateShipmentDto;

type ShipmentFieldProps = {
  label: string;
  name: ShipmentFieldName;
  value?: string;
  type?: HTMLInputTypeAttribute;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const cardClassName =
  "rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5";
const fieldClassName =
  "min-w-0 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const SHIPMENT_FIELDS: Array<{
  label: string;
  name: ShipmentFieldName;
  type?: HTMLInputTypeAttribute;
}> = [
  { label: "Nombre completo", name: "fullName" },
  { label: "DNI", name: "dni" },
  { label: "Teléfono", name: "phone", type: "tel" },
  { label: "Correo electrónico", name: "email", type: "email" },
  { label: "Calle", name: "streetName" },
  { label: "Número", name: "streetNumber" },
  { label: "Ciudad", name: "city" },
  { label: "Provincia", name: "provinceName" },
  { label: "Código de provincia", name: "provinceCode" },
  { label: "Código postal", name: "postalCodeDestination" },
  { label: "Código postal de origen", name: "postalCodeOrigin" },
  { label: "Sucursal", name: "pickupLocation" },
];
const REQUIRED_SHIPMENT_FIELDS: ShipmentFieldName[] = [
  "fullName",
  "dni",
  "phone",
  "postalCodeDestination",
];
const EDITABLE_SHIPMENT_FIELDS: ShipmentFieldName[] = [
  "deliveredType",
  ...SHIPMENT_FIELDS.map(({ name }) => name),
];

function ShipmentField({
  label,
  name,
  value,
  type = "text",
  disabled,
  onChange,
}: ShipmentFieldProps) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className={fieldClassName}
      />
    </label>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-surface-secondary p-3">
      <dt className="text-xs text-foreground-muted">{label}</dt>
      <dd className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

export default function OrderDetail({ order, canEdit }: OrderDetailProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentMethod, setPaymentMethod] = useState(order.payment?.method || "");
  const [shipment, setShipment] = useState<UpdateShipmentDto>({
    deliveredType: order.shipment?.deliveredType ?? "D",
    ...order.shipment,
  });
  const [shipmentError, setShipmentError] = useState("");

  const invalidate = async (updatedOrder: Order) => {
    queryClient.setQueryData(["order", order.id], updatedOrder);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["orders"] }),
      queryClient.invalidateQueries({ queryKey: ["order", order.id] }),
    ]);
  };

  const statusMutation = useMutation({
    mutationFn: (nextStatus: OrderStatus) =>
      updateOrderStatusRequest(order.id, nextStatus),
    onSuccess: (updatedOrder) => {
      setStatus(updatedOrder.status);
      return invalidate(updatedOrder);
    },
  });
  const shipmentMutation = useMutation({
    mutationFn: (payload: UpdateShipmentDto) =>
      updateOrderShipmentRequest(order.id, payload),
    onSuccess: (updatedOrder) => {
      setShipment({ ...updatedOrder.shipment });
      return invalidate(updatedOrder);
    },
  });
  const paymentMutation = useMutation({
    mutationFn: (method: string) =>
      updateOrderPaymentRequest(order.id, { method }),
    onSuccess: (updatedOrder) => {
      setPaymentMethod(updatedOrder.payment?.method || "");
      return invalidate(updatedOrder);
    },
  });

  const updateShipmentField = (
    field: ShipmentFieldName,
    value: string,
  ) => {
    setShipment((current) => ({ ...current, [field]: value }));
    setShipmentError("");
  };

  const submitShipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) return;

    if (
      !order.shipment &&
      REQUIRED_SHIPMENT_FIELDS.some((field) => !shipment[field]?.trim())
    ) {
      setShipmentError(
        "Completá nombre, DNI, teléfono y código postal para agregar el envío.",
      );
      return;
    }

    const payload: UpdateShipmentDto = {};
    for (const field of EDITABLE_SHIPMENT_FIELDS) {
      const value = shipment[field];
      if (value === undefined || value === order.shipment?.[field]) continue;
      if (value === "" && REQUIRED_SHIPMENT_FIELDS.includes(field)) {
        setShipmentError(
          "Nombre, DNI, teléfono y código postal no pueden quedar vacíos.",
        );
        return;
      }
      payload[field] = value;
    }

    if (Object.keys(payload).length > 0) shipmentMutation.mutate(payload);
  };

  const totalUnits =
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const shipmentCost = amount(order.shipment?.shipment_cost);
  const shipmentStatus = order.shipment?.deliveryStatus;

  return (
    <div className="grid gap-5">
      <section className={cardClassName}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground-muted">Detalle de orden</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">
              Orden #{order.id}
            </h1>
            <p className="mt-1 text-sm text-foreground-muted">
              Creada el {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${statusClass(order.status)}`}
          >
            {statusLabels[order.status]}
          </span>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryItem
            label="Total registrado"
            value={formatCurrency(amount(order.total))}
          />
          <SummaryItem
            label="Unidades"
            value={`${totalUnits} ${totalUnits === 1 ? "unidad" : "unidades"}`}
          />
          <SummaryItem
            label="Estado del pago"
            value={
              order.payment?.status_detail ||
              order.payment?.status ||
              "Pendiente de confirmación"
            }
          />
          <SummaryItem
            label="Última actualización"
            value={formatDate(order.updatedAt)}
          />
        </dl>
      </section>

      {canEdit && (
        <section className={`${cardClassName} grid gap-3`}>
          <div>
            <h2 className="font-semibold text-foreground">Estado de la orden</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              El estado manual no modifica el inventario ni el estado del pago.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="grid w-full max-w-sm gap-1.5 text-sm">
              <span className="font-medium text-foreground">Nuevo estado</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as OrderStatus)}
                className={fieldClassName}
              >
                {ORDER_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {statusLabels[option]}
                  </option>
                ))}
              </select>
            </label>
            <AlertDialog
              title="Confirmar cambio de estado"
              message={`La orden #${order.id} cambiará a ${statusLabels[status]}.`}
              confirmButtonProps={{
                children: statusMutation.isPending ? "Actualizando..." : "Confirmar",
                disabled: statusMutation.isPending,
                variant: "primary",
              }}
            >
              <Button
                type="button"
                onClick={() => statusMutation.mutate(status)}
                disabled={statusMutation.isPending || status === order.status}
              >
                {statusMutation.isPending ? "Guardando..." : "Actualizar estado"}
              </Button>
            </AlertDialog>
          </div>
          {statusMutation.isError && (
            <p role="alert" className="text-sm text-danger">
              {statusMutation.error.message}
            </p>
          )}
        </section>
      )}

      <section className={cardClassName}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Productos</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {order.items?.length ?? 0}{" "}
              {(order.items?.length ?? 0) === 1 ? "producto" : "productos"} ·{" "}
              {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-155 border-collapse text-left text-sm">
            <thead className="bg-surface-secondary text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Producto</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">Cantidad</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">Precio unitario</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">Descuento</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items?.map((item) => (
                <tr key={`${item.item_id}-${item.name}`}>
                  <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                    <span className="block max-w-56 truncate">{item.name}</span>
                    <span className="mt-1 block text-xs text-foreground-muted">
                      ID {item.item_id}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-foreground sm:px-4">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-foreground sm:px-4">
                    {formatCurrency(amount(item.price))}
                  </td>
                  <td className="px-3 py-3 text-right text-foreground-muted sm:px-4">
                    {amount(item.discount) > 0
                      ? `${amount(item.discount)}%`
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-foreground sm:px-4">
                    {formatCurrency(amount(item.subtotal) * item.quantity)}
                  </td>
                </tr>
              ))}
              {!order.items?.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-foreground-muted"
                  >
                    Esta orden no tiene productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto mt-4 grid w-full max-w-sm gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-foreground-muted">Subtotal de productos</dt>
            <dd className="font-medium text-foreground">
              {formatCurrency(amount(order.subtotal))}
            </dd>
          </div>
          {order.shipment && (
            <div className="flex justify-between gap-4">
              <dt className="text-foreground-muted">Envío (registrado aparte)</dt>
              <dd className="font-medium text-foreground">
                {formatCurrency(shipmentCost)}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-border pt-2 text-base">
            <dt className="font-semibold text-foreground">Total registrado</dt>
            <dd className="font-bold text-foreground">
              {formatCurrency(amount(order.total))}
            </dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className={`${cardClassName} grid content-start gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Pago</h2>
              <p className="mt-1 text-sm text-foreground-muted">
                Datos sincronizados con Mercado Pago.
              </p>
            </div>
            {order.payment?.payment_url && (
              <a
                href={order.payment.payment_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Ver pago
                <RiExternalLinkLine size={15} aria-hidden="true" />
              </a>
            )}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <SummaryItem
              label="Método"
              value={order.payment?.method || "Sin informar"}
            />
            <SummaryItem
              label="Estado"
              value={
                order.payment?.status_detail ||
                order.payment?.status ||
                "Sin información"
              }
            />
            <SummaryItem
              label="ID de pago"
              value={order.payment?.payment_id || "Sin informar"}
            />
            <SummaryItem
              label="Preferencia"
              value={order.payment?.preference_id || "Sin informar"}
            />
          </dl>

          {canEdit && (
            <form
              className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (
                  paymentMethod &&
                  paymentMethod !== order.payment?.method
                ) {
                  paymentMutation.mutate(paymentMethod);
                }
              }}
            >
              <label className="grid min-w-0 flex-1 gap-1.5 text-sm">
                <span className="font-medium text-foreground">Método de pago</span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className={fieldClassName}
                >
                  <option value="">Seleccionar método</option>
                  <option value="Mercadopago">Mercadopago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Acordar el método de pago">
                    Acordar el método de pago
                  </option>
                </select>
              </label>
              <Button
                type="submit"
                size="small"
                disabled={
                  paymentMutation.isPending ||
                  !paymentMethod ||
                  paymentMethod === order.payment?.method
                }
                className="self-end"
              >
                {paymentMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          )}
          {paymentMutation.isError && (
            <p role="alert" className="text-sm text-danger">
              {paymentMutation.error.message}
            </p>
          )}
        </section>

        <section className={`${cardClassName} grid content-start gap-4`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Envío</h2>
              <p className="mt-1 text-sm text-foreground-muted">
                Los cambios se guardan en la orden y pueden notificar al cliente.
              </p>
            </div>
            <span className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground-muted">
              {shipmentStatus
                ? deliveryStatusLabels[shipmentStatus] ?? shipmentStatus
                : order.shipment
                  ? "Pendiente"
                  : "Sin envío"}
            </span>
          </div>

          {order.shipment || canEdit ? (
            <form onSubmit={submitShipment} className="grid gap-4">
              {!order.shipment && (
                <p className="text-sm text-foreground-muted">
                  Esta orden no tiene envío. Completá los datos para agregarlo.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Tipo de entrega</span>
                  <select
                    value={shipment.deliveredType || "D"}
                    onChange={(event) =>
                      updateShipmentField("deliveredType", event.target.value)
                    }
                    disabled={!canEdit}
                    className={fieldClassName}
                  >
                    <option value="D">Domicilio</option>
                    <option value="S">Sucursal</option>
                  </select>
                </label>
                {SHIPMENT_FIELDS.map((field) => (
                  <ShipmentField
                    key={field.name}
                    {...field}
                    value={shipment[field.name]}
                    disabled={!canEdit}
                    onChange={(event) =>
                      updateShipmentField(field.name, event.target.value)
                    }
                  />
                ))}
              </div>

              {order.shipment && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <div className="text-sm">
                    <span className="text-foreground-muted">Costo registrado: </span>
                    <strong className="text-foreground">
                      {formatCurrency(shipmentCost)}
                    </strong>
                  </div>
                  {order.shipment.shipment_url && (
                    <a
                      href={order.shipment.shipment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-hover"
                    >
                      Seguimiento
                      <RiExternalLinkLine size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
              {shipmentError && (
                <p role="alert" className="text-sm text-danger">
                  {shipmentError}
                </p>
              )}
              {shipmentMutation.isError && (
                <p role="alert" className="text-sm text-danger">
                  {shipmentMutation.error.message}
                </p>
              )}
              {canEdit && (
                <div className="flex justify-end border-t border-border pt-3">
                  <Button
                    type="submit"
                    size="small"
                    disabled={
                      shipmentMutation.isPending ||
                      !EDITABLE_SHIPMENT_FIELDS.some(
                        (field) =>
                          shipment[field] !== order.shipment?.[field],
                      )
                    }
                  >
                    {shipmentMutation.isPending ? "Guardando..." : "Guardar envío"}
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <p className="rounded-xl bg-surface-secondary p-4 text-sm text-foreground-muted">
              Esta orden no tiene datos de envío.
            </p>
          )}
        </section>
      </div>

      <p className="text-right text-xs text-foreground-muted">
        Última actualización: {formatDate(order.updatedAt)}
      </p>
    </div>
  );
}
