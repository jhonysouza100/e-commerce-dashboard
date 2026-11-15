"use client";

import { RiDeleteBin7Line } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsContext } from "./context/useProductsContext";
import { removeProductRequest } from "./hooks/useProductsRequests";
import Button from "@/ui/Button";
import AlertDialog from "@/ui/AlertDialog";

function DeleteProductButton({ id, className }: { id: number | number[], className?: string }) {
  const { setSelectedRows } = useProductsContext();
  const queryClient = useQueryClient();
  const productIds = Array.isArray(id) ? id : [id];
  const itemLabel = productIds.length === 1 ? "ítem seleccionado" : "ítems seleccionados";

  const deleteProductsMutation = useMutation({
    mutationFn: removeProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  const handleDelete = async () => {
    deleteProductsMutation.mutate(productIds);
    setSelectedRows(productIds);
  };

  return (
    <AlertDialog isAwait={true}
      title={`¿Eliminar ${itemLabel}?`}
      message={`Vas a eliminar permanentemente ${productIds.length === 1 ? "el ítem seleccionado" : "los ítems seleccionados"}. Esta acción no se puede deshacer.`}
      cancelButtonProps={{ children: "Cancelar", variant: "transparent", disabled: deleteProductsMutation.isPending }}
      confirmButtonProps={{
        children: deleteProductsMutation.isPending ? "Eliminando..." : `Eliminar ${productIds.length > 1 ? "ítems" : "ítem"}`,
        disabled: deleteProductsMutation.isPending,
        variant: "danger"
      }}
    >
      <Button
        onClick={handleDelete}
        icon={<RiDeleteBin7Line size={18} />}
        size="small"
        variant="transparent"
        className={className}
        title="Eliminar item"
      />
    </AlertDialog>
  );
}

export default DeleteProductButton;