import { NavLink, Outlet } from "react-router-dom";
import { AdminAvatarCard } from "@/components/admin/AdminAvatarCard";

const ADMIN_LINKS = [
  { label: "Painel", to: "/admin" },
  { label: "Meu perfil", to: "/admin/perfil" },
  { label: "Usuários", to: "/admin/usuarios" },
  { label: "Produtos", to: "/admin/produtos" },
  { label: "Categorias", to: "/admin/categorias" },
  { label: "Pedidos", to: "/admin/pedidos" },
  { label: "Avaliações", to: "/admin/avaliacoes" },
  { label: "Site", to: "/admin/site" },
];

export function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Painel Administrativo</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-4">
          <AdminAvatarCard />
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
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