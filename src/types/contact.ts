/** Espelha ContactStatusEnum (website/schemas/contact_schema.py). */
export type ContactStatus = "pending" | "in_progress" | "resolved" | "archived";

/** Espelha ContactOut. */
export interface ContactMessage {
  contact_id: string;
  full_name: string;
  subject: string;
  message: string;
  email: string;
  phone: string;
  status: ContactStatus;
  status_label: string;
  created_at: string;
}

/** Payload de POST /contact — formulário público de "Fale Conosco". */
export interface ContactCreatePayload {
  full_name: string;
  subject: string;
  message: string;
  email: string;
  phone: string;
}

/** Payload de PATCH /contact/{id} — só o admin altera o status de moderação. */
export interface ContactUpdatePayload {
  status: ContactStatus;
}

/** Params de GET /contact (admin, paginado/filtrável). */
export interface ListContactsAdminParams {
  page?: number;
  page_size?: number;
  status?: ContactStatus;
  search?: string;
}