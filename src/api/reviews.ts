import { http } from "./client";
import type {
  ProductRatingSummary,
  Review,
  ReviewCreatePayload,
  ReviewPrivate,
  ReviewUpdatePayload,
} from "@/types/review";

export async function createReview(payload: ReviewCreatePayload): Promise<ReviewPrivate> {
  const { data } = await http.post<ReviewPrivate>("/reviews/", payload);
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

// ── Moderação (admin) ────────────────────────────────────────────────────────

/** GET /reviews/admin/pending — [Admin] avaliações aguardando moderação. */
export async function listPendingReviewsAdmin(): Promise<ReviewPrivate[]> {
  const { data } = await http.get<ReviewPrivate[]>("/reviews/admin/pending");
  return data;
}

/** GET /reviews/admin/authorized — [Admin] avaliações já autorizadas. */
export async function listAuthorizedReviewsAdmin(): Promise<ReviewPrivate[]> {
  const { data } = await http.get<ReviewPrivate[]>("/reviews/admin/authorized");
  return data;
}

/** POST /reviews/admin/{id}/authorize — [Admin] autoriza a exibição pública. */
export async function authorizeReviewAdmin(reviewId: string): Promise<ReviewPrivate> {
  const { data } = await http.post<ReviewPrivate>(`/reviews/admin/${reviewId}/authorize`);
  return data;
}

/** POST /reviews/admin/{id}/revoke — [Admin] revoga a autorização pública. */
export async function revokeReviewAdmin(reviewId: string): Promise<ReviewPrivate> {
  const { data } = await http.post<ReviewPrivate>(`/reviews/admin/${reviewId}/revoke`);
  return data;
}

/** DELETE /reviews/admin/{id} — [Admin] exclui permanentemente. */
export async function deleteReviewAdmin(reviewId: string): Promise<void> {
  await http.delete(`/reviews/admin/${reviewId}`);
}