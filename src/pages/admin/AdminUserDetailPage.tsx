import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "@/api/admin";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/formatters";
import { ApiError } from "@/types/api";

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => adminApi.getUserAdmin(userId as string),
    enabled: Boolean(userId),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () =>
      userQuery.data?.is_active ? adminApi.deactivateUser(userId as string) : adminApi.reactivateUser(userId as string),
    onSuccess: () => {
      showToast("Status do usuário atualizado.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) =>
      showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar o status.", "error"),
  });

  if (userQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return <ErrorState onRetry={() => userQuery.refetch()} />;
  }

  const user = userQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/usuarios" className="text-sm font-medium text-ink/60 hover:text-ink">
        ← Voltar para usuários
      </Link>

      <div className="flex flex-col gap-5 rounded-xl border border-black/8 bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-black/5">
            {user.photo_url ? (
              <img src={user.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl text-ink/30">
                {user.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-display text-xl text-ink">{user.display_name || "Sem nome cadastrado"}</p>
            <p className="text-sm text-ink/50">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={user.role === "admin" ? "bg-ink/10 text-ink" : "bg-gold/10 text-gold-dark"}>
            {user.role_label}
          </Badge>
          <Badge className={user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
            {user.is_active ? "Ativo" : "Inativo"}
          </Badge>
          <Badge className={user.is_trusty ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
            {user.is_trusty ? "E-mail confirmado" : "E-mail não confirmado"}
          </Badge>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink/50">Cadastrado em</dt>
            <dd className="text-ink">{formatDateTime(user.date_joined)}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Criado em</dt>
            <dd className="text-ink">{formatDateTime(user.created_at)}</dd>
          </div>
        </dl>

        <div className="border-t border-black/8 pt-5">
          <Button
            variant={user.is_active ? "danger" : "primary"}
            isLoading={toggleActiveMutation.isPending}
            onClick={() => toggleActiveMutation.mutate()}
          >
            {user.is_active ? "Desativar usuário" : "Reativar usuário"}
          </Button>
        </div>
      </div>
    </div>
  );
}