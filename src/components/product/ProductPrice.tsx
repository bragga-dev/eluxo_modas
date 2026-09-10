import { formatCurrency } from "@/lib/formatters";

interface ProductPriceProps {
  minPrice: string | null;
  maxPrice: string | null;
  className?: string;
}

export function ProductPrice({ minPrice, maxPrice, className = "" }: ProductPriceProps) {
  if (!minPrice) {
    return <span className={`text-sm text-ink/50 ${className}`}>Indisponível</span>;
  }

  const hasRange = maxPrice && maxPrice !== minPrice;

  return (
    <span className={`font-display text-lg text-ink ${className}`}>
      {hasRange ? (
        <>
          {formatCurrency(minPrice)} <span className="text-sm text-ink/50">— {formatCurrency(maxPrice)}</span>
        </>
      ) : (
        formatCurrency(minPrice)
      )}
    </span>
  );
}
