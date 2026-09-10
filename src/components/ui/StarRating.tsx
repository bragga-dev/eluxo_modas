import { useState } from "react";
import type { ReviewRating } from "@/types/review";

const STAR_PATH =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.6l1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z";

function Star({ filled, size = 16 }: { filled: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "#B8860B" : "none"}
      stroke="#B8860B"
      strokeWidth={1.3}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

interface StarRatingDisplayProps {
  value: number;
  totalReviews?: number;
  size?: number;
  className?: string;
}

/** Só exibição — usado nos cards, detalhe do produto e lista de avaliações. */
export function StarRatingDisplay({ value, totalReviews, size = 16, className = "" }: StarRatingDisplayProps) {
  const rounded = Math.round(value);
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex" role="img" aria-label={`Nota ${value.toFixed(1)} de 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= rounded} size={size} />
        ))}
      </div>
      {typeof totalReviews === "number" && (
        <span className="text-xs text-ink/50">({totalReviews})</span>
      )}
    </div>
  );
}

interface StarRatingInputProps {
  value: ReviewRating | 0;
  onChange: (value: ReviewRating) => void;
}

/** Interativo — usado no formulário de criação/edição de avaliação. */
export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered || value;

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Sua nota">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n as ReviewRating)}
          className="p-0.5"
        >
          <Star filled={n <= displayValue} size={28} />
        </button>
      ))}
    </div>
  );
}