import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ordersApi from "@/api/orders";
import * as addressApi from "@/api/address";
import { useAuth } from "@/hooks/useAuth";
import { AccountAvatarCard } from "@/components/account/AccountAvatarCard";
import {
  BagIcon,
  CrownIcon,
  HelpCircleIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  ShieldIcon,
  UserIcon,
  LogOutIcon,
} from "@/components/ui/Icons";

const ACCOUNT_LINKS = [
  { label: "Meu perfil", to: "/minha-conta", icon: UserIcon, end: true },
  { label: "Minha sacola", to: "/minha-conta/sacola", icon: BagIcon },
  { label: "Meus pedidos", to: "/minha-conta/pedidos", icon: PackageIcon },
  { label: "Endereços", to: "/minha-conta/enderecos", icon: MapPinIcon },
  { label: "Segurança", to: "/minha-conta/seguranca", icon: ShieldIcon },
];

const CONTACT_EMAIL = "contato@eluxomodas.com.br";

export function AccountLayout() {
  const { me, logout } = useAuth();

  const ordersQuery = useQuery({
    queryKey: ["my-orders-count"],
    queryFn: ordersApi.listMyOrders,
    staleTime: 60_000,
  });
  const addressesCountQuery = useQuery({
    queryKey: ["my-addresses-count"],
    queryFn: addressApi.countMyAddresses,
    staleTime: 60_000,
  });

  const memberSince = me?.user.date_joined ? new Date(me.user.date_joined).getFullYear() : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Minha Conta</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_280px]">
        {/* ── Sidebar esquerda ── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <AccountAvatarCard />
            {memberSince && (
              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-medium text-gold-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Cliente desde {memberSince}
                </span>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-card">
            {ACCOUNT_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
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
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-ink/60 transition-colors hover:bg-black/[0.03] hover:text-ink"
            >
              <LogOutIcon className="h-[18px] w-[18px] shrink-0" />
              Sair
            </button>
          </nav>
        </div>

        {/* ── Conteúdo ── */}
        <div>
          <Outlet />
        </div>

        {/* ── Sidebar direita ── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-gold to-gold-dark p-5 text-white shadow-card">
            <CrownIcon className="h-7 w-7" />
            <p className="mt-3 font-display text-base">Bem-vinda de volta!</p>
            <p className="mt-1 text-sm text-white/85">
              Acompanhe seus pedidos e mantenha seus dados sempre atualizados.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <UserIcon className="h-4 w-4 text-gold-dark" />
              Resumo da conta
            </p>
            <div className="flex flex-col divide-y divide-black/8">
              <NavLink
                to="/minha-conta/pedidos"
                className="flex items-center justify-between py-2.5 text-sm text-ink/70 hover:text-ink"
              >
                <span className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4" />
                  Pedidos realizados
                </span>
                <span className="font-semibold text-ink">
                  {ordersQuery.isLoading ? "…" : ordersQuery.data?.length ?? 0}
                </span>
              </NavLink>
              <NavLink
                to="/minha-conta/enderecos"
                className="flex items-center justify-between py-2.5 text-sm text-ink/70 hover:text-ink"
              >
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Endereços cadastrados
                </span>
                <span className="font-semibold text-ink">
                  {addressesCountQuery.isLoading ? "…" : addressesCountQuery.data ?? 0}
                </span>
              </NavLink>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <HelpCircleIcon className="h-4 w-4 text-gold-dark" />
              Dúvidas?
            </p>
            <p className="mb-3 text-sm text-ink/60">Nossa equipe está pronta para te ajudar.</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm font-medium text-gold-dark hover:text-gold"
            >
              <MailIcon className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}