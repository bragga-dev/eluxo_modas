import { http } from "./client";
import type { Page } from "@/types/api";
import type {
  Product,
  ProductCreateFullPayload,
  ProductImage,
  ProductListAdminFilters,
  ProductListFilters,
  ProductListItem,
  ProductUpdatePayload,
  ProductVariant,
  VariantCreatePayload,
  VariantUpdatePayload,
} from "@/types/product";

function buildParams(filters: ProductListFilters): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;
  if (filters.search) params.search = filters.search;
  if (filters.product_category_id) params.product_category_id = filters.product_category_id;
  if (filters.gender) params.gender = filters.gender;
  if (filters.size) params.size = filters.size;
  if (filters.color) params.color = filters.color;
  if (filters.in_stock_only) params.in_stock_only = filters.in_stock_only;
  return params;
}

/** GET /products — vitrine pública, paginada. */
export async function listProducts(filters: ProductListFilters = {}): Promise<Page<ProductListItem>> {
  const { data } = await http.get<Page<ProductListItem>>("/products/", {
    params: buildParams(filters),
  });
  return data;
}

/** GET /products/{id} — detalhe completo (com galeria). */
export async function getProduct(productId: string): Promise<Product> {
  const { data } = await http.get<Product>(`/products/${productId}`);
  return data;
}

// ── Painel administrativo ─────────────────────────────────────────────────────

/** GET /products/admin/list — inclui produtos inativos, paginado. */
export async function listProductsAdmin(filters: ProductListAdminFilters = {}): Promise<Page<ProductListItem>> {
  const { data } = await http.get<Page<ProductListItem>>("/products/admin/list", {
    params: { ...buildParams(filters), active_only: filters.active_only ?? false },
  });
  return data;
}

/** POST /products/full — cria produto + 1ª variante + frete + imagens (multipart). */
export async function createProductFull(
  payload: ProductCreateFullPayload,
  images: File[] = [],
  coverIndex = 0
): Promise<Product> {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  form.append("cover_index", String(coverIndex));
  images.forEach((image) => form.append("images", image));

  const { data } = await http.post<Product>("/products/full", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** PATCH /products/{id}. */
export async function updateProduct(productId: string, payload: ProductUpdatePayload): Promise<Product> {
  const { data } = await http.patch<Product>(`/products/${productId}`, payload);
  return data;
}

/** DELETE /products/{id}. */
export async function deleteProduct(productId: string): Promise<void> {
  await http.delete(`/products/${productId}`);
}

export async function activateProduct(productId: string): Promise<Product> {
  const { data } = await http.post<Product>(`/products/${productId}/activate`);
  return data;
}

export async function deactivateProduct(productId: string): Promise<Product> {
  const { data } = await http.post<Product>(`/products/${productId}/deactivate`);
  return data;
}

// ── Variantes (admin) ──────────────────────────────────────────────────────────

/** GET /products/{id}/variants — inclui inativas por padrão. */
export async function listProductVariants(productId: string, activeOnly = false): Promise<ProductVariant[]> {
  const { data } = await http.get<ProductVariant[]>(`/products/${productId}/variants`, {
    params: { active_only: activeOnly },
  });
  return data;
}

export async function createProductVariant(
  productId: string,
  payload: VariantCreatePayload
): Promise<ProductVariant> {
  const { data } = await http.post<ProductVariant>(`/products/${productId}/variants`, payload);
  return data;
}

export async function updateProductVariant(
  variantId: string,
  payload: VariantUpdatePayload
): Promise<ProductVariant> {
  const { data } = await http.patch<ProductVariant>(`/products/variants/${variantId}`, payload);
  return data;
}

export async function deleteProductVariant(variantId: string): Promise<void> {
  await http.delete(`/products/variants/${variantId}`);
}

export async function activateProductVariant(variantId: string): Promise<ProductVariant> {
  const { data } = await http.post<ProductVariant>(`/products/variants/${variantId}/activate`);
  return data;
}

export async function deactivateProductVariant(variantId: string): Promise<ProductVariant> {
  const { data } = await http.post<ProductVariant>(`/products/variants/${variantId}/deactivate`);
  return data;
}

export async function setProductVariantStock(variantId: string, stock: number): Promise<ProductVariant> {
  const { data } = await http.post<ProductVariant>(`/products/variants/${variantId}/stock`, null, {
    params: { stock },
  });
  return data;
}

// ── Imagens (admin) ────────────────────────────────────────────────────────────

export async function listProductImages(productId: string): Promise<ProductImage[]> {
  const { data } = await http.get<ProductImage[]>(`/products/${productId}/images`);
  return data;
}

export async function uploadProductImage(
  productId: string,
  image: File,
  isCover = false,
  displayOrder = 0
): Promise<ProductImage> {
  const form = new FormData();
  form.append("image", image);
  const { data } = await http.post<ProductImage>(`/products/${productId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { is_cover: isCover, display_order: displayOrder },
  });
  return data;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await http.delete(`/products/images/${imageId}`);
}

export async function setCoverProductImage(imageId: string): Promise<ProductImage> {
  const { data } = await http.post<ProductImage>(`/products/images/${imageId}/set-cover`);
  return data;
}

export async function reorderProductImage(imageId: string, displayOrder: number): Promise<ProductImage> {
  const { data } = await http.post<ProductImage>(`/products/images/${imageId}/reorder`, null, {
    params: { display_order: displayOrder },
  });
  return data;
}