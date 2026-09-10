import { http } from "./client";
import type { Payment, PaymentCreatePayload, RefundPayload } from "@/types/payment";

export async function createPayment(orderId: string, payload: PaymentCreatePayload): Promise<Payment> {
  const { data } = await http.post<Payment>(`/orders/${orderId}/payments`, payload);
  return data;
}

export async function listOrderPayments(orderId: string): Promise<Payment[]> {
  const { data } = await http.get<Payment[]>(`/orders/${orderId}/payments`);
  return data;
}

export async function getPayment(paymentId: string): Promise<Payment> {
  const { data } = await http.get<Payment>(`/payments/${paymentId}`);
  return data;
}

export async function refundPayment(paymentId: string, payload: RefundPayload): Promise<Payment> {
  const { data } = await http.post<Payment>(`/payments/${paymentId}/refund`, payload);
  return data;
}
