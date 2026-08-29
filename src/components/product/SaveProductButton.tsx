"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RiArrowGoBackFill, RiCheckLine, RiCloseLine } from "@remixicon/react";
import { useEffect, useMemo } from "react";
import Button from "@/ui/Button";
import { useProductsContext } from "./context/useProductsContext";
import { Product } from "./interface/product.interface";
import { getProductRequest, updateProductRequest } from "./hooks/useProductsRequests";
import { UpdateProductDto } from "./dtos/update-product.dto";
import AlertDialog from "../ui/AlertDialog";

function SaveProductButton({ id }: { id: number }) {
  const { product, setProduct, files, clearFiles } = useProductsContext();

  const router = useRouter();

  const queryClient = useQueryClient();

  // Consulta de producto via useQuery, para ternerlo memorizado en un estado inicial
  const {data, isLoading} = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductRequest(id),
  });

  // Calculamos el producto inicial (sin campos que no se actualicen)
  const initialProduct = useMemo(() => {
    if (data) {
      // Excluir id, tenant_id, createdAt, modifiedAt
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, tenant_id, createdAt, modifiedAt, ...filteredData } = data;
      return filteredData;
    }
    return null;
  }, [data]);

  // Si tenemos un estado inicial y NO hay un producto definido, inicializamos el store
  useEffect(() => {
    if (initialProduct && !product) {
      setProduct(initialProduct);
    }
  }, [initialProduct, product, setProduct]);

  // Comparamos si hay cambios en el producto (retorna true o false)
  const hasChanges = useMemo(() => {
    if (product && initialProduct) {
      return JSON.stringify(product) !== JSON.stringify(initialProduct);
    }
    return false;
  }, [product, initialProduct]);

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product, files }: { id: number; product: UpdateProductDto, files: {data: File, tempUrl: string}[] }) =>
      updateProductRequest(id, product, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidar la consulta de productos
      queryClient.invalidateQueries({ queryKey: ["products", id] }); // Invalidar la consulta del producto específico
      clearFiles(); // Limpiar archivos después de la actualización
      router.back();
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  function saveProduct() {
    if (product && hasChanges) {
      updateProductMutation.mutate({
        id,
        product: {
          ...product,
          images: product?.images?.map((image) => ({
            public_id: image.public_id,
            secure_url: image.secure_url,
          })),
        },
        files,
      });
    } else {
      console.error("Product is null and cannot be updated.");
    }
  }

  function cancelChanges() {
    if (initialProduct) {
      setProduct(initialProduct);
      clearFiles();
    }
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
          title="Estás seguro de guardar los cambios?"
          message="Esta acción es permanente y no se podrá deshacer."
          confirmButtonProps={{
            children: updateProductMutation.isPending ? "Guardando..." : "Guardar",
            disabled: updateProductMutation.isPending,
            variant: "primary"
          }}
          cancelButtonProps={{ children: "Volver" }}
        >
          <Button
            onClick={saveProduct}
            disabled={!product || !hasChanges || isLoading}
            icon={<RiCheckLine size={18} />}
            size="small"
            title="Guardar cambios"
          />
        </AlertDialog>  
         <AlertDialog
          title="Descartar cambios sin guardar?"
          message="Si salís ahora, perderás todas las modificaciones realizadas."
          confirmButtonProps={{
            children: updateProductMutation.isPending ? "Descartando..." : "Descartar",
            disabled: updateProductMutation.isPending,
          }}
          cancelButtonProps={{ children: "Volver" }}
        >
          <Button
            onClick={cancelChanges}
            disabled={isLoading || !hasChanges}
            icon={<RiCloseLine size={18} />}
            size="small"
            title="Descartar cambios"
            variant="danger"
          />
        </AlertDialog>
      </div>
    </div>
  );
}

export default SaveProductButton;