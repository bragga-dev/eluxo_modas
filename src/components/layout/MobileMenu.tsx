import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Overlay";
import { useAuth } from "@/hooks/useAuth";

interface NavLink {
  label: string;
  to: string;
}

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

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Éluxo Modas" side="left">
      <nav className="flex flex-col gap-1 p-5">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-black/5"
          >
            {link.label}
          </Link>
        ))}
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
