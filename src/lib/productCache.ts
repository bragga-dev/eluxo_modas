import type { Product, ProductListItem } from "@/types/product";

/**
 * LIMITAÇÃO REAL DA API (não é invenção do frontend):
 * `CartItemOut` e `OrderItemOut` só trazem `variant` — sem nome do produto,
 * imagem ou product_id (ver luxury_fashion/apps/cart/schemas/cart_item_schema.py
 * e apps/payments/schemas/order_item_schema.py). O backend não expõe esse
 * dado nesses endpoints, então o carrinho/checkout/pedidos não têm como
 * mostrar "nome + foto do produto" usando só a resposta da API.
 *
 * Workaround 100% client-side: sempre que o usuário vê um produto (vitrine,
 * detalhe) ou adiciona uma variante ao carrinho, guardamos localmente
 * {product_id, product_name, image_url} indexado por variant_id. O carrinho
 * consulta esse cache pra exibir nome/imagem/link. Se a entrada não existir
 * (ex.: carrinho aberto pela 1ª vez num navegador novo, sem ter passado pela
 * vitrine), a UI cai para um cartão genérico baseado só no que a variante
 * informa (cor/tamanho/gênero) — nunca inventa um nome de produto.
 */

const STORAGE_KEY = "eluxo:product-cache:v1";
const MAX_ENTRIES = 300;

export interface CachedProductInfo {
  productId: string;
  productName: string;
  categoryName: string;
  imageUrl: string | null;
}

type CacheShape = Record<string, CachedProductInfo>;

function readCache(): CacheShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CacheShape) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: CacheShape): void {
  try {
    const entries = Object.entries(cache);
    const trimmed = entries.slice(Math.max(0, entries.length - MAX_ENTRIES));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(trimmed)));
  } catch {
    // Armazenamento indisponível (modo privado etc.) — segue sem cache.
  }
}

export function rememberProduct(product: Product | ProductListItem): void {
  const cache = readCache();
  const info: CachedProductInfo = {
    productId: product.product_id,
    productName: product.product_name,
    categoryName: product.category.category_name,
    imageUrl: product.cover_image?.product_image_url ?? null,
  };
  for (const variant of product.variants) {
    cache[variant.variant_id] = info;
  }
  writeCache(cache);
}

export function getCachedProductForVariant(variantId: string): CachedProductInfo | null {
  const cache = readCache();
  return cache[variantId] ?? null;
}
