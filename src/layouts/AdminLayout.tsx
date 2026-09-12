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

const ADMIN_LINKS = [
  { label: "Painel", to: "/admin", icon: GridIcon, end: true },
  { label: "Meu perfil", to: "/admin/perfil", icon: UserIcon },
  { label: "Segurança", to: "/admin/seguranca", icon: ShieldIcon },
  { label: "Usuários", to: "/admin/usuarios", icon: UsersIcon },
  { label: "Produtos", to: "/admin/produtos", icon: BagIcon },
  { label: "Categorias", to: "/admin/categorias", icon: TagIcon },
  { label: "Campanhas", to: "/admin/campanhas", icon: MegaphoneIcon },
  { label: "Pedidos", to: "/admin/pedidos", icon: PackageIcon },
  { label: "Avaliações", to: "/admin/avaliacoes", icon: StarIcon },
  { label: "Site", to: "/admin/site", icon: GlobeIcon },
];

export function AdminLayout() {
  const { me, logout } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-ink to-ink/90 p-6 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-white/60">
            {me?.admin?.full_name ? `Olá, ${me.admin.full_name.split(" ")[0]}.` : "Bem-vindo(a) de volta."} Gerencie o
            catálogo, pedidos e conteúdo da loja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <AdminAvatarCard />
          </div>

          <nav className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-2 shadow-card md:flex-col md:overflow-visible">
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-gold/10 text-gold-dark" : "text-ink/60 hover:bg-black/[0.03] hover:text-ink"
                  }`
                }
              >
                <link.icon className="h-[18px] w-[18px] shrink-0" />
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium text-ink/60 transition-colors hover:bg-black/[0.03] hover:text-ink"
            >
              <LogOutIcon className="h-[18px] w-[18px] shrink-0" />
              Sair
            </button>
          </nav>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}