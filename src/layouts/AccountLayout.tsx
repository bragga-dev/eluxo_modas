import { NavLink, Outlet } from "react-router-dom";
import { AccountAvatarCard } from "@/components/account/AccountAvatarCard";

const ACCOUNT_LINKS = [
  { label: "Meu perfil", to: "/minha-conta" },
  { label: "Minha sacola", to: "/minha-conta/sacola" },
  { label: "Meus pedidos", to: "/minha-conta/pedidos" },
  { label: "Endereços", to: "/minha-conta/enderecos" },
  { label: "Segurança", to: "/minha-conta/seguranca" },
];

export function AccountLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Minha Conta</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-4">
          <AccountAvatarCard />
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
            {ACCOUNT_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/minha-conta"}
                className={({ isActive }) =>
                  `whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors md:border-b-0 md:border-l-2 ${
                    isActive
                      ? "border-gold text-gold-dark"
                      : "border-transparent text-ink/60 hover:border-black/15 hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}