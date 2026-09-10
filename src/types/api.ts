/**
 * Espelha PageOut[T] (luxury_fashion/apps/core/schemas/deafult_schema.py).
 */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

/**
 * Espelha MessageOut — formato padrão de erro da API (400/401/403/404/409/500).
 */
export interface ApiMessage {
  detail: string;
}

/**
 * Formato do 422 (ninja.errors.ValidationError) — lista de erros de validação
 * do pydantic, devolvida pelo exception_handler global em config/api.py.
 */
export interface ApiValidationError {
  detail: Array<{
    type: string;
    loc: (string | number)[];
    msg: string;
    ctx?: Record<string, unknown>;
  }>;
}

/** Erro normalizado que a camada de API sempre lança (ver lib/errors.ts). */
export class ApiError extends Error {
  status: number;
  detail: string;
  fieldErrors?: Record<string, string>;

  constructor(status: number, detail: string, fieldErrors?: Record<string, string>) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}
