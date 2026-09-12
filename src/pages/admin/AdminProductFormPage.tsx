import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productsApi from "@/api/products";
import * as categoriesApi from "@/api/categories";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Overlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { ImageGalleryManager } from "@/components/admin/ImageGalleryManager";
import { formatCurrency } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import {
  PRODUCT_COLOR_LABELS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_LABELS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_SIZE_OPTIONS,
  type ProductColor,
  type ProductGender,
  type ProductSize,
  type ProductVariant,
  type VariantCreatePayload,
} from "@/types/product";

const SIZE_OPTIONS = [{ value: "", label: "Sem tamanho" }, ...PRODUCT_SIZE_OPTIONS.map((s) => ({ value: s, label: s }))];
const COLOR_OPTIONS = [
  { value: "", label: "Sem cor" },
  ...PRODUCT_COLOR_OPTIONS.map((c) => ({ value: c, label: PRODUCT_COLOR_LABELS[c] })),
];
const GENDER_OPTIONS = [
  { value: "", label: "Sem gênero" },
  ...PRODUCT_GENDER_OPTIONS.map((g) => ({ value: g, label: PRODUCT_GENDER_LABELS[g] })),
];

export function AdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  return productId ? <EditProduct productId={productId} /> : <CreateProduct />;
}

// ═══════════════════════════════════════════════════════════════════════════
// Criação — produto + 1ª variante + frete + imagens numa única chamada
// ═══════════════════════════════════════════════════════════════════════════

function CreateProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-options"],
    queryFn: () => categoriesApi.listCategoriesAdmin(1, 100),
  });

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [size, setSize] = useState<ProductSize | "">("");
  const [color, setColor] = useState<ProductColor | "">("");
  const [gender, setGender] = useState<ProductGender | "">("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [images, setImages] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: () =>
      productsApi.createProductFull(
        {
          product_name: name,
          product_category_id: categoryId,
          variant: {
            size: size || null,
            color: color || null,
            gender: gender || null,
            price,
            stock: Number(stock),
            description,
          },
          shipping: { weight, height, width, length, quantity: Number(quantity) },
        },
        images,
        coverIndex
      ),
    onSuccess: (product) => {
      showToast("Produto criado com sucesso.", "success");
      navigate(`/admin/produtos/${product.product_id}`, { replace: true });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.detail, "error");
        setFieldErrors(error.fieldErrors ?? {});
      } else {
        showToast("Não foi possível criar o produto.", "error");
      }
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/produtos" className="text-sm font-medium text-ink/60 hover:text-ink">
        ← Voltar para produtos
      </Link>

      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Novo produto</h2>
        <p className="mt-1 text-sm text-ink/50">
          Cadastre o produto com a primeira variante e o frete. Mais variantes e imagens podem ser adicionadas depois.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-xl border border-black/8 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome do produto"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.product_name}
          />
          <Select
            label="Categoria"
            required
            placeholder="Selecione"
            options={(categoriesQuery.data?.items ?? []).map((c) => ({
              value: c.product_category_id,
              label: c.category_name,
            }))}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            error={fieldErrors.product_category_id}
          />
        </div>

        <div className="border-t border-black/8 pt-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Primeira variante</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Tamanho" options={SIZE_OPTIONS} value={size} onChange={(e) => setSize(e.target.value as ProductSize | "")} />
            <Select label="Cor" options={COLOR_OPTIONS} value={color} onChange={(e) => setColor(e.target.value as ProductColor | "")} />
            <Select label="Gênero" options={GENDER_OPTIONS} value={gender} onChange={(e) => setGender(e.target.value as ProductGender | "")} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Preço (R$)"
              required
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={fieldErrors.price}
            />
            <Input
              label="Estoque"
              required
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              error={fieldErrors.stock}
            />
          </div>
          <div className="mt-4">
            <Textarea label="Descrição da variante" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="border-t border-black/8 pt-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Frete (peso e dimensões da embalagem)</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Peso (kg)" required inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Input label="Altura (cm)" required inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Input label="Largura (cm)" required inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
            <Input label="Comprimento (cm)" required inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="mt-4 max-w-[160px]">
            <Input label="Quantidade" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
        </div>

        <div className="border-t border-black/8 pt-5">
          <h3 className="mb-2 text-sm font-semibold text-ink">Imagens</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setImages(files);
              setCoverIndex(0);
            }}
            className="text-sm text-ink/70"
          />
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((file, index) => (
                <button
                  type="button"
                  key={`${file.name}-${index}`}
                  onClick={() => setCoverIndex(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    coverIndex === index ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                  {coverIndex === index && (
                    <span className="absolute bottom-0 left-0 right-0 bg-gold py-0.5 text-center text-[10px] font-semibold text-white">
                      Capa
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-black/8 pt-5">
          <Button type="submit" isLoading={createMutation.isPending}>
            Criar produto
          </Button>
        </div>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Edição — dados básicos + variantes + imagens
// ═══════════════════════════════════════════════════════════════════════════

function EditProduct({ productId }: { productId: string }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => productsApi.getProduct(productId),
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories-options"],
    queryFn: () => categoriesApi.listCategoriesAdmin(1, 100),
  });
  const variantsQuery = useQuery({
    queryKey: ["admin-product-variants", productId],
    queryFn: () => productsApi.listProductVariants(productId, false),
  });
  const imagesQuery = useQuery({
    queryKey: ["admin-product-images", productId],
    queryFn: () => productsApi.listProductImages(productId),
  });

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [nameDirty, setNameDirty] = useState(false);

  const product = productQuery.data;
  if (product && !nameDirty && name === "" && categoryId === "") {
    // hidrata o form assim que o produto chega (sem sobrescrever edições em andamento)
    setName(product.product_name);
    setCategoryId(product.category.product_category_id);
  }

  const updateMutation = useMutation({
    mutationFn: () => productsApi.updateProduct(productId, { product_name: name, product_category_id: categoryId }),
    onSuccess: () => {
      showToast("Produto atualizado.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível salvar.", "error"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () =>
      product?.is_active ? productsApi.deactivateProduct(productId) : productsApi.activateProduct(productId),
    onSuccess: () => {
      showToast("Status atualizado.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => productsApi.uploadProductImage(productId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product-images", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível enviar a imagem.", "error"),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => productsApi.deleteProductImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product-images", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir a imagem.", "error"),
  });

  const setCoverImageMutation = useMutation({
    mutationFn: (imageId: string) => productsApi.setCoverProductImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-product-images", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível definir a capa.", "error"),
  });

  if (productQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return <ErrorState onRetry={() => productQuery.refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/produtos" className="text-sm font-medium text-ink/60 hover:text-ink">
        ← Voltar para produtos
      </Link>

      <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">{product.product_name}</h2>
          <Badge className={product.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
            {product.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <Button
          variant={product.is_active ? "danger" : "primary"}
          isLoading={toggleActiveMutation.isPending}
          onClick={() => toggleActiveMutation.mutate()}
        >
          {product.is_active ? "Desativar produto" : "Ativar produto"}
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
        className="flex flex-col gap-4 rounded-xl border border-black/8 bg-white p-6"
      >
        <h3 className="text-sm font-semibold text-ink">Dados gerais</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome do produto"
            required
            value={name}
            onChange={(e) => {
              setNameDirty(true);
              setName(e.target.value);
            }}
          />
          <Select
            label="Categoria"
            required
            options={(categoriesQuery.data?.items ?? []).map((c) => ({
              value: c.product_category_id,
              label: c.category_name,
            }))}
            value={categoryId}
            onChange={(e) => {
              setNameDirty(true);
              setCategoryId(e.target.value);
            }}
          />
        </div>
        <div>
          <Button type="submit" size="sm" isLoading={updateMutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>

      <div className="rounded-xl border border-black/8 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-ink">Imagens</h3>
        <ImageGalleryManager
          images={(imagesQuery.data ?? []).map((img) => ({
            id: img.image_id,
            url: img.product_image_url,
            is_cover: img.is_cover,
          }))}
          onUpload={(file) => uploadImageMutation.mutateAsync(file)}
          onDelete={(id) => deleteImageMutation.mutateAsync(id)}
          onSetCover={(id) => setCoverImageMutation.mutateAsync(id)}
        />
      </div>

      <VariantsSection productId={productId} variants={variantsQuery.data ?? []} isLoading={variantsQuery.isLoading} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Variantes — lista + modal de criação/edição
// ═══════════════════════════════════════════════════════════════════════════

function VariantsSection({
  productId,
  variants,
  isLoading,
}: {
  productId: string;
  variants: ProductVariant[];
  isLoading: boolean;
}) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProductVariant | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-product-variants", productId] });
    queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  }

  const toggleActiveMutation = useMutation({
    mutationFn: (variant: ProductVariant) =>
      variant.is_active
        ? productsApi.deactivateProductVariant(variant.variant_id)
        : productsApi.activateProductVariant(variant.variant_id),
    onSuccess: invalidate,
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (variantId: string) => productsApi.deleteProductVariant(variantId),
    onSuccess: () => {
      invalidate();
      setPendingDelete(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(variant: ProductVariant) {
    setEditing(variant);
    setModalOpen(true);
  }

  return (
    <div className="rounded-xl border border-black/8 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Variantes</h3>
        <Button size="sm" variant="outline" onClick={openCreate}>
          Adicionar variante
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : variants.length === 0 ? (
        <p className="text-sm text-ink/50">Nenhuma variante cadastrada ainda.</p>
      ) : (
        <div className="flex flex-col divide-y divide-black/8">
          {variants.map((variant) => (
            <div key={variant.variant_id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="flex flex-wrap gap-1.5">
                {variant.size && <Badge className="bg-black/5 text-ink/70">{variant.size}</Badge>}
                {variant.color && (
                  <Badge className="bg-black/5 text-ink/70">
                    {PRODUCT_COLOR_LABELS[variant.color as ProductColor] ?? variant.color}
                  </Badge>
                )}
                {variant.gender && (
                  <Badge className="bg-black/5 text-ink/70">
                    {PRODUCT_GENDER_LABELS[variant.gender as ProductGender] ?? variant.gender}
                  </Badge>
                )}
              </div>
              <span className="text-sm font-medium text-ink">{formatCurrency(variant.price)}</span>
              <span className="text-xs text-ink/50">Estoque: {variant.stock}</span>
              <Badge className={variant.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
                {variant.is_active ? "Ativa" : "Inativa"}
              </Badge>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(variant)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={toggleActiveMutation.isPending}
                  onClick={() => toggleActiveMutation.mutate(variant)}
                >
                  {variant.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Button variant="danger" size="sm" onClick={() => setPendingDelete(variant)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <VariantFormModal
        isOpen={modalOpen}
        productId={productId}
        variant={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          invalidate();
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir variante"
        description="Tem certeza que deseja excluir essa variante? Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.variant_id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function VariantFormModal({
  isOpen,
  productId,
  variant,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  productId: string;
  variant: ProductVariant | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const [size, setSize] = useState<ProductSize | "">((variant?.size as ProductSize) ?? "");
  const [color, setColor] = useState<ProductColor | "">((variant?.color as ProductColor) ?? "");
  const [gender, setGender] = useState<ProductGender | "">((variant?.gender as ProductGender) ?? "");
  const [price, setPrice] = useState(variant?.price ?? "");
  const [stock, setStock] = useState(String(variant?.stock ?? 0));
  const [description, setDescription] = useState(variant?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Ressincroniza os campos sempre que o modal é (re)aberto com uma variante diferente.
  const [lastVariantId, setLastVariantId] = useState<string | null | undefined>(undefined);
  if (isOpen && variant?.variant_id !== lastVariantId) {
    setLastVariantId(variant?.variant_id ?? null);
    setSize((variant?.size as ProductSize) ?? "");
    setColor((variant?.color as ProductColor) ?? "");
    setGender((variant?.gender as ProductGender) ?? "");
    setPrice(variant?.price ?? "");
    setStock(String(variant?.stock ?? 0));
    setDescription(variant?.description ?? "");
    setFieldErrors({});
  }

  const mutation = useMutation({
    mutationFn: () => {
      const payload: VariantCreatePayload = {
        size: size || null,
        color: color || null,
        gender: gender || null,
        price,
        stock: Number(stock),
        description,
      };
      return variant
        ? productsApi.updateProductVariant(variant.variant_id, payload)
        : productsApi.createProductVariant(productId, payload);
    },
    onSuccess: () => {
      showToast(variant ? "Variante atualizada." : "Variante criada.", "success");
      onSaved();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.detail, "error");
        setFieldErrors(error.fieldErrors ?? {});
      } else {
        showToast("Não foi possível salvar a variante.", "error");
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={variant ? "Editar variante" : "Nova variante"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Tamanho" options={SIZE_OPTIONS} value={size} onChange={(e) => setSize(e.target.value as ProductSize | "")} />
          <Select label="Cor" options={COLOR_OPTIONS} value={color} onChange={(e) => setColor(e.target.value as ProductColor | "")} />
          <Select label="Gênero" options={GENDER_OPTIONS} value={gender} onChange={(e) => setGender(e.target.value as ProductGender | "")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço (R$)"
            required
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={fieldErrors.price}
          />
          <Input
            label="Estoque"
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={fieldErrors.stock}
          />
        </div>
        <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {variant ? "Salvar" : "Criar variante"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}