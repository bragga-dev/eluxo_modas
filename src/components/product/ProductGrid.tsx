import type { ProductListItem } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/StatusStates";

interface ProductGridProps {
  products: ProductListItem[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton />;

  if (products.length === 0) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Tente ajustar os filtros ou buscar por outro termo."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
