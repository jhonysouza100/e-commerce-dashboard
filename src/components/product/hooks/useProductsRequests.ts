import axios from "axios";
import { getSessionCookie } from "@/utils/handleCookies";
import { BACKEND_URL, SESSION_COOKIE} from "@/const/constants";
import { Product } from "../interface/product.interface";
import { ErrorResponse, handleAxiosErrorResponse, handleAxiosSuccessResponse, OkResponse } from "@/utils/handleAxiosResponses";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductMediaFile } from "../interface/product.interface";
import { PaginationInterface } from "@/components/ui/Pagination";

const productRequest = axios.create({
  baseURL: `${BACKEND_URL}/products`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar el token de autorización
productRequest.interceptors.request.use(async config => {
  const token = await getSessionCookie(SESSION_COOKIE);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export interface ListProductsQuery {
  id?: number;
  q?: string;
  name?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: boolean;
  isActive?: boolean;
  stock?: boolean;
  tenant_id?: number;
}

export interface ListProductsResponse {
  data: Product[];
  count: PaginationInterface;
}

/**
 * Retrieves products matching the supplied filters and pagination settings.
 *
 * @param query Filters and pagination options for the product list.
 * @returns The products and pagination metadata returned by the API.
 * @throws An error when the request fails.
 */
export async function listProductsRequest(query: ListProductsQuery): Promise<ListProductsResponse> {
  try {
    const response = await productRequest.get<ListProductsResponse>('', {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw new Error((error as ErrorResponse).response?.data.message || (error as ErrorResponse).message);
  }
}

/**
 * Retrieves a product by its identifier.
 *
 * @param id Identifier of the product to retrieve.
 * @returns The requested product.
 * @throws An error when the request fails or the product is not found.
 */
export async function getProductRequest(id?: number): Promise<Product> {
  try {
    const response = await productRequest.get<ListProductsResponse>(`?id=${id}`);
    return response.data.data.at(0) as Product;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo obtener el producto");
  }
}

/**
 * Retrieves a product by its name.
 *
 * @param name Name of the product to retrieve.
 * @returns The requested product.
 * @throws An error when the request fails.
 */
export async function getProductByNameRequest(name: string): Promise<Product> {
  try {
    const response = await productRequest.get<Product>(`${name}`);
    return response.data as Product;
  } catch (error) {
    throw new Error((error as ErrorResponse).response?.data.message || (error as ErrorResponse).message);
  }
}

/**
 * Retrieves the product data required to generate the sitemap.
 *
 * @returns Product names, modification dates, and gallery URLs.
 */
export async function getProductsSitemapByNameRequest(): Promise<{name: string, modifiedAt: string, gallery: { secure_url: string }[]}[]> {
  try {
    const response = await productRequest.get<{name: string, modifiedAt: string, gallery: { secure_url: string }[]}[]>('/name/sitemap');
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Retrieves products related to a category.
 *
 * @param category Category used to find related products.
 * @returns The related products.
 * @throws An error when the request fails.
 */
export async function getRelatedProductsRequest(category: string): Promise<Product[]> {
  try {
    const response = await productRequest.get<ListProductsResponse>(`?category=${encodeURIComponent(category)}&status=true`);
    return response.data.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudieron obtener los productos relacionados");
  }
}

interface ProductMedia {
  image?: ProductMediaFile;
  gallery: ProductMediaFile[];
}

/**
 * Creates a product and uploads its associated media.
 *
 * @param product Product data to persist.
 * @param media Main image and gallery files associated with the product.
 * @returns The API response confirming the product creation.
 * @throws An error when the request fails.
 */
export async function createProductRequest(product: CreateProductDto, media: ProductMedia): Promise<OkResponse> {
  try {
    const formData = new FormData();
    media.gallery
      .filter((el) => el.tempUrl !== media.image?.tempUrl)
      .forEach((el) => formData.append("gallery", el.data));
    if (media.image) formData.append("image", media.image.data);
    // Agrega los datos del producto como una cadena JSON
    formData.append("product", JSON.stringify(product));
    
    const response = await productRequest.post<OkResponse>('', formData, {
      headers: {
        // Asegúrate de establecer el tipo de contenido correcto para FormData
        'Content-Type': 'multipart/form-data', 
      },
    });

    handleAxiosSuccessResponse(response.data.message);
    return response.data; 
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo crear el producto");
  }
}

/**
 * Removes the products identified by the supplied identifiers.
 *
 * @param ids Identifiers of the products to remove.
 * @returns The API response confirming the removal.
 * @throws An error when the request fails.
 */
export async function removeProductRequest(ids: number[]): Promise<OkResponse> {
  try {
    const response = await productRequest.delete(`/[${ids}]`);
    handleAxiosSuccessResponse(response.data.message);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo eliminar el item");
  }
}

/**
 * Creates duplicates of the products identified by the supplied identifiers.
 *
 * @param ids Identifiers of the products to duplicate.
 * @returns The API response confirming the duplication.
 * @throws An error when the request fails.
 */
export async function duplicateProductsRequest(ids: number[]): Promise<OkResponse> {
  try {
    const response = await productRequest.post('/duplicate', { ids });
    handleAxiosSuccessResponse(response.data.message);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo duplicar el item");
  }
}

/**
 * Deactivates the products identified by the supplied identifiers.
 *
 * @param ids Identifiers of the products to deactivate.
 * @returns The API response confirming the status update.
 * @throws An error when the request fails.
 */
export async function desactiveProductRequest(ids: number[]): Promise<OkResponse> {
  try {
    const response = await productRequest.patch('/desactive', { ids });
    handleAxiosSuccessResponse(response.data.message);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo actualizar el estado del item");
  }
}

/**
 * Updates a product and uploads its associated media.
 *
 * @param id Identifier of the product to update.
 * @param product Updated product data.
 * @param media Main image and gallery files associated with the product.
 * @returns The API response confirming the product update.
 * @throws An error when the request fails.
 */
export async function updateProductRequest(id: number, product: UpdateProductDto, media: ProductMedia): Promise<OkResponse> {
  try {
    const formData = new FormData();
    media.gallery
      .filter((file) => file.tempUrl !== media.image?.tempUrl)
      .forEach((file) => formData.append("gallery", file.data));
    if (media.image) formData.append("image", media.image.data);
    // Agrega los datos del producto como una cadena JSON
    formData.append("product", JSON.stringify(product));

    const response = await productRequest.patch<OkResponse>(`/${id}`, formData, {
      headers: {
        // Asegúrate de establecer el tipo de contenido correcto para FormData
        'Content-Type': 'multipart/form-data'
      },
    });

    handleAxiosSuccessResponse(response.data.message);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo actualizar el item");
  }
}