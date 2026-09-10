import { http } from "./client";
import { setAccessToken } from "./tokenStore";
import type {
  AccessTokenResponse,
  ChangePasswordPayload,
  ClientOut,
  ClientUpdatePayload,
  GoogleLoginPayload,
  LoginPayload,
  Me,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
  Session,
} from "@/types/user";

export async function login(payload: LoginPayload): Promise<AccessTokenResponse> {
  const { data } = await http.post<AccessTokenResponse>("/auth/login", payload);
  setAccessToken(data.access);
  return data;
}

export async function googleLogin(payload: GoogleLoginPayload): Promise<AccessTokenResponse> {
  const { data } = await http.post<AccessTokenResponse>("/auth/google", payload);
  setAccessToken(data.access);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AccessTokenResponse> {
  const { data } = await http.post<AccessTokenResponse>("/auth/register", payload);
  setAccessToken(data.access);
  return data;
}

export async function logout(): Promise<void> {
  await http.post("/auth/logout");
  setAccessToken(null);
}

export async function logoutAll(): Promise<void> {
  await http.post("/auth/logout-all");
  setAccessToken(null);
}

export async function refreshSession(): Promise<AccessTokenResponse> {
  const { data } = await http.post<AccessTokenResponse>("/auth/refresh");
  setAccessToken(data.access);
  return data;
}

export async function fetchMe(): Promise<Me> {
  const { data } = await http.get<Me>("/auth/me");
  return data;
}

export async function requestPasswordReset(payload: PasswordResetRequestPayload): Promise<void> {
  await http.post("/auth/password-reset/request", payload);
}

export async function confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<void> {
  await http.post("/auth/password-reset/confirm", payload);
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await http.post(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<AccessTokenResponse> {
  const { data } = await http.post<AccessTokenResponse>("/auth/change-password", payload);
  setAccessToken(data.access);
  return data;
}

export async function deleteMyAccount(password: string): Promise<void> {
  await http.delete("/auth/delete-account", { data: { password } });
  setAccessToken(null);
}

export async function exportMyData(): Promise<Record<string, unknown>> {
  const { data } = await http.get<Record<string, unknown>>("/auth/export-my-data");
  return data;
}

export async function updateClientProfile(payload: ClientUpdatePayload): Promise<ClientOut> {
  const { data } = await http.patch<ClientOut>("/auth/update-client-profile", payload);
  return data;
}

export async function uploadClientPhoto(photo: File): Promise<ClientOut> {
  const form = new FormData();
  form.append("photo", photo);
  const { data } = await http.post<ClientOut>("/auth/upload-client-photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteClientPhoto(): Promise<ClientOut> {
  const { data } = await http.delete<ClientOut>("/auth/delete-client-photo");
  return data;
}

export async function listSessions(): Promise<Session[]> {
  const { data } = await http.get<Session[]>("/auth/sessions");
  return data;
}

export async function revokeSession(sessionId: number): Promise<void> {
  await http.delete(`/auth/sessions/${sessionId}`);
}
