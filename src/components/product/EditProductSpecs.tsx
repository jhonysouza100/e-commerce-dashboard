import { RiAddLine, RiDeleteBin6Line, RiInformationLine } from "@remixicon/react";
import EditProductCategoryFields from "./EditProductCategoryFields";
import { useProductsContext } from "./context/useProductsContext";

function EditProductSpecs() {
  const { product, updateProduct } = useProductsContext();

  // Función para manejar la adición de especificaciones personalizadas
  const handleAddSpec = () => {
    if (!product) return;
    const currentSpecifications = product.specifications || [];
    updateProduct({
      specifications: [...currentSpecifications, { label: "", value: "" }],
    });
  };

  const handleSpecChange = (index: number, field: "label" | "value", value: string) => {
    if (!product || !product.specifications) return;
    const updatedSpecifications = [...product.specifications];
    updatedSpecifications[index] = { ...updatedSpecifications[index], [field]: value };
    updateProduct({ specifications: updatedSpecifications });
  };

  const handleRemoveSpec = (index: number) => {
    if (!product || !product.specifications) return;
    const updatedSpecifications = product.specifications.filter((_, i) => i !== index);
    updateProduct({ specifications: updatedSpecifications });
  };

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="font-medium text-xs text-foreground-muted">Especificaciones</label>
          <span title="Agrega característica extras">
            <RiInformationLine size={16} />
          </span>
          <span className="text-xs">
            (opcional)
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddSpec}
          className="flex items-center gap-1 text-sm hover:text-foreground"
        >
          <RiAddLine className="w-4 h-4" />
          Agregar característica
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          {product?.specifications && product.specifications.length > 0 ? (
            product.specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                    placeholder="Característica"
                    className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    placeholder="Valor"
                    className="w-full rounded-md border border-border bg-input p-2 text-sm shadow-sm transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <RiDeleteBin6Line className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 border border-dashed border-gray-300 rounded">
              <p className="text-sm text-foreground-muted">
                {`No hay especificaciones. Haga clic en "Agregar especificación" para añadir una.`}
              </p>
            </div>
          )}
        </div>

        {/* Renderización condicional de campos según la categoría */}
        <EditProductCategoryFields />
      </div>
    </div>
  );
}

export default EditProductSpecs;