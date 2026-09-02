import CreateProductHeader from "@/components/product/CreateProductHeader";
import EditProductForm from "@/components/product/EditProductForm";
import MainContainer from "@/components/dashboard_layout/MainContainer";

async function CreateProductPage() {

  return (
    <>
      <MainContainer
        headerContent={<CreateProductHeader />}
        mainContent={<EditProductForm />}
      />
    </>
  );
}

export default CreateProductPage;