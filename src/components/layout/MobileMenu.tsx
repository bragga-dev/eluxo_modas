// src/components/layout/MobileMenu.tsx
import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Overlay";
import { useAuth } from "@/hooks/useAuth";

interface NavLink {
  label: string;
  to: string;
}

const GENDER_LINKS = [
  { label: "Feminino", to: "/produtos?genero=feminino" },
  { label: "Masculino", to: "/produtos?genero=masculino" },
];

export function MobileMenu({
  isOpen,
  onClose,
  links,
}: {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  const { isAuthenticated } = useAuth();
  const restLinks = links.filter((link) => !GENDER_LINKS.some((g) => g.to === link.to));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Éluxo Modas" side="left">
      <nav className="flex flex-col p-5">
        {/* Feminino/Masculino são a navegação mais importante de uma loja de moda —
            recebem destaque editorial em vez de virar mais dois itens da lista. */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          {GENDER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center justify-center rounded-lg bg-cream py-4 font-display text-base text-ink hover:bg-gold/15"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {restLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="my-3 border-t border-black/10" />
        {isAuthenticated ? (
          <>
            <Link to="/minha-conta" onClick={onClose} className="rounded-md px-3 py-3 text-base text-ink hover:bg-black/5">
              Minha Conta
            </Link>
            <Link
              to="/minha-conta/pedidos"
              onClick={onClose}
              className="rounded-md px-3 py-3 text-base text-ink hover:bg-black/5"
            >
              Meus Pedidos
            </Link>
          </>
        ) : (
          <>
            <Link to="/entrar" onClick={onClose} className="rounded-md px-3 py-3 text-base text-ink hover:bg-black/5">
              Entrar
            </Link>
            <Link to="/cadastro" onClick={onClose} className="rounded-md px-3 py-3 text-base text-ink hover:bg-black/5">
              Criar conta
            </Link>
          </>
        )}
      </nav>
    </Drawer>
  );
}