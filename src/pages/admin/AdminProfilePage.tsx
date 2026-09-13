import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import * as adminApi from "@/api/admin";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/types/api";
import type { AdminProfileUpdatePayload } from "@/types/user";

export function AdminProfilePage() {
  const { me, applyAdminUpdate } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<AdminProfileUpdatePayload>({
    full_name: me?.admin?.full_name ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: adminApi.updateAdminProfile,
    onSuccess: (admin) => {
      applyAdminUpdate(admin);
      setForm({ full_name: admin.full_name });
      showToast("Perfil atualizado com sucesso.", "success");
      setFieldErrors({});
    },
    onError: (error) => {
      if (error instanceof ApiError && error.fieldErrors) setFieldErrors(error.fieldErrors);
      showToast(error instanceof ApiError ? error.detail : "Não foi possível salvar seu perfil.", "error");
    },
  });

  const isDirty = form.full_name.trim() !== (me?.admin?.full_name ?? "").trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateMutation.mutate(form);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl text-ink">Meu perfil</h2>
        <p className="mt-1 text-sm text-ink/50">
          Essas informações aparecem no painel administrativo e para outros administradores da loja.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-t border-black/8 pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Nome completo"
            required
            value={form.full_name}
            onChange={(e) => setForm({ full_name: e.target.value })}
            error={fieldErrors.full_name}
            hint="Como seu nome aparece no painel e nas notificações internas."
          />

          <Input label="E-mail" value={me?.user.email ?? ""} disabled hint="O e-mail de login não pode ser alterado por aqui." />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={updateMutation.isPending} disabled={!isDirty || !form.full_name.trim()}>
            Salvar alterações
          </Button>
          {!isDirty && !updateMutation.isPending && (
            <span className="text-xs text-ink/40">Nenhuma alteração pendente.</span>
          )}
        </div>
      </form>

      <div className="border-t border-black/8 pt-6">
        <h3 className="font-display text-lg text-ink">Foto de perfil</h3>
        <p className="mt-1 text-sm text-ink/50">
          Use o ícone de edição no seu avatar, no menu lateral, para trocar ou remover a foto.
        </p>
      </div>
    </div>
  );
}