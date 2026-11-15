"use client";

import { RiEditLine } from "@remixicon/react";
import { toast } from "sonner";
import Button from "@/ui/Button";

function EditProductsButton({ id, className }: { id: number | number[], className?: string }) {
  const productIds = Array.isArray(id) ? id : [id];
  const itemLabel = productIds.length === 1 ? "ítem seleccionado" : "ítems seleccionados";

  const handleEdit = () => {
    toast.info(`La edición masiva de ${itemLabel} es una característica en desarrollo.`);
  };

  return (
    <Button
      onClick={handleEdit}
      icon={<RiEditLine size={18} />}
      size="small"
      variant="transparent"
      className={className}
      title={`Editar ${productIds.length > 1 ? "ítems" : "ítem"}`}
    />
  );
}

export default EditProductsButton;
