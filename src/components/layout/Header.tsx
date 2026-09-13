// src/components/layout/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { AccountDropdown } from "./AccountDropdown";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { BagIcon, MenuIcon, SearchIcon, CloseIcon } from "@/components/ui/Icons";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";

const NAV_LINKS = [
  { label: "Feminino", to: "/produtos?genero=feminino" },
  { label: "Masculino", to: "/produtos?genero=masculino" },
  { label: "Novidades", to: "/produtos" },
  { label: "Categorias", to: "/categorias" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

/**
 * Um link de nav é considerado "ativo" quando o pathname bate e, se o link tiver
 * querystring (ex.: ?genero=feminino), quando o parâmetro relevante também bate.
 * Isso evita que "Feminino" e "Masculino" apareçam ativos ao mesmo tempo em /produtos.
 */
function useIsActive(to: string) {
  const location = useLocation();
  const [path, query] = to.split("?");
  if (location.pathname !== path) return false;
  if (!query) return true;
  const target = new URLSearchParams(query);
  const current = new URLSearchParams(location.search);
  for (const [key, value] of target) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

function NavLinkItem({ label, to }: { label: string; to: string }) {
  const isActive = useIsActive(to);
  return (
    <Link
      to={to}
      className={`relative whitespace-nowrap py-1 text-sm font-medium transition-colors ${
        isActive ? "text-ink" : "text-ink/65 hover:text-ink"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-[3px] left-0 h-[1.5px] w-full bg-gold transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </Link>
  );
}

export function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -ml-2 text-ink lg:hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* Wordmark tipográfico como elemento primário da marca — a imagem vira selo
            pequeno e opcional, em vez de ser a peça central lendo como ícone de app. */}
        <Link to="/" className="mr-1 flex shrink-0 items-center gap-2">
          <img src={logo} alt="" aria-hidden="true" className="hidden h-8 w-8 rounded-full object-cover sm:block" />
          <span className="font-display text-xl leading-none tracking-wide text-ink sm:text-2xl">
            ÉLUXO <span className="text-gold-dark">MODAS</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-6 lg:flex xl:gap-7">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Busca: ícone que expande em vez de ficar escondida até xl e duplicada
              em mobile abaixo do header. */}
          <div className="hidden lg:flex lg:items-center">
            {isSearchOpen ? (
              <div className="flex items-center gap-1">
                <SearchBar className="w-56 xl:w-64" autoFocus />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Fechar busca"
                  className="p-2 text-ink/60 hover:text-ink"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Buscar produtos"
                className="p-2 text-ink hover:text-gold-dark"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <Link
            to="/minha-conta/sacola"
            className="relative p-2 text-ink hover:text-gold-dark"
            aria-label="Ir para minha sacola"
          >
            <BagIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <AccountDropdown />
        </div>
      </div>

      {/* Mobile: uma única busca, sempre visível, sem duplicar a versão desktop. */}
      <div className="border-t border-black/5 px-4 py-2.5 lg:hidden">
        <SearchBar />
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={NAV_LINKS} />
    </header>
  );
}