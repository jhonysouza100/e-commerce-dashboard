import axios from "axios";
import { BACKEND_URL, SESSION_COOKIE } from "@/const/constants";
import { getSessionCookie } from "@/utils/handleCookies";
import type { ErrorResponse } from "@/utils/handleAxiosResponses";
import type {
  ListOrdersQuery,
  Order,
  OrdersResponse,
  UpdatePaymentDto,
  UpdateShipmentDto,
  OrderStatus,
} from "../interface/order.interface";

const ordersRequest = axios.create({
  baseURL: `${BACKEND_URL}/orders`,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

ordersRequest.interceptors.request.use(async (config) => {
  const token = await getSessionCookie(SESSION_COOKIE);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function getRequestError(error: unknown, fallback: string): Error {
  const requestError = error as ErrorResponse;
  return new Error(requestError.response?.data.message || requestError.message || fallback);
}

export async function listOrdersRequest(query: ListOrdersQuery): Promise<OrdersResponse> {
  try {
    const response = await ordersRequest.get<OrdersResponse>("", { params: query });
    return response.data;
  } catch (error) {
    throw getRequestError(error, "No se pudieron obtener las órdenes");
  }
}

export async function getOrderRequest(id: number): Promise<Order> {
  try {
    const response = await ordersRequest.get<OrdersResponse>("", { params: { order_id: id } });
    const order = response.data.data.at(0);
    if (!order) throw new Error("No se encontró la orden solicitada");
    return order;
  } catch (error) {
    throw getRequestError(error, "No se pudo obtener la orden");
  }
}

async function patchOrder<T>(path: string, payload: T): Promise<Order> {
  try {
    const response = await ordersRequest.patch<Order | { data: Order }>(path, payload);
    return "data" in response.data ? response.data.data : response.data;
  } catch (error) {
    throw getRequestError(error, "No se pudo actualizar la orden");
  }
}

export function updateOrderStatusRequest(id: number, status: OrderStatus): Promise<Order> {
  return patchOrder(`/${id}/status`, { status });
}

export function updateOrderShipmentRequest(id: number, payload: UpdateShipmentDto): Promise<Order> {
  return patchOrder(`/${id}/shipment`, payload);
}

export function updateOrderPaymentRequest(id: number, payload: UpdatePaymentDto): Promise<Order> {
  return patchOrder(`/${id}/payment`, payload);
}
