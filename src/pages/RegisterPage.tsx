import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      showToast("Conta criada! Verifique seu e-mail para confirmar o cadastro.", "success");
      navigate("/", { replace: true });
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

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Criar uma conta</h1>
      <p className="mb-6 text-sm text-ink/60">Cadastre-se e aproveite todos os benefícios.</p>

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
