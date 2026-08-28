import EditProductForm from "@/components/product/EditProductForm";
import SaveProductButton from "@/components/product/SaveProductButton";

// Next.js ya maneja los parámetros de la URL y los inyecta en las props
async function GetSingleProductPage({ params, }: { params: Promise<{ id: string }>; }) {
  const id = parseInt((await params).id); // Convertir a número si es necesario

  return (
    <div className="main_container flex justify-center items-center rounded-xl">
      <div className="section_container w-full shadow-md rounded-xl overflow-hidden min-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_5rem))]">
        <section className="header_container gap-4 h-max flex justify-end sm:justify-between items-center bg-transparent-md px-4 py-2">
          {/* Action Buttons */}
          <SaveProductButton id={id} />
        </section>
        <section className="table_container w-[95%] py-3 mx-auto rounded-md max-h-[calc(100vh_-_(var(--header-height)_+_8.75rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_11.5rem))] [overflow:auto_overlay]">
          <EditProductForm id={id} />
        </section>
      </div>
    </div>
  );
}

export default GetSingleProductPage;
