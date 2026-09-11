import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { resendVerificationEmail } from "@/api/auth";
import { ApiError } from "@/types/api";

export function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (password !== password2) {
      setFieldErrors({ password2: "As senhas não coincidem." });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, password, password2 });
      // Conta criada mas inativa até a confirmação de e-mail: em vez de
      // mandar direto pra home, mostramos a tela de "verifique seu e-mail".
      setRegisteredEmail(email);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
        else setFormError(err.detail);
      } else {
        setFormError("Não foi possível criar sua conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      // Cadastro/login via Google já vem com e-mail verificado pelo Google.
      await loginWithGoogle(idToken);
      showToast("Conta criada com sucesso.", "success");
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.detail : "Não foi possível continuar com o Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleResend() {
    if (!registeredEmail) return;
    setIsResending(true);
    try {
      await resendVerificationEmail(registeredEmail);
      showToast("E-mail de verificação reenviado.", "success");
    } finally {
      setIsResending(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="text-center">
        <h1 className="mb-2 font-display text-2xl text-ink">Confirme seu e-mail</h1>
        <p className="text-sm text-ink/60">
          Enviamos um link de confirmação para <strong>{registeredEmail}</strong>. Abra sua caixa de
          entrada (e o spam, por garantia) para ativar sua conta.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button variant="outline" onClick={handleResend} isLoading={isResending}>
            Reenviar e-mail de confirmação
          </Button>
          <Link to="/entrar" className="text-sm font-medium text-gold-dark hover:underline">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Criar uma conta</h1>
      <p className="mb-6 text-sm text-ink/60">Cadastre-se e aproveite todos os benefícios.</p>

      <div className="mb-6">
        <GoogleLoginButton onCredential={handleGoogleCredential} text="signup_with" />
        {isGoogleLoading && <p className="mt-2 text-center text-xs text-ink/50">Criando conta…</p>}
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
          error={fieldErrors.email}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          hint="Mínimo de 8 caracteres."
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          required
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          error={fieldErrors.password2}
        />

        {formError && (
          <p role="alert" className="text-sm text-red-600">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Cadastrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Já tem uma conta?{" "}
        <Link to="/entrar" className="font-medium text-gold-dark hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}