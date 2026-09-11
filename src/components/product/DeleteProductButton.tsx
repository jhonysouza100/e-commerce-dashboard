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

  const { mutateAsync: deleteProductsMutation, isPending } = useMutation({
    mutationFn: removeProductRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleDelete = async () => {
    deleteProductsMutation(Array.isArray(id) ? id : [id]);
    setSelectedRows(Array.isArray(id) ? id : [id]);
  };

  return (
    <AlertDialog isAwait={true}
      title="Eliminar item"
      message="Vas a eliminar el item premanentemente."
      cancelButtonProps={{ children: "Volver", disabled: isPending }}
      confirmButtonProps={{
        children: isPending ? "Eliminando..." : "Eliminar",
        disabled: isPending,
        variant: "danger"
      }}
    >
      <Button
        onClick={handleDelete}
        icon={<RiDeleteBin7Line size={18} />}
        size="small"
        variant="transparent"
        title="Eliminar item"
      />
    </AlertDialog>
  );
}

export default DeleteProductButton;