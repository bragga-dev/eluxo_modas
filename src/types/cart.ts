import type { ProductVariant } from "./product";

/**
 * Espelha CartItemOut (cart/schemas/cart_item_schema.py).
 *
 * LIMITAÇÃO REAL DA API: o item do carrinho só traz a `variant` (tamanho,
 * cor, gênero, preço, estoque) — não traz nome do produto, imagem nem
 * product_id. Não existe esse dado no contrato do backend. Por isso o
 * carrinho/checkout usa o cache local em lib/productCache.ts, alimentado
 * quando o usuário visita a página do produto ou adiciona ao carrinho, pra
 * conseguir mostrar nome/imagem/link do produto sem inventar campos que a
 * API não retorna. Se o cache não tiver a entrada (ex.: carrinho aberto em
 * outro dispositivo), a UI cai para um estado "produto" genérico com base
 * só no que a variante informa (cor/tamanho/gênero).
 */
export interface CartItem {
  cart_item_id: string;
  variant: ProductVariant;
  quantity_item: number;
  unit_price_item: string;
  shipping_type: string | null;
  shipping_value: string;
  subtotal: string;
}

/** Espelha CartOut (cart/schemas/cart_schema.py). */
export interface Cart {
  cart_id: string;
  items: CartItem[];
  total_price: string;
  total_shipping: string;
  total_geral: string;
}

/** Payload de POST /cart/items. */
export interface CartItemCreatePayload {
  variant_id: string;
  quantity_item?: number;
}

/** Payload de PATCH /cart/items/{id}. */
export interface CartItemUpdatePayload {
  quantity_item: number;
}
