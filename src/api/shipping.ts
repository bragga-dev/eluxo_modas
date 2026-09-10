import { http } from "./client";
import type { ShippingOption, ShippingQuotePayload } from "@/types/shipping";

/** POST /shipping/quote/{variant_id} — público, não exige login. */
export async function quoteShipping(
  variantId: string,
  payload: ShippingQuotePayload
): Promise<ShippingOption[]> {
  const { data } = await http.post<ShippingOption[]>(`/shipping/quote/${variantId}`, payload);
  return data;
}
