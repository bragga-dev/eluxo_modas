import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct, listProducts } from "@/api/products";
import { quoteShipping } from "@/api/shipping";
import { rememberProduct } from "@/lib/productCache";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/StatusStates";
import { PRODUCT_GENDER_LABELS, type ProductVariant } from "@/types/product";
import { formatCep, formatCurrency } from "@/lib/formatters";
import type { ShippingOption } from "@/types/shipping";
import { ApiError } from "@/types/api";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId as string),
    enabled: Boolean(productId),
  });

  const product = productQuery.data;

  useEffect(() => {
    if (product) {
      rememberProduct(product);
      setSelectedVariant(null);
      setQuantity(1);
      setShippingOptions(null);
    }
  }, [product]);

  const relatedQuery = useQuery({
    queryKey: ["products", "related", product?.category.product_category_id],
    queryFn: () =>
      listProducts({ product_category_id: product?.category.product_category_id, page_size: 5, in_stock_only: true }),
    enabled: Boolean(product),
  });

  if (productQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Produto não encontrado"
          description="Esse produto pode ter sido removido ou o link está incorreto."
          onRetry={() => productQuery.refetch()}
        />
      </div>
    );
  }

  async function handleAddToCart() {
    if (!selectedVariant) {
      showToast("Selecione as opções do produto.", "error");
      return;
    }
    if (!isAuthenticated) {
      showToast("Entre na sua conta para adicionar produtos à sacola.", "error");
      return;
    }
    setIsAdding(true);
    try {
      await addItem({ variant_id: selectedVariant.variant_id, quantity_item: quantity });
    } finally {
      setIsAdding(false);
    }
  }

  async function handleQuoteShipping() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      showToast("Informe um CEP válido.", "error");
      return;
    }
    if (!selectedVariant) {
      showToast("Selecione as opções do produto antes de calcular o frete.", "error");
      return;
    }
    setIsQuoting(true);
    setShippingOptions(null);
    try {
      const options = await quoteShipping(selectedVariant.variant_id, { recipient_cep: digits, quantity });
      setShippingOptions(options);
    } catch (error) {
      const message = error instanceof ApiError ? error.detail : "Não foi possível calcular o frete agora.";
      showToast(message, "error");
    } finally {
      setIsQuoting(false);
    }
  }

  const relatedProducts = (relatedQuery.data?.items ?? []).filter((p) => p.product_id !== product.product_id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Início", to: "/" },
          { label: product.category.category_name, to: `/produtos?categoria=${product.category.product_category_id}` },
          { label: product.product_name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.product_name} />

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase tracking-wide text-ink/50">{product.category.category_name}</span>
            <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl">{product.product_name}</h1>
          </div>

          <ProductPrice minPrice={product.min_price} maxPrice={product.max_price} />

          {selectedVariant?.gender && (
            <span className="text-xs text-ink/50">{PRODUCT_GENDER_LABELS[selectedVariant.gender]}</span>
          )}

          {selectedVariant?.description && <p className="text-sm text-ink/70">{selectedVariant.description}</p>}

          <VariantSelector variants={product.variants} onSelect={setSelectedVariant} />

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Quantidade</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={selectedVariant?.stock ?? 99}
              disabled={!selectedVariant}
            />
          </div>

          <Button
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            isLoading={isAdding}
            disabled={!selectedVariant || !selectedVariant.in_stock}
          >
            {selectedVariant && !selectedVariant.in_stock ? "Sem estoque" : "Adicionar à sacola"}
          </Button>

          {!isAuthenticated && (
            <p className="text-xs text-ink/50">
              <Link to="/entrar" className="text-gold-dark underline">
                Entre na sua conta
              </Link>{" "}
              para comprar.
            </p>
          )}

          <div className="rounded-lg border border-black/10 p-4">
            <span className="mb-2 block text-sm font-medium text-ink">Calcular frete</span>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(formatCep(e.target.value))}
                placeholder="00000-000"
                inputMode="numeric"
                maxLength={9}
                aria-label="CEP de entrega"
                className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
              <Button variant="outline" onClick={handleQuoteShipping} isLoading={isQuoting}>
                Calcular
              </Button>
            </div>

            {shippingOptions && shippingOptions.length === 0 && (
              <p className="mt-3 text-sm text-ink/60">Nenhuma opção de frete encontrada para esse CEP.</p>
            )}
            {shippingOptions && shippingOptions.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {shippingOptions.map((option, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <span className="text-ink/80">
                      {option.carrier} — {option.service}
                      {!option.error && ` (${option.delivery_time_days} dia(s) úteis)`}
                    </span>
                    <span className="font-medium text-ink">
                      {option.error ? "Indisponível" : formatCurrency(option.price)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl text-ink">Você também pode gostar</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
