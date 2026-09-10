/** Espelha BrazilianStateEnum (accounts/schemas/address_schema.py). */
export const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

/**
 * Espelha AddressOut. O backend devolve o `client` completo aninhado —
 * o front normalmente só precisa dos campos do próprio endereço.
 */
export interface Address {
  address_id: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: BrazilianState;
  state_label: string;
  country: string;
  is_preferential: boolean;
}

/** Payload de POST /address/my-addresses. */
export interface AddressCreatePayload {
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: BrazilianState;
  country?: string;
}

/** Payload de PATCH /address/my-addresses/{id}. */
export type AddressUpdatePayload = Partial<AddressCreatePayload>;
