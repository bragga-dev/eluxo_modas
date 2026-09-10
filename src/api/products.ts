import { http } from "./client";
import type { Page } from "@/types/api";
import type { Product, ProductListFilters, ProductListItem } from "@/types/product";

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
  const { data } = await http.get<Page<ProductListItem>>("/products", {
    params: buildParams(filters),
  });
  return data;
}

/** GET /products/{id} — detalhe completo (com galeria). */
export async function getProduct(productId: string): Promise<Product> {
  const { data } = await http.get<Product>(`/products/${productId}`);
  return data;
}
