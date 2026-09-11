import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { AccountDropdown } from "./AccountDropdown";
import { BagIcon, MenuIcon } from "@/components/ui/Icons";

const NAV_LINKS = [
  { label: "Início", to: "/" },
  { label: "Feminino", to: "/produtos?genero=feminino" },
  { label: "Masculino", to: "/produtos?genero=masculino" },
  { label: "Produtos", to: "/produtos" },
  { label: "Categorias", to: "/categorias" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function Header() {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-ink lg:hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link to="/" className="font-display text-xl tracking-wide text-ink sm:text-2xl">
          ÉLUXO <span className="text-gold-dark">MODAS</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="whitespace-nowrap text-sm font-medium text-ink hover:text-gold-dark">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden max-w-[180px] flex-1 xl:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-ink hover:text-gold-dark"
            aria-label="Abrir sacola"
          >
            <BagIcon className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          <AccountDropdown />
        </div>
      </div>

      <div className="border-t border-black/5 px-4 py-2.5 xl:hidden">
        <SearchBar />
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={NAV_LINKS} />
    </header>
  );
}