import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "@/api/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!uid || !token) {
    return (
      <div className="text-center">
        <h1 className="mb-2 font-display text-2xl text-ink">Link inválido</h1>
        <p className="text-sm text-ink/60">Este link de redefinição de senha está incompleto ou expirou.</p>
        <Link to="/recuperar-senha" className="mt-6 inline-block text-sm font-medium text-gold-dark hover:underline">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword !== newPassword2) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset({ uid: uid as string, token: token as string, new_password: newPassword, new_password2: newPassword2 });
      navigate("/entrar", { replace: true, state: { passwordReset: true } });
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Não foi possível redefinir sua senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Redefinir senha</h1>
      <p className="mb-6 text-sm text-ink/60">Escolha uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Redefinir senha
        </Button>
      </form>
    </div>
  );
}
