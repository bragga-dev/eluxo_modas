import { http } from "./client";
import type {
  AdminProfile,
  AdminProfileUpdatePayload,
  ListUsersAdminParams,
  User,
  UserAdmin,
} from "@/types/user";
import type { Page } from "@/types/api";

// ── Perfil do Admin logado (auth/) ──────────────────────────────────────────

export async function updateAdminProfile(payload: AdminProfileUpdatePayload): Promise<AdminProfile> {
  const { data } = await http.patch<AdminProfile>("/auth/update-admin-profile", payload);
  return data;
}

export async function uploadAdminPhoto(photo: File): Promise<AdminProfile> {
  const form = new FormData();
  form.append("photo", photo);
  const { data } = await http.post<AdminProfile>("/auth/upload-admin-photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAdminPhoto(): Promise<AdminProfile> {
  const { data } = await http.delete<AdminProfile>("/auth/delete-admin-photo");
  return data;
}

// ── Gestão de usuários (admin/) ─────────────────────────────────────────────

export async function listUsersAdmin(params: ListUsersAdminParams = {}): Promise<Page<UserAdmin>> {
  const { data } = await http.get<Page<UserAdmin>>("/admin/list-users", { params });
  return data;
}

export async function getUserAdmin(userId: string): Promise<UserAdmin> {
  const { data } = await http.get<UserAdmin>(`/admin/detail-user/${userId}`);
  return data;
}

export async function deactivateUser(userId: string): Promise<User> {
  const { data } = await http.post<User>(`/auth/deactive-user/${userId}`);
  return data;
}

export async function reactivateUser(userId: string): Promise<User> {
  const { data } = await http.post<User>(`/auth/reactivate-user/${userId}`);
  return data;
}