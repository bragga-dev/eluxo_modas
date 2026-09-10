import { http } from "./client";
import type { Page } from "@/types/api";
import type { Category } from "@/types/category";

/** GET /categories — lista pública paginada (usada no menu e nos filtros). */
export async function listCategories(page = 1, pageSize = 50): Promise<Page<Category>> {
  const { data } = await http.get<Page<Category>>("/categories", {
    params: { page, page_size: pageSize, active_only: true },
  });
  return data;
}

/** GET /categories/{id}. */
export async function getCategory(categoryId: string): Promise<Category> {
  const { data } = await http.get<Category>(`/categories/${categoryId}`);
  return data;
}
