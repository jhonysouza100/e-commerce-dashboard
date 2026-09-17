"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiArrowLeftLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import MainContainer from "@/components/dashboard_layout/MainContainer";
import OrderDetail from "@/components/order/OrderDetail";
import { getOrderRequest } from "@/components/order/hooks/useOrdersRequests";
import { useAuthContext } from "@/components/session/context/useAuthContext";
import Alert from "@/ui/Alert";
import Button from "@/ui/Button";
import Loading from "@/ui/Loading";

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
		content = <Alert message="La orden solicitada no es válida" />;
	} else if (orderQuery.isError) {
		content = <Alert message={orderQuery.error.message} />;
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
					onClick={() => router.back()}
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
