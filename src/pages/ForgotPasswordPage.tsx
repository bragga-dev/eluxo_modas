import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "@/api/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await requestPasswordReset({ email });
      // O backend sempre responde com sucesso genérico, mesmo se o e-mail
      // não existir, pra não vazar quais e-mails estão cadastrados.
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Não foi possível enviar o e-mail agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="mb-2 font-display text-2xl text-ink">Verifique seu e-mail</h1>
        <p className="text-sm text-ink/60">
          Se houver uma conta cadastrada com esse e-mail, enviamos um link para redefinir sua senha.
        </p>
        <Link to="/entrar" className="mt-6 inline-block text-sm font-medium text-gold-dark hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Recuperar senha</h1>
      <p className="mb-6 text-sm text-ink/60">Informe seu e-mail para receber o link de redefinição.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Enviar link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link to="/entrar" className="font-medium text-gold-dark hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
