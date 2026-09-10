import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const message = searchParams.get("message");
  const isSuccess = status === "success";

  return (
    <div className="text-center">
      <h1 className="mb-2 font-display text-2xl text-ink">
        {isSuccess ? "E-mail verificado!" : "Não foi possível verificar seu e-mail"}
      </h1>
      <p className="text-sm text-ink/60">
        {isSuccess
          ? `A conta ${email ?? ""} foi confirmada com sucesso. Você já pode entrar.`
          : message ?? "O link de verificação pode ter expirado. Tente se cadastrar novamente ou fale conosco."}
      </p>
      <Link to="/entrar" className="mt-6 inline-block">
        <Button>Ir para o login</Button>
      </Link>
    </div>
  );
}
