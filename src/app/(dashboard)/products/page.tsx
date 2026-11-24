"use client";

import ListProductsTable from "@/components/product/ListProductsTable";
import MainContainer from "@/components/dashboard_layout/MainContainer";
import ListProductsHeader from "@/components/product/ListProductsHeader";
import EditSelectedProductsToolbar from "@/components/product/EditSelectedProductsToolbar";

function ListProductsPage() {
  return (
    <>
      <MainContainer
        headerContent={<ListProductsHeader />}
        mainContent={<ListProductsTable />}
      />
      <EditSelectedProductsToolbar />
    </>
  );
}

export default ListProductsPage;
