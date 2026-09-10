/** Espelha UserRoleEnum (accounts/schemas/user_schema.py). */
export type UserRole = "admin" | "client";

/** Espelha UserOut. */
export interface User {
  user_id: string;
  email: string;
  role: UserRole;
  is_trusty: boolean;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  role_label?: string | null;
}

/**
 * Espelha GenderEnum (accounts/schemas/client_schema.py), que por sua vez
 * espelha core/constants/gender.py — os valores reais são em PT-BR.
 */
export type Gender = "Masculino" | "Feminino" | "Outro";

/** Espelha ClientProfileOut (accounts/schemas/me_schema.py). */
export interface ClientProfile {
  client_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  photo_url: string | null;
  gender: Gender;
  gender_label: string;
  birth_date: string | null;
  cpf: string | null;
}

/** Espelha MeOut. */
export interface Me {
  user: User;
  client: ClientProfile | null;
}

/**
 * Espelha ClientOut (accounts/schemas/client_schema.py) — usado nas respostas
 * de update-client-profile / upload-client-photo / delete-client-photo.
 * Diferente de ClientProfile (que vem só dentro de MeOut/GET /auth/me):
 * aqui o `user` completo (UserOut) vem aninhado.
 */
export interface ClientOut {
  client_id: string;
  user: User;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  photo_url: string | null;
  gender: Gender;
  gender_label: string;
  birth_date: string | null;
  cpf: string | null;
}

/** Espelha AccessTokenOut — único formato de resposta dos endpoints de auth. */
export interface AccessTokenResponse {
  access: string;
}

/** Payload de POST /auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Payload de POST /auth/register. */
export interface RegisterPayload {
  email: string;
  password: string;
  password2: string;
}

/** Payload de POST /auth/google. */
export interface GoogleLoginPayload {
  id_token: string;
}

/** Payload de POST /auth/change-password. */
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password2: string;
}

/** Payload de POST /auth/password-reset/request. */
export interface PasswordResetRequestPayload {
  email: string;
}

/** Payload de POST /auth/password-reset/confirm. */
export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
  new_password2: string;
}

/** Payload de PATCH /auth/update-client-profile. */
export interface ClientUpdatePayload {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  phone?: string;
  birth_date?: string;
  cpf?: string;
}

/** Espelha SessionOut. */
export interface Session {
  id: number;
  created_at: string | null;
  expires_at: string;
  device: string | null;
}
