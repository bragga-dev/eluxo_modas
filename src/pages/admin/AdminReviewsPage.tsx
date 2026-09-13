import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as reviewsApi from "@/api/reviews";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { StarRatingDisplay } from "@/components/ui/StarRating";
import { formatDateTime } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import type { ReviewPrivate } from "@/types/review";

type Tab = "pending" | "authorized";

export function AdminReviewsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("pending");
  const [pendingDelete, setPendingDelete] = useState<ReviewPrivate | null>(null);

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews", tab],
    queryFn: () => (tab === "pending" ? reviewsApi.listPendingReviewsAdmin() : reviewsApi.listAuthorizedReviewsAdmin()),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  const authorizeMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.authorizeReviewAdmin(reviewId),
    onSuccess: () => {
      showToast("Avaliação autorizada.", "success");
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível autorizar.", "error"),
  });

  const revokeMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.revokeReviewAdmin(reviewId),
    onSuccess: () => {
      showToast("Autorização revogada.", "success");
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível revogar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReviewAdmin(reviewId),
    onSuccess: () => {
      showToast("Avaliação excluída.", "success");
      invalidate();
      setPendingDelete(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  const reviews = reviewsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Avaliações</h2>
        <p className="mt-1 text-sm text-ink/50">Modere os comentários enviados pelos clientes antes de irem ao ar.</p>
      </div>

      <div className="flex gap-2 border-b border-black/8">
        <TabButton active={tab === "pending"} onClick={() => setTab("pending")}>
          Pendentes
        </TabButton>
        <TabButton active={tab === "authorized"} onClick={() => setTab("authorized")}>
          Autorizadas
        </TabButton>
      </div>

      {reviewsQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : reviewsQuery.isError ? (
        <ErrorState onRetry={() => reviewsQuery.refetch()} />
      ) : reviews.length === 0 ? (
        <EmptyState
          title={tab === "pending" ? "Nenhuma avaliação pendente" : "Nenhuma avaliação autorizada"}
          description="Quando houver avaliações nesta lista, elas aparecem aqui."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.reviews_id} className="rounded-xl border border-black/8 bg-white px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StarRatingDisplay value={review.reviews} size={14} />
                    <Badge className={review.is_authorized ? "bg-green-100 text-green-700" : "bg-gold-light/20 text-gold-dark"}>
                      {review.is_authorized ? "Autorizada" : "Pendente"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-medium text-ink">{review.user.email}</p>
                  <p className="text-xs text-ink/50">
                    {review.order_item.variant.description} · Enviada em {formatDateTime(review.created_at)}
                  </p>
                  {review.comment && <p className="mt-2 text-sm text-ink/80">{review.comment}</p>}
                </div>

                <div className="flex shrink-0 gap-2">
                  {review.is_authorized ? (
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={revokeMutation.isPending}
                      onClick={() => revokeMutation.mutate(review.reviews_id)}
                    >
                      Revogar
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={authorizeMutation.isPending}
                      onClick={() => authorizeMutation.mutate(review.reviews_id)}
                    >
                      Autorizar
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => setPendingDelete(review)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir avaliação"
        description="Essa ação exclui a avaliação permanentemente e não pode ser desfeita."
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.reviews_id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
        active ? "border-gold text-gold-dark" : "border-transparent text-ink/50 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}