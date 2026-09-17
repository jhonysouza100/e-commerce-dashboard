export const ORDER_STATUSES = [
  "PENDIENTE",
  "APROBADO",
  "ACREDITADO",
  "COMPLETADO",
  "CANCELADO",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  item_id: number;
  name: string;
  quantity: number;
  price: number | string;
  discount?: number | string;
  subtotal: number | string;
  image_url?: string;
}

export interface OrderPayment {
  method?: string;
  preference_id?: string;
  payment_url?: string;
  payment_id?: string;
  status?: string;
  status_detail?: string;
}

export interface OrderShipment {
  deliveredType?: "D" | "S" | string;
  pickupLocation?: string;
  fullName?: string;
  dni?: string;
  phone?: string;
  email?: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  provinceName?: string;
  provinceCode?: string;
  postalCodeDestination?: string;
  deliveryStatus?: string;
  shipment_url?: string;
  shipment_cost?: number | string;
  dimensions?: unknown;
}

export interface Order {
  id: number;
  user_id?: number;
  tenant_id: number;
  status: OrderStatus;
  subtotal: number | string;
  total: number | string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  payment?: OrderPayment;
  shipment?: OrderShipment;
}

export interface OrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OrdersResponse {
  data: Order[];
  count: OrdersPagination;
}

export interface ListOrdersQuery {
  page?: number;
  limit?: number;
  order_id?: number;
  status?: OrderStatus;
  min_price?: number;
  max_price?: number;
  from?: string;
  to?: string;
}

export interface UpdateShipmentDto {
  deliveredType?: string;
  pickupLocation?: string;
  fullName?: string;
  dni?: string;
  phone?: string;
  email?: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  provinceName?: string;
  provinceCode?: string;
  postalCodeDestination?: string;
}

export interface UpdatePaymentDto {
  method?: string;
}
