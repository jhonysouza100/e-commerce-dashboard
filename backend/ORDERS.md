# Módulo de órdenes

Guía de integración del contrato implementado por [OrdersController](./modules/orders/orders.controller.ts) y [OrdersService](./modules/orders/orders.service.ts).

## Base y acceso

La base de las rutas es `/api/v1/orders` (prefijo y versión configurados en [main.ts](./main.ts)).

| Ruta | Acceso | Uso |
|---|---|---|
| `GET /` | Bearer válido | Listar órdenes con filtros |
| `POST /` | Tenant | Crear orden; calcula envío si se envía `shipment` |
| `POST /free-shipping` | Tenant | Crear orden sin costo de envío |
| `PATCH /:id/status` | Bearer, rol `ADMIN` o `ROOT` | Cambiar estado |
| `PATCH /:id/shipment` | Bearer, rol `ADMIN` o `ROOT` | Actualizar datos de envío |
| `PATCH /:id/payment` | Bearer, rol `ADMIN` o `ROOT` | Actualizar método de pago |
| `POST /confirm/mercadopago` | Notificación del proveedor | Sincronizar pago, orden e inventario |

Las rutas de creación requieren `x-api-key` válido o un `Origin` asociado al dominio de la compañía. Las rutas administrativas usan `Authorization: Bearer <token>`; `ROOT` también pasa el control de rol `ADMIN`.

## Listar órdenes

`GET /api/v1/orders` devuelve `{ data: Order[], count }`. Las órdenes se ordenan por `createdAt` descendente. `count` contiene `page`, `limit`, `total`, `totalPages`, `hasNextPage` y `hasPreviousPage`. El valor efectivo por defecto de `limit` es **6** (aunque la descripción Swagger indique 20); el máximo es 100.

| Parámetro | Comportamiento |
|---|---|
| `order_id` | ID exacto, positivo |
| `status` | Estado exacto de la orden |
| `min_price`, `max_price` | Límites inclusivos sobre `total` |
| `from`, `to` | Fechas ISO 8601 para `createdAt`; si `to` es `YYYY-MM-DD`, incluye ese día completo |
| `page`, `limit` | Paginación; `page` inicia en 1 |

Los filtros de precio se rechazan con 400 si el mínimo supera el máximo. El controlador no ofrece un filtro `tenant_id`: el alcance de cuenta se deriva del token, con la salvedad de aislamiento indicada más abajo.

## Crear una orden

`POST /` y `POST /free-shipping` reciben JSON. `items` debe contener al menos un producto, aunque el campo sea opcional en el DTO. El cliente envía IDs y cantidades; el backend recupera producto, precio, descuento y nombre vigentes, y guarda una copia de esos datos en la orden.

```json
{
  "user_id": 42,
  "items": [
    { "item_id": 7, "quantity": 2 }
  ],
  "payment": { "method": "Mercadopago" },
  "shipment": {
    "deliveredType": "D",
    "fullName": "Nombre Apellido",
    "dni": "30123456",
    "phone": "+5493764123456",
    "email": "cliente@example.com",
    "postalCodeDestination": "1040",
    "streetName": "Av. Corrientes",
    "streetNumber": "1234",
    "city": "Buenos Aires",
    "provinceCode": "C"
  }
}
```

`user_id`, `payment` y `shipment` son opcionales. Si se envía `shipment`, `fullName`, `dni`, `phone` y `postalCodeDestination` son requeridos por el DTO. `deliveredType` acepta `D` (domicilio) o `S` (sucursal); `pickupLocation` puede identificar la sucursal. En la ruta normal, el envío se cotiza con Correo Argentino y se agrega a la preferencia de pago. `/free-shipping` fija `shipment_cost` en cero y no calcula dimensiones. Ambas rutas crean una preferencia de Mercado Pago.

Una orden guarda `tenant_id` desde el tenant resuelto (ID de compañía), `status: "PENDIENTE"`, `items`, `subtotal`, `total`, `payment` y, si corresponde, `shipment`. Cada item persistido contiene `item_id`, `name`, `quantity`, `price`, `discount`, `subtotal` unitario con descuento aplicado e `image_url`. `subtotal` de la orden suma `item.subtotal * quantity`. El costo de envío queda aparte en `shipment.shipment_cost`; no se agrega a `order.total`.

El backend guarda la orden antes de solicitar la preferencia al proveedor. Si esa solicitud falla, la orden puede quedar persistida sin `payment.preference_id` o `payment.payment_url`. El stock se valida al crear, pero se descuenta al confirmar el pago, no se reserva durante el checkout. `coupon` está admitido por el DTO, pero actualmente no se aplica.

La respuesta exitosa es la orden completa, no una envoltura paginada. `payment` puede incluir `method`, `preference_id` y `payment_url`; `shipment` puede incluir `deliveryStatus`, `shipment_cost` y `dimensions`.

## Actualizaciones administrativas

- `PATCH /:id/status`: `{ "status": "ACREDITADO" }`. Valores válidos: `PENDIENTE`, `APROBADO`, `ACREDITADO`, `COMPLETADO`, `CANCELADO`.
- `PATCH /:id/shipment`: recibe directamente campos parciales del envío (`deliveredType`, `pickupLocation`, destinatario y dirección). Se combinan con el objeto existente; el cambio puede disparar un correo al cliente si tiene email.
- `PATCH /:id/payment`: recibe `{ "method": "Efectivo" }`. El DTO permite actualizar solo `method`, no los campos de Mercado Pago.

Las tres rutas devuelven la orden actualizada. El cambio manual de estado no aplica reglas de transición ni modifica inventario; la integración de pago e inventario ocurre en el webhook. Los cambios de estado también notifican al cliente si hay un correo de envío disponible.

## Confirmación de Mercado Pago

`POST /confirm/mercadopago` recibe notificaciones con `action`, `data.id` y `user_id`. El servicio busca la compañía por su usuario de Mercado Pago, recupera el pago y localiza la orden mediante `external_reference`. Comprueba que la compañía coincida con `order.tenant_id`.

En `payment.created`, actualiza el pago, marca la orden `ACREDITADO`, descuenta stock, incrementa ventas e importa el envío si existe. En `payment.updated`, actualiza el estado de pago; si el detalle es pendiente o cancelado, también cambia el estado de la orden.

**Comportamiento a tener en cuenta:** para cada `payment.updated` recibido con una orden que tenga pago, el servicio llama a `restoreCancelledProduct` incluso cuando el detalle no representa una cancelación. No asumir que esta reposición es idempotente mientras no se corrija o se confirme esa lógica. La entidad y sus campos persistidos están en [order.entity.ts](./modules/orders/entities/order.entity.ts).

## Alcance de cuenta y cliente actual

Hay una discrepancia importante de IDs en el servicio: el checkout almacena `tenant_id` con el **ID de compañía**, pero el listado y los tres PATCH filtran `tenant_id` con el **ID de administrador** del token. Como son entidades distintas, si esos IDs no coinciden el administrador puede no encontrar sus órdenes; si coinciden accidentalmente, el filtro no identifica de forma fiable la compañía. Revisar este alcance antes de conectar la selección de compañía del frontend.

El cliente actual usa los mismos nombres de filtros y solicita una orden individual mediante `GET /?order_id={id}` (no existe `GET /:id`); esa respuesta sigue siendo paginada y el cliente toma el primer elemento. Sus contratos frontend están en [useOrdersRequests](../src/components/order/hooks/useOrdersRequests.ts) y [order.interface.ts](../src/components/order/interface/order.interface.ts).
