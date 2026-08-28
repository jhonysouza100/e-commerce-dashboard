import { ProductColorInterface } from "../dtos/create-product.dto";
import { ProductCategoryEnum } from "../enums/product-category.enum";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: { public_id: string; secure_url: string }[];
  specifications: { label: string, value: string }[]
  category: ProductCategoryEnum;
  brand: string;
  model: string;
  color?: ProductColorInterface;
  stock: number;
  price: number;
  discount: number;
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
  category: ProductCategoryEnum.OTHER,
  brand: "",
  model: "",
  description: "",
  images: [],
  specifications: [{ label: "", value: "" }],
  price: 0,
  stock: 0,
  discount: 0,
  isActive: false,
  color: {name: "", value: ""},
}