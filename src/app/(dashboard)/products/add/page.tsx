import CreateProductButton from "@/components/product/CreateProductButton";
import EditProductForm from "@/components/product/EditProductForm";

async function CreateProductPage() {

  return (
    <div className="main_container flex justify-center items-center rounded-xl">
      <div className="section_container w-full shadow-md rounded-xl overflow-hidden min-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_5rem))]">
        <section className="header_container gap-4 h-max flex justify-end sm:justify-between items-center bg-transparent-md px-4 py-2">
          {/* Action Buttons */}
          <CreateProductButton />
        </section>
        <section className="table_container py-3 px-4 rounded-md max-h-[calc(100vh_-_(var(--header-height)_+_8.75rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_11.5rem))] [overflow:auto_overlay]">
          <EditProductForm />
        </section>
      </div>
    </div>
  );
}

export default CreateProductPage;
