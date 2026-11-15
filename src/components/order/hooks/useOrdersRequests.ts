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

/**
 * Converts an unknown request error into a consistent application error.
 *
 * @param error Error returned by the request.
 * @param fallback Message used when the request does not provide one.
 * @returns A normalized error instance.
 */
function getRequestError(error: unknown, fallback: string): Error {
  const requestError = error as ErrorResponse;
  return new Error(requestError.response?.data.message || requestError.message || fallback);
}

/**
 * Retrieves orders matching the supplied filters and pagination settings.
 *
 * @param query Filters and pagination options for the order list.
 * @returns The orders and pagination metadata returned by the API.
 * @throws An error when the request fails.
 */
export async function listOrdersRequest(query: ListOrdersQuery): Promise<OrdersResponse> {
  try {
    const response = await ordersRequest.get<OrdersResponse>("", { params: query });
    return response.data;
  } catch (error) {
    throw getRequestError(error, "No se pudieron obtener las órdenes");
  }
}

/**
 * Retrieves an order by its identifier.
 *
 * @param id Identifier of the order to retrieve.
 * @returns The requested order.
 * @throws An error when the request fails or the order is not found.
 */
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

/**
 * Updates an order using the specified endpoint and payload.
 *
 * @param path Endpoint path used to update the order.
 * @param payload Data sent to the update endpoint.
 * @returns The updated order.
 * @throws An error when the request fails.
 */
async function patchOrder<T>(path: string, payload: T): Promise<Order> {
  try {
    const response = await ordersRequest.patch<Order | { data: Order }>(path, payload);
    return "data" in response.data ? response.data.data : response.data;
  } catch (error) {
    throw getRequestError(error, "No se pudo actualizar la orden");
  }
}

/**
 * Updates the status of an order.
 *
 * @param id Identifier of the order to update.
 * @param status New status assigned to the order.
 * @returns The updated order.
 */
export function updateOrderStatusRequest(id: number, status: OrderStatus): Promise<Order> {
  return patchOrder(`/${id}/status`, { status });
}

/**
 * Updates the shipment information of an order.
 *
 * @param id Identifier of the order to update.
 * @param payload Shipment data to apply.
 * @returns The updated order.
 */
export function updateOrderShipmentRequest(id: number, payload: UpdateShipmentDto): Promise<Order> {
  return patchOrder(`/${id}/shipment`, payload);
}

/**
 * Updates the payment information of an order.
 *
 * @param id Identifier of the order to update.
 * @param payload Payment data to apply.
 * @returns The updated order.
 */
export function updateOrderPaymentRequest(id: number, payload: UpdatePaymentDto): Promise<Order> {
  return patchOrder(`/${id}/payment`, payload);
}
