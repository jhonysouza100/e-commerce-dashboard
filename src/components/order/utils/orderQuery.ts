import { ORDER_STATUSES, type ListOrdersQuery } from "../interface/order.interface";

export function getOrdersQuery(searchParams: Pick<URLSearchParams, "get">): ListOrdersQuery {
  const requestedPage = Number(searchParams.get("page"));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const orderIdValue = Number(searchParams.get("order_id"));
  const order_id =
    Number.isSafeInteger(orderIdValue) && orderIdValue > 0
      ? orderIdValue
      : undefined;
  const minPriceValue = searchParams.get("min_price");
  const maxPriceValue = searchParams.get("max_price");
  const minPrice = minPriceValue ? Number(minPriceValue) : undefined;
  const maxPrice = maxPriceValue ? Number(maxPriceValue) : undefined;
  const statusValue = searchParams.get("status");
  const status = ORDER_STATUSES.find((value) => value === statusValue);

  return {
    page,
    limit: 6,
    order_id,
    status,
    min_price:
      minPrice !== undefined && Number.isFinite(minPrice) && minPrice >= 0
        ? minPrice
        : undefined,
    max_price:
      maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice >= 0
        ? maxPrice
        : undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };
}