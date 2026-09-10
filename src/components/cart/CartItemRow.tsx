import { Link } from "react-router-dom";
import type { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/formatters";
import { getCachedProductForVariant } from "@/lib/productCache";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { PRODUCT_COLOR_LABELS } from "@/types/product";

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

export function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }: CartItemRowProps) {
  const cached = getCachedProductForVariant(item.variant.variant_id);
  const { variant } = item;

  const attributesLabel = [
    variant.color ? PRODUCT_COLOR_LABELS[variant.color] : null,
    variant.size,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex gap-4 border-b border-black/10 py-5">
      <Link
        to={cached ? `/produtos/${cached.productId}` : "#"}
        className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-cream"
      >
        {cached?.imageUrl ? (
          <img src={cached.imageUrl} alt={cached.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
            Éluxo Modas
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link
          to={cached ? `/produtos/${cached.productId}` : "#"}
          className="text-sm font-medium text-ink hover:text-gold-dark"
        >
          {cached?.productName ?? "Produto"}
        </Link>
        {attributesLabel && <span className="text-xs text-ink/50">{attributesLabel}</span>}
        <span className="text-sm text-ink/70">{formatCurrency(item.unit_price_item)}</span>

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            value={item.quantity_item}
            max={variant.stock}
            onChange={onQuantityChange}
            disabled={isUpdating}
          />
          <button
            onClick={onRemove}
            disabled={isUpdating}
            className="text-xs font-medium text-ink/50 underline hover:text-red-600"
          >
            Remover
          </button>
        </div>
      </div>

      <span className="whitespace-nowrap font-display text-sm text-ink">{formatCurrency(item.subtotal)}</span>
    </div>
  );
}
