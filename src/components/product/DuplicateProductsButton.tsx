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

  const duplicateProductsMutation = useMutation({
    mutationFn: duplicateProductsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  })

  const handleDuplicate = async () => {
    duplicateProductsMutation.mutate(Array.isArray(id) ? id : [id]);
    setSelectedRows(Array.isArray(id) ? id : [id]);
  }

  return (
    <AlertDialog isAwait={true}
      title="Duplicar item"
      message="Vas a duplicar el item."
      cancelButtonProps={{ children: "Volver", variant: "transparent", disabled: duplicateProductsMutation.isPending }}
      confirmButtonProps={{
        children: duplicateProductsMutation.isPending ? "Duplicando..." : "Duplicar",
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