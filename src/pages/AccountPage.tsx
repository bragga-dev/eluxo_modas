import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatCpf, formatPhone } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import type { ClientUpdatePayload, Gender } from "@/types/user";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
  { value: "Outro", label: "Outro" },
];

export function AccountPage() {
  const { me, applyClientUpdate } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState<ClientUpdatePayload>({
    username: me?.client?.username ?? "",
    first_name: me?.client?.first_name ?? "",
    last_name: me?.client?.last_name ?? "",
    gender: me?.client?.gender ?? "Outro",
    phone: me?.client?.phone ?? "",
    birth_date: me?.client?.birth_date ?? "",
    cpf: me?.client?.cpf ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: authApi.updateClientProfile,
    onSuccess: (client) => {
      applyClientUpdate(client);
      showToast("Perfil atualizado com sucesso.", "success");
      setFieldErrors({});
    },
    onError: (error) => {
      if (error instanceof ApiError && error.fieldErrors) setFieldErrors(error.fieldErrors);
      showToast(error instanceof ApiError ? error.detail : "Não foi possível salvar seu perfil.", "error");
    },
  });

  function setField<K extends keyof ClientUpdatePayload>(key: K, value: ClientUpdatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateMutation.mutate(form);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-black/10 p-6">
        <h2 className="font-display text-lg text-ink">Informações pessoais</h2>

        <p className="text-sm text-ink/60">{me?.user.email}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            required
            value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            error={fieldErrors.first_name}
          />
          <Input
            label="Sobrenome"
            required
            value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            error={fieldErrors.last_name}
          />
        </div>

        <Input
          label="Nome de usuário"
          value={form.username}
          onChange={(e) => setField("username", e.target.value)}
          error={fieldErrors.username}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => setField("phone", formatPhone(e.target.value))}
            error={fieldErrors.phone}
          />
          <Input
            label="Data de nascimento"
            type="date"
            value={form.birth_date}
            onChange={(e) => setField("birth_date", e.target.value)}
            error={fieldErrors.birth_date}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="CPF"
            required
            value={form.cpf}
            onChange={(e) => setField("cpf", formatCpf(e.target.value))}
            error={fieldErrors.cpf}
            hint="Necessário para finalizar compras."
          />
          <Select
            label="Gênero"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value as Gender)}
          />
        </div>

        <Button type="submit" className="self-start" isLoading={updateMutation.isPending}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}