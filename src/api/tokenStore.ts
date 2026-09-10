/**
 * Guarda o access token só em memória (variável de módulo), nunca em
 * localStorage/sessionStorage — mesma decisão de segurança do backend
 * (ver apps/core/tokens/cookies.py: um XSS não deve conseguir roubar a
 * sessão inteira via storage, só o access token de curta duração já em uso).
 *
 * O refresh token nunca passa por aqui: ele vive só no cookie httpOnly
 * `eluxo_refresh_token`, restrito a /api/auth, e o navegador o envia
 * automaticamente com `credentials: "include"`.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
