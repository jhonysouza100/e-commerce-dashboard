import type { ListOrdersQuery } from "../interface/order.interface";

export function getOrdersQuery(searchParams: Pick<URLSearchParams, "get">): ListOrdersQuery {
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  return {
    page,
    limit: 6,
    order_id: searchParams.get("order_id") ? Number(searchParams.get("order_id")) : undefined,
    status: (searchParams.get("status") as ListOrdersQuery["status"]) || undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };
}