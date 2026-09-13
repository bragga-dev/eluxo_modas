// src/layouts/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AdminAvatarCard } from "@/components/admin/AdminAvatarCard";
import {
  GridIcon,
  UserIcon,
  ShieldIcon,
  UsersIcon,
  BagIcon,
  TagIcon,
  PackageIcon,
  StarIcon,
  GlobeIcon,
  MegaphoneIcon,
  LogOutIcon,
} from "@/components/ui/Icons";

interface AdminNavLink {
  label: string;
  to: string;
  icon: typeof GridIcon;
  end?: boolean;
}

interface AdminNavGroup {
  label: string;
  links: AdminNavLink[];
}

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Painel",
    links: [{ label: "Visão geral", to: "/admin", icon: GridIcon, end: true }],
  },
  {
    label: "Minha conta",
    links: [
      { label: "Meu perfil", to: "/admin/perfil", icon: UserIcon },
      { label: "Segurança", to: "/admin/seguranca", icon: ShieldIcon },
    ],
  },
  {
    label: "Catálogo",
    links: [
      { label: "Produtos", to: "/admin/produtos", icon: BagIcon },
      { label: "Categorias", to: "/admin/categorias", icon: TagIcon },
    ],
  },
  {
    label: "Vendas",
    links: [
      { label: "Pedidos", to: "/admin/pedidos", icon: PackageIcon },
      { label: "Avaliações", to: "/admin/avaliacoes", icon: StarIcon },
      { label: "Usuários", to: "/admin/usuarios", icon: UsersIcon },
    ],
  },
  {
    label: "Conteúdo",
    links: [
      { label: "Campanhas", to: "/admin/campanhas", icon: MegaphoneIcon },
      { label: "Site", to: "/admin/site", icon: GlobeIcon },
    ],
  },
];

// Modo Admin: linguagem visual de SaaS de dados, deliberadamente distante da Loja.
// Sem gradiente, sem shadow-card, sem rounded-2xl — separação por fundo slate-50 e
// bordas finas. A classe "admin-scope" também reduz o --radius-button dos <Button />
// e desliga Playfair Display nos headings (ver index.css).
export function AdminLayout() {
  const { me, logout } = useAuth();
  const firstName = me?.admin?.full_name?.split(" ")[0];

  return (
    <div className="admin-scope min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-1 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Painel administrativo</h1>
            <p className="mt-1 text-sm text-slate-500">
              {firstName ? `Olá, ${firstName}.` : "Bem-vindo(a) de volta."} Gerencie o catálogo, pedidos e conteúdo
              da loja.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col gap-4 md:sticky md:top-6">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <AdminAvatarCard />
            </div>

            <nav className="flex flex-col gap-4 overflow-x-auto rounded-md border border-slate-200 bg-white p-3 md:overflow-visible">
              {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.label} className="flex flex-col gap-1">
                  <span className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {group.label}
                  </span>
                  {group.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? "bg-gold/10 text-gold-dark" : "text-slate-500 hover:bg-slate-100 hover:text-ink"
                        }`
                      }
                    >
                      <link.icon className="h-[18px] w-[18px] shrink-0" />
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              ))}

              <div className="mt-1 border-t border-slate-200 pt-2">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex w-full items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink"
                >
                  <LogOutIcon className="h-[18px] w-[18px] shrink-0" />
                  Sair
                </button>
              </div>
            </nav>
          </div>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}