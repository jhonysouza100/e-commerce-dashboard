"use client";

import { RiFileCopyLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsContext } from "./context/useProductsContext";
import { duplicateProductsRequest } from "./hooks/useProductsRequests";
import Button from "@/ui/Button";
import AlertDialog from "@/ui/AlertDialog";

function DuplicateProductsButton({ id }: { id: number | number[] }) {
  const { setSelectedRows } = useProductsContext();
  const queryClient = useQueryClient();
  const productIds = Array.isArray(id) ? id : [id];
  const itemLabel = productIds.length === 1 ? "ítem seleccionado" : "ítems seleccionados";

  const duplicateProductsMutation = useMutation({
    mutationFn: duplicateProductsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  })

  const handleDuplicate = async () => {
    duplicateProductsMutation.mutate(productIds);
    setSelectedRows(productIds);
  }

  return (
    <AlertDialog isAwait={true}
      title={`¿Duplicar ${itemLabel}?`}
      message={`Se ${productIds.length === 1 ? "creará una copia independiente del ítem seleccionado" : "crearán copias independientes de los ítems seleccionados"}. Esta acción no se puede deshacer.`}
      cancelButtonProps={{ children: "Cancelar", variant: "transparent", disabled: duplicateProductsMutation.isPending }}
      confirmButtonProps={{
        children: duplicateProductsMutation.isPending ? "Duplicando..." : `Duplicar ${productIds.length > 1 ? "ítems" : "ítem"}`,
        disabled: duplicateProductsMutation.isPending,
        variant: "primary"
      }}
    >
      <Button
        onClick={handleDuplicate}
        icon={<RiFileCopyLine size={18} />}
        size="small"
        variant="transparent"
        title="Duplicar item"
      />
    </AlertDialog>
  );
}

export default DuplicateProductsButton;