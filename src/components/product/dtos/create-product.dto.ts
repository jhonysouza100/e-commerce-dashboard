import { ProductCategoryEnum } from "../enums/product-category.enum";

interface ProductImageInterface {
  public_id: string;

  secure_url: string;
}

interface ProductSpecificationsInterface {
  label: string;
  
  value: string;
}

interface ProductDimensionsInterface {
  weight: number;

  height: number;
  
  width: number;
  
  length: number;
}

export interface ProductColorInterface {
  name: string;
  
  value: string;
}

export interface CreateProductDto {
  name: string;
  
  slug: string;
  
  alias?: string;

  description: string;
  
  category: ProductCategoryEnum;
  
  brand: string;

  model: string;

  specifications?: ProductSpecificationsInterface[];
  
  dimensions?: ProductDimensionsInterface;
  
  images?: ProductImageInterface[];
  
  color?: ProductColorInterface;
  
  price: number;
  
  stock?: number;

  maxCount?: number;

  minCount?: number;
  
  discount?: number;
  
  rating?: number;

  isActive?: boolean;
}