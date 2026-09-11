import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserIcon } from "@/components/ui/Icons";

function getClientDisplayName(me: ReturnType<typeof useAuth>["me"]): string {
  const client = me?.client;
  const fullName = [client?.first_name, client?.last_name].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (client?.username) return client.username;
  if (me?.user.email) return me.user.email.split("@")[0];
  return "Cliente";
}

export function AccountDropdown() {
  const { isAuthenticated, me, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
  }

  async function handleLogout() {
    await logout();
    close();
    navigate("/");
  }

  const displayName = isAuthenticated ? getClientDisplayName(me) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-1 text-ink hover:text-gold-dark"
        aria-label="Minha conta"
        aria-expanded={isOpen}
      >
        {isAuthenticated && me?.client?.photo_url ? (
          <img
            src={me.client.photo_url}
            alt="Foto de perfil"
            className="h-8 w-8 rounded-full object-cover ring-1 ring-black/10"
          />
        ) : (
          <UserIcon className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-black/10 bg-white p-2 shadow-card">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {me?.client?.photo_url ? (
                    <img
                      src={me.client.photo_url}
                      alt="Foto de perfil"
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/10"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-ink">
                      <UserIcon className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                    <p className="truncate text-xs text-ink/50">{me?.user.email}</p>
                  </div>
                </div>

                <div className="my-1 h-px bg-black/10" />

                <AccountMenuLink to="/minha-conta" label="Minha conta" onClick={close} />
                <AccountMenuLink to="/minha-conta/pedidos" label="Meus pedidos" onClick={close} />
                <AccountMenuLink to="/minha-conta/enderecos" label="Meus endereços" onClick={close} />

                <div className="my-1 h-px bg-black/10" />

                <AccountMenuLink to="/minha-conta/seguranca" label="Configurações" onClick={close} />
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-black/5"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <AccountMenuLink to="/entrar" label="Entrar" onClick={close} />
                <AccountMenuLink to="/cadastro" label="Criar conta" onClick={close} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function AccountMenuLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-black/5">
      {label}
    </Link>
  );
}