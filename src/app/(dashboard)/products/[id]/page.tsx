import SaveProductButton from "@/components/product/SaveProductHeader";
import EditProductForm from "@/components/product/EditProductForm";
import MainContainer from "@/components/dashboard_layout/MainContainer";

// Next.js ya maneja los parámetros de la URL y los inyecta en las props
async function GetSingleProductPage({ params, }: { params: Promise<{ id: string }>; }) {
  const id = parseInt((await params).id); // Convertir a número si es necesario

  return (
    <>
      <MainContainer
        headerContent={<SaveProductButton id={id} />}
        mainContent={<EditProductForm id={id} />}
      />
    </>
  );
}

export default GetSingleProductPage;
