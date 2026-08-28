import React, { useRef } from "react";
import { RiAddCircleFill } from "@remixicon/react";
import { useProductsContext } from "./context/useProductsContext";

function ImageUploadDropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { product, updateProduct, addFile } = useProductsContext();

  const handleFilesUpload = (files: FileList) => {
    // Por cada archivo, generamos una URL temporal y lo añadimos al contexto
    const newImages = Array.from(files).map((file) => {
      // Generamos URLs temporales para previsualización
      const tempUrl = URL.createObjectURL(file);

      // Actualizamos el estado de archivos en el contexto
      addFile(file, tempUrl);
      return {
        public_id: "temp_id", // ID temporal para la vista previa
        secure_url: tempUrl, // URL temporal
      }
    });

    // Actualizamos las imágenes del producto en para frontend
    // (esto no se guardará en la base de datos, solo es para previsualización)
    updateProduct({
      images: product?.images ? [...product.images, ...newImages] : newImages,
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    handleFilesUpload(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={triggerFileInput}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="drag_drop_container text-center border-2 px-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center aspect-square h-28 sm:h-32 cursor-pointer hover:bg-blue-300/50"
    >
      <RiAddCircleFill className="w-8 h-8 mb-2 text-primary" />
      <p className="text-xs">Arrastra tus imágenes aquí, o</p>
      <p className="text-sm text-primary font-medium">click para explorar</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadDropzone;