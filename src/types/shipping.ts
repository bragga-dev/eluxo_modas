/** Payload de POST /shipping/quote/{variant_id}. */
export interface ShippingQuotePayload {
  recipient_cep: string;
  quantity?: number;
}

/** Espelha FrenetShippingOptionOut (products/schemas/product_shipping_schema.py). */
export interface ShippingOption {
  carrier: string;
  service: string;
  service_code: string | null;
  price: string;
  delivery_time_days: number;
  error: boolean;
  error_message: string | null;
}
