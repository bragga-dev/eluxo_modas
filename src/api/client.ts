import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";
import { normalizeApiError } from "@/lib/errors";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true, // necessário pro cookie httpOnly de refresh ir/voltar
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fila de refresh: se várias requisições tomam 401 ao mesmo tempo, só a
 * primeira dispara POST /auth/refresh; as demais esperam o mesmo resultado
 * em vez de disparar refresh em paralelo (evitaria rotação de token em
 * corrida, já que /auth/refresh blacklista o refresh anterior a cada uso).
 */
let refreshPromise: Promise<string | null> | null = null;

/** Ligado pelo AuthContext para reagir quando a sessão cai de vez (refresh falhou). */
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ access: string }>(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        setAccessToken(res.data.access);
        return res.data.access;
      })
      .catch(() => {
        setAccessToken(null);
        onSessionExpired?.();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? "";

    // Nunca tenta refresh em cima do próprio /auth/login ou /auth/refresh —
    // evitaria loop infinito quando as credenciais/refresh já são inválidos.
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && config && !config._retry && !isAuthEndpoint) {
      config._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return http(config);
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);
