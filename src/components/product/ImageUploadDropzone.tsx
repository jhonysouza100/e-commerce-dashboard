import React, { useRef } from "react";
import { RiAddCircleFill } from "@remixicon/react";
import { useProductsContext } from "./context/useProductsContext";

type ImageUploadDropzoneSize = "small" | "normal" | "large";

const sizeStyles: Record<ImageUploadDropzoneSize, { icon: number; text: string; subtext: string }> = {
  small: { icon: 18, text: "text-[0.5rem]", subtext: "text-[0.65rem]" },
  normal: { icon: 24, text: "text-xs", subtext: "text-sm" },
  large: { icon: 32, text: "text-sm", subtext: "text-base" },
};

function ImageUploadDropzone({
  isMultiple = true,
  size = "normal",
}: {
  isMultiple?: boolean;
  size?: ImageUploadDropzoneSize;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addGalleryImages, setMainImage } = useProductsContext();
  const { icon, text, subtext } = sizeStyles[size];

  const handleFilesUpload = (files: FileList) => {
    const filesToUpload = isMultiple ? Array.from(files) : Array.from(files).slice(0, 1);
    if (!filesToUpload.length) return;

    if (!isMultiple) {
      const file = filesToUpload[0];
      const tempUrl = URL.createObjectURL(file);

      setMainImage({ data: file, tempUrl });
      return;
    }

    const newImages = filesToUpload.map((file) => {
        const tempUrl = URL.createObjectURL(file);

        return {
          data: file,
          tempUrl,
          productImage: {
          public_id: "temp_id",
          secure_url: tempUrl,
          },
        };
      });

    addGalleryImages(newImages);
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
      className="drag_drop_container text-center border-2 p-2 gap-2 border-dashed border-foreground-muted/50 rounded flex flex-col items-center justify-center aspect-square w-full h-full cursor-pointer hover:bg-blue-300/50"
    >
      <RiAddCircleFill className={`${size === "small" ? "hidden" : ""}`} size={icon} />
      <div>
        <p className={text}>Arrastra tu(s) imágen(es) aquí, o</p>
        <p className={`${subtext} text-primary font-medium`}>click para explorar</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        multiple={isMultiple}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadDropzone;