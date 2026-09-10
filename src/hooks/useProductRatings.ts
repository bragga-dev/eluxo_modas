import { useQueries } from "@tanstack/react-query";
import { getProductRatingSummary } from "@/api/reviews";
import type { ProductRatingSummary } from "@/types/review";

/**
 * A API não expõe rating agregado no endpoint de listagem de produtos
 * (ProductListOut não tem average_rating/total_reviews — ver
 * types/product.ts). Esse hook busca o resumo de cada produto em paralelo
 * via GET /reviews/products/{id}/summary, com cache do React Query por
 * product_id — então navegar entre páginas do catálogo não refaz as
 * requisições de produtos já vistos.
 */
export function useProductRatings(productIds: string[]): Record<string, ProductRatingSummary> {
  const results = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ["reviews", "summary", productId],
      queryFn: () => getProductRatingSummary(productId),
      staleTime: 5 * 60_000,
    })),
  });

  const map: Record<string, ProductRatingSummary> = {};
  results.forEach((result, index) => {
    if (result.data) map[productIds[index]] = result.data;
  });
  return map;
}