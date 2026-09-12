/** Espelha ProductCategoryOut (products/schemas/product_category_schema.py). */
export interface Category {
  product_category_id: string;
  category_name: string;
  category_image_url: string;
  is_active: boolean;
}

/** Espelha ProductCategoryCreateIn. */
export interface CategoryCreatePayload {
  category_name: string;
}

/** Espelha ProductCategoryUpdateIn. */
export interface CategoryUpdatePayload {
  category_name?: string;
  is_active?: boolean;
}