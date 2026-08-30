import { ProductColorInterface } from "../dtos/create-product.dto";
import { ProductCategoryEnum } from "../enums/product-category.enum";

export interface Product {
  id: number;
  name: string;
  slug: string;
  alias?: string;
  description: string;
  images: { public_id: string; secure_url: string }[];
  specifications: { label: string, value: string }[]
  dimensions?: { weight: number; height: number; width: number; length: number };
  category: ProductCategoryEnum;
  brand: string;
  model: string;
  color?: ProductColorInterface;
  price: number;
  stock: number;
  discount: number;
  maxCount?: number;
  minCount?: number;
  isActive: boolean;
  tenant_id: number;
  // questions: QuestionInterface[];
  // reviews: ReviewInterface[];
  average: number;
  createdAt: Date;
  modifiedAt: Date;
}

export const EMPTY_INITIAL_PRODUCT = {
  name: "",
  slug: "",
  alias: "",
  category: ProductCategoryEnum.OTHER,
  brand: "",
  model: "",
  description: "",
  images: [],
  specifications: [{ label: "", value: "" }],
  dimensions: { weight: 0, height: 0, width: 0, length: 0 },
  price: 0,
  stock: 0,
  discount: 0,
  minCount: 1,
  maxCount: 1,
  isActive: false,
  color: {name: "", value: ""},
}