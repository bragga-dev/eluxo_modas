import { http } from "./client";
import type { Cart, CartItemCreatePayload, CartItemUpdatePayload } from "@/types/cart";

export async function getMyCart(): Promise<Cart> {
  const { data } = await http.get<Cart>("/cart/");
  return data;
}

export async function clearMyCart(): Promise<Cart> {
  const { data } = await http.delete<Cart>("/cart/");
  return data;
}

export async function addCartItem(payload: CartItemCreatePayload): Promise<Cart> {
  const { data } = await http.post<Cart>("/cart/items", payload);
  return data;
}

export async function updateCartItem(cartItemId: string, payload: CartItemUpdatePayload): Promise<Cart> {
  const { data } = await http.patch<Cart>(`/cart/items/${cartItemId}`, payload);
  return data;
}

export async function removeCartItem(cartItemId: string): Promise<Cart> {
  const { data } = await http.delete<Cart>(`/cart/items/${cartItemId}`);
  return data;
}
