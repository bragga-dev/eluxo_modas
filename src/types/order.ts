import type { ProductVariant } from "./product";

/** Espelha StatusOrderEnum (payments/schemas/order_schema.py). */
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "FAILED";

/** Espelha OrderItemOut (payments/schemas/order_item_schema.py). Mesma limitação do CartItem — ver types/cart.ts. */
export interface OrderItem {
  order_item_id: string;
  variant: ProductVariant;
  order_item_quantity: number;
  order_item_price: string;
  subtotal: string;
}

/** Espelha OrderOut. */
export interface Order {
  order_id: string;
  code: string;
  order_status: OrderStatus;
  order_status_label: string;
  items: OrderItem[];
  subtotal: string;
  order_shipping_total: string;
  total_geral: string;
  shipping_address_id: string;
  created_at: string;
  updated_at: string;
}

/** Payload de POST /orders. */
export interface OrderCreatePayload {
  shipping_address_id: string;
}

/** Payload de POST /orders/{id}/cancel. */
export interface OrderCancelPayload {
  reason?: string;
}

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-gold-light/20 text-gold-dark",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-neutral-200 text-neutral-600",
  REFUNDED: "bg-blue-100 text-blue-700",
  FAILED: "bg-red-100 text-red-700",
};
