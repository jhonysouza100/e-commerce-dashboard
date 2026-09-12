import { ProductCategoryEnum } from "../enums/product-category.enum";

export interface ProductImageInterface {
  public_id: string;

  secure_url: string;
}

export interface ProductSpecificationsInterface {
  label: string;
  
  value: string;
}

export interface ProductDimensionsInterface {
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
  
  gallery?: ProductImageInterface[];

  image?: ProductImageInterface;
  
  color?: ProductColorInterface;
  
  price: number;
  
  stock?: number;

  maxCount?: number;

  minCount?: number;
  
  discount?: number;
  
  rating?: number;

  isActive?: boolean;
}