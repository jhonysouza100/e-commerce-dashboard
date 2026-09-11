"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AlertDialog from "@/ui/AlertDialog";
import { useProductsContext } from "./context/useProductsContext";
import { desactiveProductRequest } from "./hooks/useProductsRequests";

function DesactiveProductsButton({ id, status }: { id: number | number[], status: boolean }) {
  const { setSelectedRows } = useProductsContext();
  const queryClient = useQueryClient();

  const { mutateAsync: desactiveProductsMutation, isPending } = useMutation({
    mutationFn: desactiveProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleStatusChange = async () => {
    desactiveProductsMutation(Array.isArray(id) ? id : [id]);
    setSelectedRows(Array.isArray(id) ? id : [id]);
  };

  return (
    <AlertDialog
      title="Cambiar el estado de item"
      message="Estas seguro de cambiar el estado del item?"
      cancelButtonProps={{ children: "Volver", disabled: isPending }}
      confirmButtonProps={{
        children: isPending ? "Confirmando..." : "Confirmar",
        disabled: isPending,
        variant: "primary",
        onClick: handleStatusChange,
      }}
    >
      <div className="relative inline-flex">
        <input
          type="checkbox"
          id="status"
          readOnly
          checked={status ?? false}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-foreground-muted peer-focus:outline-none rounded-full relative peer-checked:[background:var(--gradient-color)] peer-checked:after:translate-x-5 after:transition-translate after:ease-in-out after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-4 after:aspect-square"></div>
      </div>
    </AlertDialog>
  )
}

export default DesactiveProductsButton;