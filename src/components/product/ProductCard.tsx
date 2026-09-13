// src/components/product/ProductCard.tsx
import { Link } from "react-router-dom";
import type { ProductListItem } from "@/types/product";
import type { ProductRatingSummary } from "@/types/review";
import { ProductPrice } from "./ProductPrice";
import { StarRatingDisplay } from "@/components/ui/StarRating";
import { BagIcon } from "@/components/ui/Icons";
import { rememberProduct } from "@/lib/productCache";

interface ProductCardProps {
  product: ProductListItem;
  rating?: ProductRatingSummary;
}

// NOTA TÉCNICA: o design system previa uma segunda imagem no hover (desktop), mas
// `ProductListItem` (payload de listagem) só traz `cover_image` — nenhuma galeria.
// Implementar isso exigiria mudar o contrato do endpoint de listagem, o que o
// backend/API não deve fazer sem alinhamento prévio. Fica registrado como pendência
// de backend; por ora o card usa apenas a imagem de capa.
export function ProductCard({ product, rating }: ProductCardProps) {
  return (
    <div className="group flex flex-col gap-2.5">
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

        {/* Ação discreta: some no mobile (não depende de hover), aparece só ao
            passar o mouse no desktop. O nome/preço abaixo já levam ao produto,
            então esta ação não precisa competir por espaço com um botão grande. */}
        {product.in_stock && (
          <span
            aria-hidden="true"
            className="absolute bottom-2 right-2 hidden h-9 w-9 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 sm:flex"
          >
            <BagIcon className="h-4 w-4" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-ink/45">{product.category.category_name}</span>
        <Link to={`/produtos/${product.product_id}`} onClick={() => rememberProduct(product)}>
          <h3 className="line-clamp-1 text-sm text-ink group-hover:text-gold-dark">{product.product_name}</h3>
        </Link>

        {rating && rating.total_reviews > 0 && (
          <StarRatingDisplay value={Number(rating.average_rating)} totalReviews={rating.total_reviews} size={13} />
        )}

        <ProductPrice minPrice={product.min_price} maxPrice={product.max_price} />
      </div>

      {/* Mobile não depende de hover: mantém CTA visível e com área de toque adequada. */}
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
        className={`block w-full rounded-full py-2 text-center text-sm font-semibold transition-colors sm:hidden ${
          product.in_stock ? "bg-gold text-white hover:bg-gold-dark" : "cursor-not-allowed bg-ink/10 text-ink/40"
        }`}
      >
        {product.in_stock ? "Comprar" : "Esgotado"}
      </Link>
    </div>
  );
}