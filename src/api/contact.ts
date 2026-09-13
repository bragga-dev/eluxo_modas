import { http } from "./client";
import type {
  ContactCreatePayload,
  ContactMessage,
  ContactUpdatePayload,
  ListContactsAdminParams,
} from "@/types/contact";
import type { Page } from "@/types/api";

/** POST /contact — público, formulário de "Fale Conosco". */
export async function sendContactMessage(payload: ContactCreatePayload): Promise<ContactMessage> {
  const { data } = await http.post<ContactMessage>("/contact/", payload);
  return data;
}

/** GET /contact — [Admin] lista paginada/filtrável. */
export async function listContactsAdmin(params: ListContactsAdminParams = {}): Promise<Page<ContactMessage>> {
  const { data } = await http.get<Page<ContactMessage>>("/contact/", { params });
  return data;
}

/** GET /contact/{id} — [Admin] detalhe. */
export async function getContactAdmin(contactId: string): Promise<ContactMessage> {
  const { data } = await http.get<ContactMessage>(`/contact/${contactId}`);
  return data;
}

/** PATCH /contact/{id} — [Admin] atualiza o status de moderação. */
export async function updateContactStatus(
  contactId: string,
  payload: ContactUpdatePayload
): Promise<ContactMessage> {
  const { data } = await http.patch<ContactMessage>(`/contact/${contactId}`, payload);
  return data;
}

/** DELETE /contact/{id} — [Admin] exclui a mensagem. */
export async function deleteContactAdmin(contactId: string): Promise<void> {
  await http.delete(`/contact/${contactId}`);
}