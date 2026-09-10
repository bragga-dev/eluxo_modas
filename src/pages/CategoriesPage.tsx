import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/api/categories";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";

export function CategoriesPage() {
  const categoriesQuery = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => listCategories(1, 50),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Categorias" }]} />
      <h1 className="mt-3 mb-8 font-display text-3xl text-ink">Categorias</h1>

      {categoriesQuery.isError && <ErrorState onRetry={() => categoriesQuery.refetch()} />}

      {categoriesQuery.isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
    </div>
  );
}
