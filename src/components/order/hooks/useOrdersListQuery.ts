"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import type { OrdersPagination } from "../interface/order.interface";
import { listOrdersRequest } from "./useOrdersRequests";
import { getOrdersQuery } from "../utils/orderQuery";

const EMPTY_COUNT: OrdersPagination = {
  page: 1,
  limit: 6,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function useOrdersListQuery() {
  const searchParams = useSearchParams();
  const { session } = useAuthContext();
  const query = getOrdersQuery(searchParams);
  const listQuery = useQuery({
    queryKey: ["orders", query],
    queryFn: () => listOrdersRequest(query),
    enabled: Boolean(session),
  });

  return {
    count: listQuery.data?.count ?? EMPTY_COUNT,
    listQuery,
    searchParams,
  };
}
