import { http } from "./client";
import type { Page } from "@/types/api";
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from "@/types/category";

/** GET /categories — lista pública paginada (usada no menu e nos filtros). */
export async function listCategories(page = 1, pageSize = 50): Promise<Page<Category>> {
  const { data } = await http.get<Page<Category>>("/categories/", {
    params: { page, page_size: pageSize, active_only: true },
  });
  return data;
}

/** GET /categories/{id}. */
export async function getCategory(categoryId: string): Promise<Category> {
  const { data } = await http.get<Category>(`/categories/${categoryId}`);
  return data;
}

// ── Painel administrativo ─────────────────────────────────────────────────────

/** GET /categories — admin, inclui inativas. */
export async function listCategoriesAdmin(page = 1, pageSize = 50): Promise<Page<Category>> {
  const { data } = await http.get<Page<Category>>("/categories/", {
    params: { page, page_size: pageSize, active_only: false },
  });
  return data;
}

export async function createCategory(payload: CategoryCreatePayload): Promise<Category> {
  const { data } = await http.post<Category>("/categories/", payload);
  return data;
}

export async function updateCategory(categoryId: string, payload: CategoryUpdatePayload): Promise<Category> {
  const { data } = await http.patch<Category>(`/categories/${categoryId}`, payload);
  return data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await http.delete(`/categories/${categoryId}`);
}

export async function activateCategory(categoryId: string): Promise<Category> {
  const { data } = await http.post<Category>(`/categories/${categoryId}/activate`);
  return data;
}

export async function deactivateCategory(categoryId: string): Promise<Category> {
  const { data } = await http.post<Category>(`/categories/${categoryId}/deactivate`);
  return data;
}

export async function uploadCategoryImage(categoryId: string, image: File): Promise<Category> {
  const form = new FormData();
  form.append("image", image);
  const { data } = await http.post<Category>(`/categories/${categoryId}/image`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function removeCategoryImage(categoryId: string): Promise<Category> {
  const { data } = await http.delete<Category>(`/categories/${categoryId}/image`);
  return data;
}