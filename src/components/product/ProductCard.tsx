import { Link } from "react-router-dom";
import type { ProductListItem } from "@/types/product";
import { ProductPrice } from "./ProductPrice";
import { rememberProduct } from "@/lib/productCache";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      to={`/produtos/${product.product_id}`}
      onClick={() => rememberProduct(product)}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-cream">
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
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-ink/50">{product.category.category_name}</span>
        <h3 className="line-clamp-1 text-sm font-medium text-ink">{product.product_name}</h3>
        <ProductPrice minPrice={product.min_price} maxPrice={product.max_price} />
      </div>
    </Link>
  );
}
