import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import * as authApi from "@/api/auth";
import { setOnSessionExpired } from "@/api/client";
import { getAccessToken } from "@/api/tokenStore";
import type { AdminProfile, ClientOut, LoginPayload, Me, RegisterPayload } from "@/types/user";
import { ApiError } from "@/types/api";

interface AuthContextValue {
  me: Me | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  applyClientUpdate: (client: ClientOut) => void;
  applyAdminUpdate: (admin: AdminProfile) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const data = await authApi.fetchMe();
      setMe(data);
    } catch {
      setMe(null);
    }
  }, []);

  // Na primeira carga, não há access token em memória (foi perdido no
  // reload). Tenta trocar o refresh cookie httpOnly por um novo access
  // token antes de decidir se o usuário está deslogado.
  useEffect(() => {
    (async () => {
      try {
        await authApi.refreshSession();
        await refreshMe();
      } catch {
        setMe(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshMe]);

  useEffect(() => {
    setOnSessionExpired(() => setMe(null));
    return () => setOnSessionExpired(null);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await authApi.login(payload);
      await refreshMe();
    },
    [refreshMe]
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      await authApi.googleLogin({ id_token: idToken });
      await refreshMe();
    },
    [refreshMe]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload);
      await refreshMe();
    },
    [refreshMe]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Logout é idempotente no backend — mesmo se der erro de rede,
      // limpamos o estado local pra não travar o usuário "meio logado".
      if (!(error instanceof ApiError)) throw error;
    } finally {
      setMe(null);
    }
  }, []);

  const applyClientUpdate = useCallback((client: ClientOut) => {
    setMe((prev) =>
      prev
        ? {
            ...prev,
            client: {
              client_id: client.client_id,
              username: client.username,
              first_name: client.first_name,
              last_name: client.last_name,
              phone: client.phone,
              photo_url: client.photo_url,
              gender: client.gender,
              gender_label: client.gender_label,
              birth_date: client.birth_date,
              cpf: client.cpf,
            },
          }
        : prev
    );
  }, []);

  const applyAdminUpdate = useCallback((admin: AdminProfile) => {
    setMe((prev) => (prev ? { ...prev, admin } : prev));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      me,
      isLoading,
      isAuthenticated: Boolean(me) && Boolean(getAccessToken()),
      isAdmin: me?.user.role === "admin",
      login,
      loginWithGoogle,
      register,
      logout,
      refreshMe,
      applyClientUpdate,
      applyAdminUpdate,
    }),
    [me, isLoading, login, loginWithGoogle, register, logout, refreshMe, applyClientUpdate, applyAdminUpdate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}