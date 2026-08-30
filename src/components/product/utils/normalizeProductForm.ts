import type { CreateProductDto, ProductColorInterface } from "../dtos/create-product.dto";
import type { UpdateProductDto } from "../dtos/update-product.dto";

export type ProductFormValues = CreateProductDto & {
  color?: ProductColorInterface;
};

const optionalNumber = (value: unknown): number | undefined => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const cleanOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value.trim();
};

export function normalizeProductForm(form: ProductFormValues): CreateProductDto {
  const specifications = form.specifications?.filter(
    (spec) => spec.label.trim() !== "" || spec.value.trim() !== "",
  );
  const color = form.color && (form.color.name.trim() || form.color.value.trim())
    ? { name: form.color.name.trim(), value: form.color.value.trim() }
    : undefined;
  const dimensions = form.dimensions
    ? {
        weight: optionalNumber(form.dimensions.weight),
        height: optionalNumber(form.dimensions.height),
        width: optionalNumber(form.dimensions.width),
        length: optionalNumber(form.dimensions.length),
      }
    : undefined;

  const payload: CreateProductDto = {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    category: form.category,
    brand: form.brand.trim(),
    model: form.model.trim(),
    price: optionalNumber(form.price) ?? 0,
    isActive: Boolean(form.isActive),
  };

  const alias = cleanOptionalString(form.alias);
  const stock = optionalNumber(form.stock);
  const minCount = optionalNumber(form.minCount);
  const maxCount = optionalNumber(form.maxCount);
  const discount = optionalNumber(form.discount);

  if (alias !== undefined) payload.alias = alias;
  if (stock !== undefined) payload.stock = stock;
  if (minCount !== undefined) payload.minCount = minCount;
  if (maxCount !== undefined) payload.maxCount = maxCount;
  if (discount !== undefined) payload.discount = discount;
  if (specifications?.length) payload.specifications = specifications;
  if (dimensions && Object.values(dimensions).every((value) => value !== undefined)) {
    payload.dimensions = dimensions as NonNullable<CreateProductDto["dimensions"]>;
  }
  if (form.images?.length) {
    payload.images = form.images.map(({ public_id, secure_url }) => ({ public_id, secure_url }));
  }
  if (color) payload.color = color;

  return payload;
}

export function normalizeProductUpdate(form: ProductFormValues): UpdateProductDto {
  return normalizeProductForm(form);
}