import { create } from 'zustand';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

interface ProductsContextState {
  count: number;
  setCount: (count: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  product: CreateProductDto | null;
  setProduct: (product: CreateProductDto | null) => void;
  updateProduct: (updates: UpdateProductDto) => void;
  files: {
    data: File;
    tempUrl: string; // URL temporal para comparar con el secure_url al momento de eliminar
  }[];
  addFile: (file: File, tempUrl: string) => void;
  removeFile: (secureUrl: string) => void;
  clearFiles: () => void;
  selectedRows: number[]; // IDs de las filas seleccionados
  setSelectedRows: (rowId: number) => void; // Función para actualizar los IDs seleccionados
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
  files: [],
  addFile: (newFile: File, tempUrl: string) => {
    const currentFiles = get().files;
    const fileExists = currentFiles.some((file) => file.data.name === newFile.name);
    if (!fileExists) {
      set({ files: [...currentFiles, { data: newFile, tempUrl }] });
    } else {
      set({ files: currentFiles });
    }
  },
  removeFile: (secureUrl: string) => {
    const currentFiles = get().files;
    const updatedFiles = currentFiles.filter((file) => file.tempUrl !== secureUrl);
    set({ files: updatedFiles });
  },
  clearFiles: () => set({ files: [] }),
  selectedRows: [], // Inicializamos el estado de filas seleccionadas
  setSelectedRows: (rowId: number) => { // Función para actualizar los IDs seleccionados
    const currentSelectedRows = get().selectedRows;
    const updatedSelectedRows = currentSelectedRows.includes(rowId)
      ? currentSelectedRows.filter((id) => id !== rowId) // Eliminamos el ID si ya está seleccionado
      : [...currentSelectedRows, rowId]; // Añadimos el ID si no está seleccionado
    set({ selectedRows: updatedSelectedRows });
  },
}));