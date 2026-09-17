import MainContainer from "@/components/dashboard_layout/MainContainer";
import OrdersManager from "@/components/order/OrdersManager";

export default function OrdersPage() {
	return (
		<>
			<MainContainer 
				headerContent={<></>}
				mainContent={<OrdersManager />}
			/>
		</>
	)
}
