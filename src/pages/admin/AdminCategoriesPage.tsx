import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as categoriesApi from "@/api/categories";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApiError } from "@/types/api";
import type { Category } from "@/types/category";

export function AdminCategoriesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => categoriesApi.listCategoriesAdmin(1, 100),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["admin-categories-options"] });
  }

  const toggleActiveMutation = useMutation({
    mutationFn: (category: Category) =>
      category.is_active
        ? categoriesApi.deactivateCategory(category.product_category_id)
        : categoriesApi.activateCategory(category.product_category_id),
    onSuccess: () => {
      showToast("Status atualizado.", "success");
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => categoriesApi.deleteCategory(categoryId),
    onSuccess: () => {
      showToast("Categoria excluída.", "success");
      invalidate();
      setPendingDelete(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  const categories = categoriesQuery.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Categorias</h2>
          <p className="mt-1 text-sm text-ink/50">Organize o catálogo por categoria.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Nova categoria
        </Button>
      </div>

      {categoriesQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : categoriesQuery.isError ? (
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState title="Nenhuma categoria cadastrada" description="Crie a primeira categoria do catálogo." />
      ) : (
        <div className="flex flex-col divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
          {categories.map((category) => (
            <div key={category.product_category_id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-black/5">
                {category.category_image_url && (
                  <img src={category.category_image_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{category.category_name}</p>
              <Badge className={category.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
                {category.is_active ? "Ativa" : "Inativa"}
              </Badge>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={toggleActiveMutation.isPending}
                  onClick={() => toggleActiveMutation.mutate(category)}
                >
                  {category.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(category);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => setPendingDelete(category)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        isOpen={modalOpen}
        category={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          invalidate();
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${pendingDelete?.category_name}"? Categorias com produtos vinculados não podem ser excluídas.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.product_category_id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function CategoryFormModal({
  isOpen,
  category,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const [name, setName] = useState(category?.category_name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastCategoryId, setLastCategoryId] = useState<string | null | undefined>(undefined);

  if (isOpen && (category?.product_category_id ?? null) !== lastCategoryId) {
    setLastCategoryId(category?.product_category_id ?? null);
    setName(category?.category_name ?? "");
    setImage(null);
    setFieldErrors({});
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const saved = category
        ? await categoriesApi.updateCategory(category.product_category_id, { category_name: name })
        : await categoriesApi.createCategory({ category_name: name });
      if (image) {
        await categoriesApi.uploadCategoryImage(saved.product_category_id, image);
      }
      return saved;
    },
    onSuccess: () => {
      showToast(category ? "Categoria atualizada." : "Categoria criada.", "success");
      onSaved();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.detail, "error");
        setFieldErrors(error.fieldErrors ?? {});
      } else {
        showToast("Não foi possível salvar a categoria.", "error");
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? "Editar categoria" : "Nova categoria"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="flex flex-col gap-4"
      >
        <Input
          label="Nome da categoria"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.category_name}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Imagem</label>
          {category?.category_image_url && !image && (
            <img src={category.category_image_url} alt="" className="mb-2 h-16 w-16 rounded-lg object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="text-sm text-ink/70"
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {category ? "Salvar" : "Criar categoria"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}