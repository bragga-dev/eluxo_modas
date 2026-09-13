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

export function AdminLayout() {
  const { me, logout } = useAuth();
  const firstName = me?.admin?.full_name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-ink to-ink/90 p-6 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Painel administrativo</h1>
          <p className="mt-1 text-sm text-white/60">
            {firstName ? `Olá, ${firstName}.` : "Bem-vindo(a) de volta."} Gerencie o catálogo, pedidos e conteúdo
            da loja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-4 md:sticky md:top-6">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <AdminAvatarCard />
          </div>

          <nav className="flex flex-col gap-4 overflow-x-auto rounded-2xl bg-white p-3 shadow-card md:overflow-visible">
            {ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <span className="px-3 pb-1 text-xs font-medium text-ink/40">{group.label}</span>
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? "bg-gold/10 text-gold-dark" : "text-ink/60 hover:bg-black/[0.03] hover:text-ink"
                      }`
                    }
                  >
                    <link.icon className="h-[18px] w-[18px] shrink-0" />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            ))}

            <div className="mt-1 border-t border-black/8 pt-2">
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink/60 transition-colors hover:bg-black/[0.03] hover:text-ink"
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
  );
}