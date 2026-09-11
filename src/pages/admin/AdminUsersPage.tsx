import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as adminApi from "@/api/admin";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/formatters";
import type { UserRole } from "@/types/user";

const PAGE_SIZE = 20;

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const usersQuery = useQuery({
    queryKey: ["admin-users", debouncedSearch, role, status, page],
    queryFn: () =>
      adminApi.listUsersAdmin({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: role || undefined,
        is_active: status === "" ? undefined : status === "active",
      }),
  });

  const users = usersQuery.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Usuários</h2>
        <p className="mt-1 text-sm text-ink/50">Busque, filtre e gerencie o acesso das contas.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Buscar"
          placeholder="Nome ou e-mail"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          label="Tipo"
          placeholder="Todos"
          options={[
            { value: "admin", label: "Administrador" },
            { value: "client", label: "Cliente" },
          ]}
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value as UserRole | "");
          }}
        />
        <Select
          label="Status"
          placeholder="Todos"
          options={[
            { value: "active", label: "Ativos" },
            { value: "inactive", label: "Inativos" },
          ]}
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as "" | "active" | "inactive");
          }}
        />
      </div>

      {usersQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : usersQuery.isError ? (
        <ErrorState onRetry={() => usersQuery.refetch()} />
      ) : users.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado" description="Ajuste os filtros e tente novamente." />
      ) : (
        <div className="flex flex-col divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
          {users.map((user) => (
            <Link
              key={user.user_id}
              to={`/admin/usuarios/${user.user_id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-cream/40"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-black/5">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-ink/30">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.display_name || user.email}</p>
                <p className="truncate text-xs text-ink/50">{user.email}</p>
              </div>

              <Badge className={user.role === "admin" ? "bg-ink/10 text-ink" : "bg-gold/10 text-gold-dark"}>
                {user.role_label}
              </Badge>

              <Badge className={user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                {user.is_active ? "Ativo" : "Inativo"}
              </Badge>

              <span className="hidden shrink-0 text-xs text-ink/40 sm:block">
                Desde {formatDate(user.date_joined)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {usersQuery.data && (
        <Pagination
          page={usersQuery.data.page}
          pages={usersQuery.data.pages}
          onPageChange={setPage}
          isLoading={usersQuery.isFetching}
        />
      )}
    </div>
  );
}