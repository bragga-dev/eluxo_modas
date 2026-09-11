import { Link } from "react-router-dom";
import type { ProductListItem } from "@/types/product";
import type { ProductRatingSummary } from "@/types/review";
import { ProductPrice } from "./ProductPrice";
import { StarRatingDisplay } from "@/components/ui/StarRating";
import { rememberProduct } from "@/lib/productCache";

interface ProductCardProps {
  product: ProductListItem;
  rating?: ProductRatingSummary;
}

export function ProductCard({ product, rating }: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-3">
      <Link
        to={`/produtos/${product.product_id}`}
        onClick={() => rememberProduct(product)}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-lg bg-cream"
      >
        {product.cover_image ? (
          <img
            src={product.cover_image.product_image_url}
            alt={product.product_name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="font-display text-sm">Éluxo Modas</span>
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">
            Esgotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-ink/50">{product.category.category_name}</span>
        <Link to={`/produtos/${product.product_id}`} onClick={() => rememberProduct(product)}>
          <h3 className="line-clamp-1 text-sm font-medium text-ink hover:text-gold-dark">{product.product_name}</h3>
        </Link>

        {rating && rating.total_reviews > 0 && (
          <StarRatingDisplay value={Number(rating.average_rating)} totalReviews={rating.total_reviews} size={13} />
        )}

        <ProductPrice minPrice={product.min_price} maxPrice={product.max_price} />
      </div>

      <Link
        to={`/produtos/${product.product_id}`}
        onClick={(e) => {
          if (!product.in_stock) {
            e.preventDefault();
            return;
          }
          rememberProduct(product);
        }}
        aria-disabled={!product.in_stock}
        className={`mt-auto block w-full rounded-full py-2 text-center text-sm font-semibold transition-colors ${
          product.in_stock
            ? "bg-gold text-white hover:bg-gold-dark"
            : "cursor-not-allowed bg-ink/10 text-ink/40"
        }`}
      >
        {product.in_stock ? "Comprar" : "Esgotado"}
      </Link>
    </div>
  );
}