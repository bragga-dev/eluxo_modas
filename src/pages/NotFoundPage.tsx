import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-6xl text-gold">404</span>
      <h1 className="mt-4 font-display text-2xl text-ink">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-ink/60">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="mt-6">
        <Button>Voltar para a loja</Button>
      </Link>
    </div>
  );
}
