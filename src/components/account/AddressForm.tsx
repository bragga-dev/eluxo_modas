import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatCep } from "@/lib/formatters";
import { BRAZILIAN_STATES, type Address, type AddressCreatePayload } from "@/types/address";

interface AddressFormProps {
  initial?: Address;
  onSubmit: (payload: AddressCreatePayload) => Promise<unknown>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const STATE_OPTIONS = BRAZILIAN_STATES.map((uf) => ({ value: uf, label: uf }));

export function AddressForm({ initial, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [form, setForm] = useState<AddressCreatePayload>({
    cep: initial?.cep ?? "",
    street: initial?.street ?? "",
    number: initial?.number ?? "",
    complement: initial?.complement ?? "",
    neighborhood: initial?.neighborhood ?? "",
    city: initial?.city ?? "",
    state: initial?.state,
    country: initial?.country ?? "Brasil",
  });

  function setField<K extends keyof AddressCreatePayload>(key: K, value: AddressCreatePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CEP"
          required
          value={form.cep}
          onChange={(e) => setField("cep", formatCep(e.target.value))}
          inputMode="numeric"
          maxLength={9}
        />
        <Select
          label="Estado"
          required
          options={STATE_OPTIONS}
          placeholder="Selecione"
          value={form.state ?? ""}
          onChange={(e) => setField("state", e.target.value as AddressCreatePayload["state"])}
        />
      </div>

      <Input label="Rua" required value={form.street} onChange={(e) => setField("street", e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Número" required value={form.number} onChange={(e) => setField("number", e.target.value)} />
        <Input
          label="Complemento"
          value={form.complement}
          onChange={(e) => setField("complement", e.target.value)}
        />
      </div>

      <Input
        label="Bairro"
        required
        value={form.neighborhood}
        onChange={(e) => setField("neighborhood", e.target.value)}
      />
      <Input label="Cidade" required value={form.city} onChange={(e) => setField("city", e.target.value)} />

      <div className="mt-2 flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          Salvar endereço
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
