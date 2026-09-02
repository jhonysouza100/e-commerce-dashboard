"use client";

import { RiDeleteBin5Fill } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsContext } from "./context/useProductsContext";
import { removeProductRequest } from "./hooks/useProductsRequests";
import Button from "../ui/Button";
import AlertDialog from "../ui/AlertDialog";

function DeleteProductButton({ id, className }: { id: number | number[], className?: string }) {
  const { setSelectedRows } = useProductsContext();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteProductsMutation } = useMutation({
    mutationFn: removeProductRequest,
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleDelete = async () => {
    if (Array.isArray(id)) {
      // Si es un array, ejecuta la mutación para cada id
      await Promise.all(id.map((singleId) => {
        deleteProductsMutation(singleId)
        // Limpiar el estado de filas seleccionadas después de eliminar
        setSelectedRows(singleId);
      }));
    } else {
      // Si es un número, ejecuta la mutación directamente
      await deleteProductsMutation(id);
    }
    // Invalida las queries después de completar todas las mutaciones
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <AlertDialog
      message="Vas a eliminar el item premanentemente."
      cancelButtonProps={{ children: "Cancelar", variant: "secondary" }}
      confirmButtonProps={{
        children: "Eliminar",
        variant: "danger"
      }}
    >
      <Button
        onClick={handleDelete}
        icon={<RiDeleteBin5Fill size={18} />}
        size="small"
        variant="danger"
      />
    </AlertDialog>
  );
}

export default DeleteProductButton;
