"use client";

import { RiArrowGoBackFill, RiCheckLine, RiCloseLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useProductsContext } from "./context/useProductsContext";
import { CreateProductDto } from "./dtos/create-product.dto";
import { createProductRequest } from "./hooks/useProductsRequests";
import { EMPTY_INITIAL_PRODUCT } from "./interface/product.interface";
import Button from "../ui/Button";
import AlertDialog from "../ui/AlertDialog";

function CreateProductButton() {
  const { product: data, setProduct, files, clearFiles } = useProductsContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({ product, files }: { product: CreateProductDto, files: { data: File, tempUrl: string }[] }) => {
      return createProductRequest(product, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidar la consulta de productos
      clearFiles(); // Limpiar archivos después de la actualización
      router.back();
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  // Comparamos si hay cambios en el producto (retorna true o false)
  const hasChanges = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(EMPTY_INITIAL_PRODUCT);
  }, [data]);

  function saveProduct() {
    if (data) {
      updateProductMutation.mutate({
        product: {
          ...data,
          images: data?.images?.map((image) => ({
            public_id: image.public_id,
            secure_url: image.secure_url,
          })),
        },
        files
      });
    } else {
      console.error("Product is null and cannot be updated.");
    }
  }

  function cancelChanges() {
    setProduct(EMPTY_INITIAL_PRODUCT)
    clearFiles();
  }

  return (
    <div className="w-full flex justify-between gap-4">
      <Button
        onClick={() => {
          clearFiles(); // Limpiar archivos después de la actualización
          router.back()
        }}
        icon={<RiArrowGoBackFill size={18} />}
        size="small"
        variant="transparent"
      />
      <div className="space-x-3">
        <AlertDialog
          title="Confirmar la creación del nuevo ítem?"
          message="El ítem se guardará con los datos ingresados."
          confirmButtonProps={{
            children: updateProductMutation.isPending ? "Creando..." : "Crear",
            disabled: updateProductMutation.isPending,
            variant: "primary"
          }}
          cancelButtonProps={{ children: "Volver" }}
        >
          <Button
            onClick={saveProduct}
            disabled={!hasChanges}
            icon={<RiCheckLine size={18} />}
            size="small"
            title="Guardar item"
          />
        </AlertDialog>
        <AlertDialog
          title="Descartar nuevo ítem?"
          message="Perderás todos los datos que ingresaste en el formulario."
          confirmButtonProps={{
            children: updateProductMutation.isPending ? "Descartando..." : "Descartar",
            disabled: updateProductMutation.isPending,
          }}
          cancelButtonProps={{ children: "Volver" }}
        >
          <Button
            onClick={cancelChanges}
            disabled={!hasChanges}
            icon={<RiCloseLine size={18} />}
            size="small"
            variant="danger"
            title="Descartar cambios"
          />
        </AlertDialog>
      </div>
    </div>
  );
}

export default CreateProductButton;