import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/api/products";
import { listCategories } from "@/api/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryCard } from "@/components/category/CategoryCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { StoreLocationMap } from "@/components/home/StoreLocationMap";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { useHomeCampaignBanners } from "@/hooks/useHomeCampaignBanners";

export function HomePage() {
  const { banners, isLoading: bannersLoading } = useHomeCampaignBanners();

  const featuredQuery = useQuery({
    queryKey: ["products", "home-featured"],
    queryFn: () => listProducts({ page: 1, page_size: 8, in_stock_only: true, sort: "recent" }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", "home"],
    queryFn: () => listCategories(1, 6),
  });

  return (
    <div>
      <section className="bg-cream">
        {bannersLoading ? (
          <Skeleton className="aspect-[16/9] w-full sm:aspect-[21/9]" />
        ) : (
          <HeroCarousel banners={banners} />
        )}

        <div className="mt-6 border-t border-black/5 bg-white/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 text-center text-xs text-ink/70 sm:grid-cols-4 sm:px-6 lg:px-8">
            <span>Entregamos em todo Brasil</span>
            <span>Compra segura</span>
            <span>Parcele em até 12x</span>
            <span>Atendimento especializado</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Novidades</h2>
          <Link to="/produtos" className="text-sm font-medium text-gold-dark hover:underline">
            Ver todos
          </Link>
        </div>

        {featuredQuery.isError && <ErrorState onRetry={() => featuredQuery.refetch()} />}
        {!featuredQuery.isError && (
          <ProductGrid products={featuredQuery.data?.items ?? []} isLoading={featuredQuery.isLoading} />
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-display text-2xl text-ink">Coleções</h2>
        {categoriesQuery.isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        )}
        {categoriesQuery.data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesQuery.data.items.map((category) => (
              <CategoryCard key={category.product_category_id} category={category} />
            ))}
          </div>
        )}
      </section>

      <StoreLocationMap />
    </div>
  );
}