import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productsApi from "@/api/products";
import * as categoriesApi from "@/api/categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatCurrency } from "@/lib/formatters";
import { ApiError } from "@/types/api";

const PAGE_SIZE = 20;

export function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const debouncedSearch = useDebounce(search);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-options"],
    queryFn: () => categoriesApi.listCategoriesAdmin(1, 100),
  });

  const productsQuery = useQuery({
    queryKey: ["admin-products", debouncedSearch, categoryId, status, page],
    queryFn: () =>
      productsApi.listProductsAdmin({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        product_category_id: categoryId || undefined,
        active_only: status === "" ? undefined : status === "active",
      }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? productsApi.deactivateProduct(id) : productsApi.activateProduct(id),
    onSuccess: () => {
      showToast("Status do produto atualizado.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      showToast("Produto excluído.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setPendingDelete(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  const products = productsQuery.data?.items ?? [];
  const categoryOptions = (categoriesQuery.data?.items ?? []).map((c) => ({
    value: c.product_category_id,
    label: c.category_name,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Produtos</h2>
          <p className="mt-1 text-sm text-ink/50">Cadastre, edite e gerencie o catálogo.</p>
        </div>
        <Link to="/admin/produtos/novo">
          <Button>Novo produto</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Buscar"
          placeholder="Nome do produto"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          label="Categoria"
          placeholder="Todas"
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value);
          }}
        />
        <Select
          label="Status"
          placeholder="Todos"
          options={[
            { value: "active", label: "Ativos" },
            { value: "inactive", label: "Inativos" },
          ]}
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as "" | "active" | "inactive");
          }}
        />
      </div>

      {productsQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : productsQuery.isError ? (
        <ErrorState onRetry={() => productsQuery.refetch()} />
      ) : products.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado" description="Ajuste os filtros ou cadastre um novo produto." />
      ) : (
        <div className="flex flex-col divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
          {products.map((product) => (
            <div key={product.product_id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-black/5">
                {product.cover_image ? (
                  <img
                    src={product.cover_image.product_image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink/30">Sem foto</div>
                )}
              </div>

              <Link to={`/admin/produtos/${product.product_id}`} className="min-w-0 flex-1 hover:underline">
                <p className="truncate text-sm font-medium text-ink">{product.product_name}</p>
                <p className="truncate text-xs text-ink/50">{product.category.category_name}</p>
              </Link>

              <span className="hidden text-sm text-ink/70 sm:block">
                {product.min_price
                  ? product.min_price === product.max_price
                    ? formatCurrency(product.min_price)
                    : `${formatCurrency(product.min_price)} – ${formatCurrency(product.max_price ?? product.min_price)}`
                  : "Sem variantes"}
              </span>

              <Badge className={product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                {product.in_stock ? "Em estoque" : "Sem estoque"}
              </Badge>

              <Badge className={product.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
                {product.is_active ? "Ativo" : "Inativo"}
              </Badge>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={toggleActiveMutation.isPending}
                  onClick={() =>
                    toggleActiveMutation.mutate({ id: product.product_id, isActive: product.is_active })
                  }
                >
                  {product.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Link to={`/admin/produtos/${product.product_id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setPendingDelete({ id: product.product_id, name: product.product_name })}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {productsQuery.data && (
        <Pagination
          page={productsQuery.data.page}
          pages={productsQuery.data.pages}
          onPageChange={setPage}
          isLoading={productsQuery.isFetching}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${pendingDelete?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}