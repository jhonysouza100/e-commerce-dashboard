import MainContainer from "@/components/dashboard_layout/MainContainer";
import ListOrders from "@/components/order/ListOrders";
import OrdersHeader from "@/components/order/OrdersHeader";

export default function OrdersPage() {
	return (
		<MainContainer
			headerContent={<OrdersHeader />}
			mainContent={<ListOrders />}
		/>
	);
}
