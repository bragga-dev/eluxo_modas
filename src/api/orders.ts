import { http } from "./client";
import type { Order, OrderCancelPayload, OrderCreatePayload } from "@/types/order";

/** POST /orders — checkout do carrinho. Exige perfil completo (nome, sobrenome, CPF, endereço). */
export async function createOrder(payload: OrderCreatePayload): Promise<Order> {
  const { data } = await http.post<Order>("/orders", payload);
  return data;
}

export async function listMyOrders(): Promise<Order[]> {
  const { data } = await http.get<Order[]>("/orders");
  return data;
}

export async function getMyOrder(orderId: string): Promise<Order> {
  const { data } = await http.get<Order>(`/orders/${orderId}`);
  return data;
}

export async function cancelMyOrder(orderId: string, payload?: OrderCancelPayload): Promise<Order> {
  const { data } = await http.post<Order>(`/orders/${orderId}/cancel`, payload ?? {});
  return data;
}
