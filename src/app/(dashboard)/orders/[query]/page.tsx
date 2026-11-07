"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiArrowLeftLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import MainContainer from "@/components/dashboard_layout/MainContainer";
import OrderDetail from "@/components/order/OrderDetail";
import { getOrderRequest } from "@/components/order/hooks/useOrdersRequests";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import Message from "@/ui/Message";
import Button from "@/ui/Button";
import Loading from "@/ui/Loading";
import handleGoBackRoute from "@/utils/handleGoBaackRoute";

export default function OrderPage({
	params,
}: {
	params: Promise<{ query: string }>;
}) {
	const { query } = use(params);
	const router = useRouter();
	const { session } = useAuthContext();
	const orderId = Number(query);
	const orderQuery = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrderRequest(orderId),
		enabled: Boolean(session) && Number.isInteger(orderId) && orderId > 0,
	});
	const canEdit = session?.role === "ADMIN" || session?.role === "ROOT";

	let content: React.ReactNode = <Loading message="orden..." />;
	if (!Number.isInteger(orderId) || orderId <= 0) {
		content = <Message message="La orden solicitada no es válida" variant="danger" />;
	} else if (orderQuery.isError) {
		content = <Message message={orderQuery.error.message} variant="danger" />;
	} else if (orderQuery.data) {
		content = (
			<OrderDetail
				key={orderQuery.data.updatedAt}
				order={orderQuery.data}
				canEdit={canEdit}
			/>
		);
	}

	return (
		<MainContainer
			headerContent={
				<Button
					type="button"
					onClick={() => handleGoBackRoute(router, "/orders")}
					aria-label="Volver a las órdenes"
					title="Volver a las órdenes"
					icon={<RiArrowLeftLine size={18} />}
					size="small"
					variant="secondary"
				/>
			}
			mainContent={content}
		/>
	);
}
