import { useProductsContext } from "./context/useProductsContext";
import { CategorySpecsEnum } from "./enums/category-specs.enum";

function EditProductCategoryFields() {
  const { product, updateProduct } = useProductsContext();
  
    // Función para actualizar o agregar la especificación de la categoría (ej.: Smartphones, Gaming, etc.)
    const handleCategorySpecChange = (label: string, value: string) => {
      if (!product) return;
      const specIndex = product.specifications?.findIndex(spec => spec.label === label);
      let updatedSpecifications = product.specifications ? [...product.specifications] : [];
  
      if (specIndex !== undefined && specIndex > -1) {
        updatedSpecifications[specIndex] = { label, value };
      } else {
        updatedSpecifications = [...updatedSpecifications, { label, value }];
      }
  
      updateProduct({ specifications: updatedSpecifications });
    };
  
    // Obtiene el prefijo basado en la categoría, por ejemplo, "SMARTPHONES" o "GAMES"
    const categoryPrefix = product?.category?.toUpperCase();
    // Filtra las especificaciones del enum que pertenezcan a la categoría actual
    const categoryFields = categoryPrefix
      ? Object.entries(CategorySpecsEnum)
          .filter(([key]) => key.startsWith(`${categoryPrefix}_`))
          .map(([, value]) => value)
      : null;

  return (
    <>
      {categoryFields && (
        <div>
          {categoryFields.length > 0 && <h3 className="mb-2 font-medium">Especificaciones para {product?.name}</h3>}
          {categoryFields.map((field) => {
            const spec = product?.specifications?.find(spec => spec.label === field);
            return (
              <div key={field} className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <label className="block text-sm text-foreground-muted">{field}</label>
                  <input
                    type="text"
                    value={spec ? spec.value : ""}
                    onChange={(e) => handleCategorySpecChange(field, e.target.value)}
                    placeholder={`Ingrese ${field.toLowerCase()}`}
                    className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default EditProductCategoryFields;