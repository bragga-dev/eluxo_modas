import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, updateMyReview } from "@/api/reviews";
import { useToast } from "@/hooks/useToast";
import { Modal } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { StarRatingInput } from "@/components/ui/StarRating";
import { ApiError } from "@/types/api";
import type { ReviewPrivate, ReviewRating } from "@/types/review";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItemId: string;
  productName: string;
  /** Se informado, o modal edita essa avaliação em vez de criar uma nova. */
  existingReview?: ReviewPrivate;
}

export function ReviewFormModal({ isOpen, onClose, orderItemId, productName, existingReview }: ReviewFormModalProps) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<ReviewRating | 0>(existingReview?.reviews ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      existingReview
        ? updateMyReview(existingReview.reviews_id, { reviews: rating as ReviewRating, comment: comment || undefined })
        : createReview({ order_item_id: orderItemId, reviews: rating as ReviewRating, comment: comment || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "me"] });
      showToast(
        existingReview ? "Avaliação atualizada. Ela volta pra moderação antes de aparecer publicamente." : "Avaliação enviada! Ela aparece publicamente após ser moderada.",
        "success"
      );
      onClose();
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível enviar sua avaliação.", "error");
    },
  });

  function handleSubmit() {
    if (!rating) {
      showToast("Selecione uma nota de 1 a 5 estrelas.", "error");
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Avaliar ${productName}`}>
      <div className="flex flex-col gap-4">
        <StarRatingInput value={rating} onChange={setRating} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-comment" className="text-sm font-medium text-ink">
            Comentário (opcional)
          </label>
          <textarea
            id="review-comment"
            rows={4}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência com o produto..."
            className="rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
          <span className="self-end text-xs text-ink/40">{comment.length}/500</span>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSubmit} isLoading={mutation.isPending}>
            {existingReview ? "Salvar alterações" : "Enviar avaliação"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}