import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/api/products";
import { listCategories } from "@/api/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ErrorState } from "@/components/ui/StatusStates";
import type { ProductColor, ProductGender, ProductListFilters, ProductSize } from "@/types/product";

const PAGE_SIZE = 12;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductListFilters = useMemo(
    () => ({
      page: Number(searchParams.get("pagina") ?? "1"),
      page_size: PAGE_SIZE,
      search: searchParams.get("busca") ?? undefined,
      product_category_id: searchParams.get("categoria") ?? undefined,
      gender: (searchParams.get("genero") as ProductGender | null) ?? undefined,
      size: (searchParams.get("tamanho") as ProductSize | null) ?? undefined,
      color: (searchParams.get("cor") as ProductColor | null) ?? undefined,
      in_stock_only: searchParams.get("estoque") === "1",
    }),
    [searchParams]
  );

  function updateFilters(next: ProductListFilters) {
    const params = new URLSearchParams();
    if (next.page && next.page > 1) params.set("pagina", String(next.page));
    if (next.search) params.set("busca", next.search);
    if (next.product_category_id) params.set("categoria", next.product_category_id);
    if (next.gender) params.set("genero", next.gender);
    if (next.size) params.set("tamanho", next.size);
    if (next.color) params.set("cor", next.color);
    if (next.in_stock_only) params.set("estoque", "1");
    setSearchParams(params);
  }

  const categoriesQuery = useQuery({
    queryKey: ["categories", "catalog"],
    queryFn: () => listCategories(1, 50),
  });

  const productsQuery = useQuery({
    queryKey: ["products", filters],
    queryFn: () => listProducts(filters),
    placeholderData: (prev) => prev, // mantém a grade visível trocando de página, sem "tela travada"
  });

  const activeCategory = categoriesQuery.data?.items.find(
    (c) => c.product_category_id === filters.product_category_id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Início", to: "/" },
          { label: activeCategory?.category_name ?? "Produtos" },
        ]}
      />

      <div className="mt-3 mb-8">
        <h1 className="font-display text-3xl text-ink">
          {filters.search ? `Resultados para "${filters.search}"` : activeCategory?.category_name ?? "Nossos Produtos"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {productsQuery.data ? `${productsQuery.data.total} produto(s) encontrado(s)` : "Carregando..."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters
          categories={categoriesQuery.data?.items ?? []}
          filters={filters}
          onChange={updateFilters}
        />

        <div>
          {productsQuery.isError && <ErrorState onRetry={() => productsQuery.refetch()} />}
          {!productsQuery.isError && (
            <>
              <ProductGrid products={productsQuery.data?.items ?? []} isLoading={productsQuery.isLoading} />
              {productsQuery.data && (
                <Pagination
                  page={productsQuery.data.page}
                  pages={productsQuery.data.pages}
                  onPageChange={(page) => updateFilters({ ...filters, page })}
                  isLoading={productsQuery.isFetching}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
