import { http } from "./client";
import type {
  ProductRatingSummary,
  Review,
  ReviewCreatePayload,
  ReviewPrivate,
  ReviewUpdatePayload,
} from "@/types/review";

export async function createReview(payload: ReviewCreatePayload): Promise<ReviewPrivate> {
  const { data } = await http.post<ReviewPrivate>("/reviews", payload);
  return data;
}

export async function listMyReviews(): Promise<ReviewPrivate[]> {
  const { data } = await http.get<ReviewPrivate[]>("/reviews/me");
  return data;
}

export async function getMyReview(reviewId: string): Promise<ReviewPrivate> {
  const { data } = await http.get<ReviewPrivate>(`/reviews/me/${reviewId}`);
  return data;
}

export async function updateMyReview(reviewId: string, payload: ReviewUpdatePayload): Promise<ReviewPrivate> {
  const { data } = await http.patch<ReviewPrivate>(`/reviews/me/${reviewId}`, payload);
  return data;
}

export async function deleteMyReview(reviewId: string): Promise<void> {
  await http.delete(`/reviews/me/${reviewId}`);
}

/** GET /reviews/products/{id} — só as avaliações já autorizadas (públicas). */
export async function listProductReviews(productId: string): Promise<Review[]> {
  const { data } = await http.get<Review[]>(`/reviews/products/${productId}`);
  return data;
}

/** GET /reviews/products/{id}/summary — público, sem autenticação. */
export async function getProductRatingSummary(productId: string): Promise<ProductRatingSummary> {
  const { data } = await http.get<ProductRatingSummary>(`/reviews/products/${productId}/summary`);
  return data;
}

export async function listOrderItemReviews(orderItemId: string): Promise<Review[]> {
  const { data } = await http.get<Review[]>(`/reviews/order-items/${orderItemId}`);
  return data;
}