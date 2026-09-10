import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast("Login realizado com sucesso.", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Entrar na sua conta</h1>
      <p className="mb-6 text-sm text-ink/60">Acesse seus pedidos, favoritos e muito mais.</p>

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
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
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
