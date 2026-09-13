import { create } from 'zustand';
import { CreateProductDto, ProductImageInterface } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductMediaFile } from "../interface/product.interface";

interface ProductsContextState {
  count: number;
  setCount: (count: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  product: CreateProductDto | null;
  setProduct: (product: CreateProductDto | null) => void;
  updateProduct: (updates: UpdateProductDto) => void;
  gallery: ProductMediaFile[];
  image?: ProductMediaFile;
  addGalleryImages: (images: Array<ProductMediaFile & { productImage: ProductImageInterface }>) => void;
  removeFileImage: (secureUrl: string) => void;
  setMainImage: (image: ProductMediaFile) => void;
  clearMedia: () => void;
  selectedRows: number[]; // IDs de las filas seleccionados
  setSelectedRows: (rowId: number[]) => void; // Función para actualizar los IDs seleccionados
}

export const useProductsContext = create<ProductsContextState>((set, get) => ({
  count: 0,
  setCount: (count: number) => {
    set(() => ({ count: count }));
  },
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    set(() => ({ isLoading: isLoading }));
  },
  product: null,
  setProduct: (product: CreateProductDto | null) => set({ product }),
  updateProduct: (updates: UpdateProductDto) => {
    const current = get().product
    if (!current) return
    set({ product: { ...current, ...updates } })
  },
  gallery: [],
  image: undefined,
  addGalleryImages: (images) => {
    const currentGallery = get().gallery;
    const uploadedFileNames = new Set(currentGallery.map((file) => file.data.name));
    const newImages = images.filter(({ data }) => {
      if (uploadedFileNames.has(data.name)) return false;
      uploadedFileNames.add(data.name);
      return true;
    });
    if (!newImages.length) return;

    const currentProduct = get().product;
    set({
      gallery: [...currentGallery, ...newImages],
      product: currentProduct
        ? {
            ...currentProduct,
            gallery: [...(currentProduct.gallery ?? []), ...newImages.map(({ productImage }) => productImage)],
          }
        : currentProduct,
    });
  },
  setMainImage: (image) => {
    const currentProduct = get().product;
    set({
      image,
      product: currentProduct
        ? {
            ...currentProduct,
            image: { public_id: "temp_id", secure_url: image.tempUrl },
          }
        : currentProduct,
    });
  },
  removeFileImage: (secureUrl: string) => {
    const currentGallery = get().gallery;
    const currentImage = get().image;
    const currentProduct = get().product;
    set({
      gallery: currentGallery.filter((el) => el.tempUrl !== secureUrl),
      image: currentImage?.tempUrl === secureUrl ? undefined : currentImage,
      product: currentProduct
        ? {
            ...currentProduct,
            image: currentProduct.image?.secure_url === secureUrl ? undefined : currentProduct.image,
            gallery: currentProduct.gallery?.filter((el) => el.secure_url !== secureUrl),
          }
        : currentProduct,
    });
  },
  clearMedia: () => set({ gallery: [], image: undefined }),
  selectedRows: [], // Inicializamos el estado de filas seleccionadas
  setSelectedRows: (rowIds: number[]) => { // Función para actualizar los IDs seleccionados
    const updatedSelectedRows = rowIds.reduce((selectedRows, rowId) => {
      return selectedRows.includes(rowId)
        ? selectedRows.filter((id) => id !== rowId)
        : [...selectedRows, rowId];
    }, get().selectedRows);

    set({ selectedRows: updatedSelectedRows });
  },
}));