import type { OrderItem } from "./order";
import type { User } from "./user";

/** Espelha ReviewsEnum (reviews/schemas/reviews_schema.py) — nota de 1 a 5. */
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

/** Espelha ReviewsOut — visão pública (só aparece se `is_authorized`). */
export interface Review {
  reviews_id: string;
  order_item: OrderItem;
  user: User;
  reviews: ReviewRating;
  reviews_label: string;
  comment: string | null;
  created_at: string;
}

/** Espelha ReviewsPrivateOut — usado nos endpoints do próprio cliente/admin. */
export interface ReviewPrivate extends Review {
  updated_at: string;
  is_authorized: boolean;
}

/** Payload de POST /reviews. */
export interface ReviewCreatePayload {
  order_item_id: string;
  reviews: ReviewRating;
  comment?: string;
}

/** Payload de PATCH /reviews/me/{id}. */
export interface ReviewUpdatePayload {
  reviews: ReviewRating;
  comment?: string;
}

/** Espelha ProductRatingSummaryOut — GET /reviews/products/{id}/summary. */
export interface ProductRatingSummary {
  product_id: string;
  average_rating: string;
  total_reviews: number;
}