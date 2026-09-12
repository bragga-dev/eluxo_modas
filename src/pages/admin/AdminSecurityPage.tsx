import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/formatters";
import { ApiError } from "@/types/api";

export function AdminSecurityPage() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const sessionsQuery = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: authApi.listSessions,
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      showToast("Senha alterada com sucesso.", "success");
      setOldPassword("");
      setNewPassword("");
      setNewPassword2("");
      setPasswordError(null);
    },
    onError: (error) => setPasswordError(error instanceof ApiError ? error.detail : "Não foi possível alterar a senha."),
  });

  const revokeMutation = useMutation({
    mutationFn: authApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      showToast("Sessão encerrada.", "success");
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: authApi.logoutAll,
    onSuccess: async () => {
      showToast("Sessões encerradas em todos os dispositivos.", "success");
      await logout();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível encerrar as sessões.", "error"),
  });

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setPasswordError(null);
    if (newPassword !== newPassword2) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    changePasswordMutation.mutate({ old_password: oldPassword, new_password: newPassword, new_password2: newPassword2 });
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Alterar senha</h2>
        <Input
          label="Senha atual"
          type="password"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Input
          label="Nova senha"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          required
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
        {passwordError && (
          <p role="alert" className="text-sm text-red-600">
            {passwordError}
          </p>
        )}
        <Button type="submit" className="self-start" isLoading={changePasswordMutation.isPending}>
          Alterar senha
        </Button>
      </form>

      <section className="border-t border-black/8 pt-8">
        <h2 className="mb-4 font-display text-xl text-ink">Sessões ativas</h2>
        {sessionsQuery.isLoading && <Skeleton className="h-16 w-full" />}
        {sessionsQuery.data?.length === 0 && <p className="text-sm text-ink/60">Nenhuma sessão ativa.</p>}
        <ul className="flex flex-col gap-3">
          {sessionsQuery.data?.map((session) => (
            <li key={session.id} className="flex items-center justify-between rounded-lg border border-black/10 p-3 text-sm">
              <div>
                <p className="text-ink">{session.device ?? "Dispositivo desconhecido"}</p>
                <p className="text-xs text-ink/50">Expira em {formatDateTime(session.expires_at)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => revokeMutation.mutate(session.id)}>
                Encerrar
              </Button>
            </li>
          ))}
        </ul>

        {(sessionsQuery.data?.length ?? 0) > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            isLoading={logoutAllMutation.isPending}
            onClick={() => logoutAllMutation.mutate()}
          >
            Encerrar todas as sessões
          </Button>
        )}
      </section>
    </div>
  );
}