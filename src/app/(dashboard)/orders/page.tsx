import MainContainer from "@/components/dashboard_layout/MainContainer";
import ListOrders from "@/components/order/ListOrders";
import OrdersFilters from "@/components/order/OrdersFilters";

export default function OrdersPage() {
	return (
		<>
			<MainContainer 
				headerContent={<><OrdersFilters /></>}
				mainContent={<ListOrders />}
			/>
		</>
	)
}
