/** Espelha PaymentBillingTypeEnum (payments/schemas/payment_schema.py). */
export type BillingType = "BOLETO" | "PIX" | "CREDIT_CARD";

/** Espelha PaymentStatusEnum. */
export type PaymentStatus =
  | "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "RECEIVED_IN_CASH"
  | "REFUND_REQUESTED" | "REFUND_IN_PROGRESS" | "CHARGEBACK_REQUESTED" | "CHARGEBACK_DISPUTE"
  | "AWAITING_CHARGEBACK_REVERSAL" | "DUNNING_REQUESTED" | "DUNNING_RECEIVED"
  | "AWAITING_RISK_ANALYSIS" | "CANCELLED";

/** Só é enviado quando billing_type === "CREDIT_CARD". Nunca é persistido pelo backend. */
export interface CreditCardInput {
  holder_name: string;
  number: string;
  expiry_month: string;
  expiry_year: string;
  ccv: string;
}

export interface CreditCardHolderInfo {
  name: string;
  email: string;
  cpf_cnpj: string;
  postal_code: string;
  address_number: string;
  phone?: string;
}

/** Payload de POST /orders/{order_id}/payments. */
export interface PaymentCreatePayload {
  billing_type: BillingType;
  credit_card?: CreditCardInput;
  credit_card_holder_info?: CreditCardHolderInfo;
}

/** Payload de POST /payments/{id}/refund. */
export interface RefundPayload {
  value?: number;
  description?: string;
}

/** Espelha PaymentOut. */
export interface Payment {
  payment_id: string;
  order_id: string;
  asaas_payment_id: string | null;
  value: string;
  billing_type: BillingType;
  status: PaymentStatus;
  due_date: string;
  description: string;
  invoice_url: string | null;
  bank_slip_url: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  payment_date: string | null;
  net_value: string | null;
  created_at: string;
}

export const BILLING_TYPE_LABELS: Record<BillingType, string> = {
  BOLETO: "Boleto Bancário",
  PIX: "Pix",
  CREDIT_CARD: "Cartão de Crédito",
};
