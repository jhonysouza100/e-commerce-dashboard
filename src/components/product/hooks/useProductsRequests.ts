import axios from "axios";
import { toast } from "sonner";
import { getSessionCookie } from "@/utils/handleCookies";
import { BACKEND_URL, SESSION_COOKIE} from "@/const/constants";
import { Product } from "../interface/product.interface";
import { ErrorResponse, handleAxiosErrorResponse, handleAxiosSuccessResponse, OkResponse } from "@/utils/handleAxiosResponses";
import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";

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
  key: string;
  value: string
}

export async function listProductsRequest(q: ListProductsQuery[], page: number, tenant_id?: number): Promise<{ count: number, products: Product[] }> {
  try {
    // Filtrar solo los pares que tengan un value válido (no vacío, no null, no undefined).
    const filteredQueryParams = q
      .filter(({ value }) => value !== undefined && value !== null && value !== '')
      // Convierte cada par key-value en una cadena key=value
      .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`) // Asegura que caracteres especiales no rompan la .
      // Une todos los pares con "&" como separador.
      .join('&');

    // Construir la cadena query completa.
    const query = `?${filteredQueryParams}${filteredQueryParams ? '&' : ''}page=${page}`; // Añade un & antes de page sólo si hay parámetros previos.

    // const query = q ? `?${q.key}=${q.value}&page=${page}` : `?page=${page}`;
    const response = await productRequest.get<{ count: number, products: Product[] }>(`${query}${tenant_id ? `&tenant_id=${tenant_id}` : '&status=true'}`);
    return response.data;
  } catch (error) {
    throw new Error((error as ErrorResponse).response?.data.message || (error as ErrorResponse).message);
  }
}

export async function getProductRequest(id?: number): Promise<Product> {
  try {
    const response = await productRequest.get<{ count: number, products: Product[] }>(`?id=${id}`);
    return response.data.products.at(0) as Product;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo obtener el producto");
  }
}

export async function getProductByNameRequest(name: string): Promise<Product> {
  try {
    const response = await productRequest.get<Product>(`${name}`);
    return response.data as Product;
  } catch (error) {
    throw new Error((error as ErrorResponse).response?.data.message || (error as ErrorResponse).message);
  }
}

export async function getProductsSitemapByNameRequest(): Promise<{name: string, modifiedAt: string, images: { secure_url: string }[]}[]> {
  try {
    const response = await productRequest.get<{name: string, modifiedAt: string, images: { secure_url: string }[]}[]>('/name/sitemap');
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getRelatedProductsRequest(category: string): Promise<Product[]> {
  try {
    const response = await productRequest.get<{ count: number, products: Product[] }>(`?category=${encodeURIComponent(category)}&status=true`);
    return response.data.products;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudieron obtener los productos relacionados");
  }
}

export async function createProductRequest(product: CreateProductDto, files: {data: File, tempUrl: string}[]): Promise<OkResponse> {
  try {
    const formData = new FormData();
    // Agrega los archivos al FormData
    files.forEach((file) => formData.append("files", file.data));
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

export async function removeProductRequest(id: number): Promise<OkResponse> {
  try {
    const response = await productRequest.delete(`/${id}`);
    handleAxiosSuccessResponse(response.data.message);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("No se pudo eliminar el producto");
  }
}

export async function updateProductRequest(id: number, product: UpdateProductDto, files?: {data: File, tempUrl: string}[]): Promise<OkResponse> {
  try {
    const formData = new FormData();
    // Agrega los archivos al FormData
    files?.forEach((file) => formData.append("files", file.data));
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
    throw new Error("No se pudo actualizar el producto");
  }
}