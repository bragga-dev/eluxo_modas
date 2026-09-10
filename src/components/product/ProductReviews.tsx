import { useQuery } from "@tanstack/react-query";
import { getProductRatingSummary, listProductReviews } from "@/api/reviews";
import { StarRatingDisplay } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/formatters";

/** Mascara o e-mail do avaliador pra não expor o endereço completo publicamente. */
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

export function ProductReviews({ productId }: { productId: string }) {
  const summaryQuery = useQuery({
    queryKey: ["reviews", "summary", productId],
    queryFn: () => getProductRatingSummary(productId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => listProductReviews(productId),
  });

  const summary = summaryQuery.data;
  const reviews = reviewsQuery.data ?? [];

  return (
    <section id="avaliacoes" className="mt-16 border-t border-black/10 pt-10">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-display text-2xl text-ink">Avaliações</h2>
        {summary && summary.total_reviews > 0 && (
          <StarRatingDisplay value={Number(summary.average_rating)} totalReviews={summary.total_reviews} size={18} />
        )}
      </div>

      {reviewsQuery.isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!reviewsQuery.isLoading && reviews.length === 0 && (
        <p className="text-sm text-ink/60">Esse produto ainda não tem avaliações.</p>
      )}

      <ul className="flex flex-col divide-y divide-black/5">
        {reviews.map((review) => (
          <li key={review.reviews_id} className="py-5">
            <div className="flex items-center justify-between gap-3">
              <StarRatingDisplay value={review.reviews} size={14} />
              <span className="text-xs text-ink/40">{formatDate(review.created_at)}</span>
            </div>
            <p className="mt-1 text-xs text-ink/50">{maskEmail(review.user.email)}</p>
            {review.comment && <p className="mt-2 text-sm text-ink/80">{review.comment}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}