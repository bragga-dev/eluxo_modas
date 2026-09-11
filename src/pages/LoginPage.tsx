import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { resendVerificationEmail } from "@/api/auth";
import { ApiError } from "@/types/api";

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast("Login realizado com sucesso.", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setNeedsVerification(true);
        setError(err.detail);
      } else {
        setError(err instanceof ApiError ? err.detail : "Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle(idToken);
      showToast("Login realizado com sucesso.", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Não foi possível entrar com o Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      showToast("Se este e-mail estiver cadastrado, você receberá as instruções em breve.", "success");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Entrar na sua conta</h1>
      <p className="mb-6 text-sm text-ink/60">Acesse seus pedidos, favoritos e muito mais.</p>

      <div className="mb-6">
        <GoogleLoginButton onCredential={handleGoogleCredential} text="signin_with" />
        {isGoogleLoading && <p className="mt-2 text-center text-xs text-ink/50">Entrando…</p>}
      </div>

      <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40">
        <span className="h-px flex-1 bg-black/10" />
        ou
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div role="alert" className="text-sm text-red-600">
            <p>{error}</p>
            {needsVerification && (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="mt-1 font-medium text-gold-dark hover:underline disabled:opacity-60"
              >
                {isResending ? "Reenviando…" : "Reenviar e-mail de verificação"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link to="/recuperar-senha" className="text-gold-dark hover:underline">
            Esqueceu sua senha?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Entrar 
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Já tem cadastro?{" "}
        <Link to="/cadastro" className="font-medium text-gold-dark hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}