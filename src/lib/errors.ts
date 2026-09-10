import axios from "axios";
import { ApiError } from "@/types/api";

/**
 * Mensagens padrão por status HTTP, usadas quando a resposta não trouxe
 * `detail` (ex.: erro de rede, timeout, 500 sem DEBUG). Os status reais
 * (400/401/403/404/409/422/429/500) seguem o exception_handler global de
 * config/api.py.
 */
const STATUS_FALLBACK: Record<number, string> = {
  400: "Não foi possível processar a solicitação.",
  401: "Sessão expirada. Faça login novamente.",
  403: "Você não tem permissão para essa ação.",
  404: "Não encontramos o que você procurava.",
  409: "Essa ação não pode ser concluída no momento.",
  422: "Alguns campos precisam de correção.",
  429: "Muitas tentativas. Aguarde um instante e tente de novo.",
  500: "Erro interno do servidor. Tente novamente em instantes.",
};

/**
 * Normaliza qualquer erro de requisição num ApiError consistente,
 * extraindo `detail` (MessageOut) ou a lista de erros de campo (422).
 */
export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return new ApiError(0, error.message);
    }
    return new ApiError(0, "Erro inesperado.");
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError(0, "A requisição demorou demais. Verifique sua conexão.");
  }

  if (!error.response) {
    return new ApiError(0, "Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  const { status, data } = error.response;

  // 422 — lista de erros de validação do pydantic
  if (status === 422 && data && Array.isArray(data.detail)) {
    const fieldErrors: Record<string, string> = {};
    for (const item of data.detail) {
      const field = Array.isArray(item.loc) ? String(item.loc[item.loc.length - 1]) : "form";
      fieldErrors[field] = item.msg;
    }
    const firstMessage = data.detail[0]?.msg ?? STATUS_FALLBACK[422];
    return new ApiError(422, firstMessage, fieldErrors);
  }

  const detail =
    (data && typeof data.detail === "string" && data.detail) ||
    STATUS_FALLBACK[status] ||
    "Ocorreu um erro inesperado.";

  return new ApiError(status, detail);
}
