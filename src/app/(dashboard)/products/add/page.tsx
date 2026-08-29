import CreateProductButton from "@/components/product/CreateProductButton";
import EditProductForm from "@/components/product/EditProductForm";
import MainContainer from "@/components/dashboard_layout/MainContainer";

async function CreateProductPage() {

  return (
    <>
      <MainContainer
        headerContent={<CreateProductButton />}
        mainContent={<EditProductForm />}
      />
    </>
  );
}

export default CreateProductPage;