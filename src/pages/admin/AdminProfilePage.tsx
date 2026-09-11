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
      showToast("Perfil atualizado com sucesso.", "success");
      setFieldErrors({});
    },
    onError: (error) => {
      if (error instanceof ApiError && error.fieldErrors) setFieldErrors(error.fieldErrors);
      showToast(error instanceof ApiError ? error.detail : "Não foi possível salvar seu perfil.", "error");
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateMutation.mutate(form);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-t border-black/8 pt-8">
        <div>
          <h2 className="font-display text-xl text-ink">Informações do administrador</h2>
          <p className="mt-1 text-sm text-ink/50">{me?.user.email}</p>
        </div>

        <Input
          label="Nome completo"
          required
          value={form.full_name}
          onChange={(e) => setForm({ full_name: e.target.value })}
          error={fieldErrors.full_name}
        />

        <Button type="submit" className="self-start" isLoading={updateMutation.isPending}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}