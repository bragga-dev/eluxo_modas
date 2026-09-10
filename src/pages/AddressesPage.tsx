import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as addressApi from "@/api/address";
import { useToast } from "@/hooks/useToast";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApiError } from "@/types/api";
import type { Address, AddressCreatePayload } from "@/types/address";

export function AddressesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.listMyAddresses,
  });

  function handleError(error: unknown, fallback: string) {
    showToast(error instanceof ApiError ? error.detail : fallback, "error");
  }

  const createMutation = useMutation({
    mutationFn: addressApi.createMyAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Endereço cadastrado.", "success");
      setIsCreating(false);
    },
    onError: (error) => handleError(error, "Não foi possível cadastrar o endereço."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressCreatePayload }) =>
      addressApi.updateMyAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Endereço atualizado.", "success");
      setEditingId(null);
    },
    onError: (error) => handleError(error, "Não foi possível atualizar o endereço."),
  });

  const deleteMutation = useMutation({
    mutationFn: addressApi.deleteMyAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Endereço removido.", "success");
    },
    onError: (error) => handleError(error, "Não foi possível remover o endereço."),
  });

  const preferentialMutation = useMutation({
    mutationFn: addressApi.setPreferentialAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Endereço padrão atualizado.", "success");
    },
    onError: (error) => handleError(error, "Não foi possível definir o endereço padrão."),
  });

  if (addressesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const addresses = addressesQuery.data ?? [];
  const editingAddress: Address | undefined = addresses.find((a) => a.address_id === editingId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Meus endereços</h2>
        {!isCreating && (
          <Button size="sm" onClick={() => setIsCreating(true)}>
            + Novo endereço
          </Button>
        )}
      </div>

      {addresses.length === 0 && !isCreating && (
        <EmptyState title="Nenhum endereço cadastrado" description="Adicione um endereço para agilizar suas compras." />
      )}

      <div className="flex flex-col gap-3">
        {addresses.map((address) =>
          editingId === address.address_id ? (
            <div key={address.address_id} className="rounded-lg border border-black/10 p-5">
              <AddressForm
                initial={editingAddress}
                isSubmitting={updateMutation.isPending}
                onCancel={() => setEditingId(null)}
                onSubmit={(payload) => updateMutation.mutateAsync({ id: address.address_id, payload })}
              />
            </div>
          ) : (
            <AddressCard
              key={address.address_id}
              address={address}
              onEdit={() => setEditingId(address.address_id)}
              onDelete={() => deleteMutation.mutate(address.address_id)}
              onSetPreferential={() => preferentialMutation.mutate(address.address_id)}
            />
          )
        )}
      </div>

      {isCreating && (
        <div className="rounded-lg border border-black/10 p-5">
          <h3 className="mb-4 font-display text-base text-ink">Novo endereço</h3>
          <AddressForm
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsCreating(false)}
            onSubmit={(payload) => createMutation.mutateAsync(payload)}
          />
        </div>
      )}
    </div>
  );
}
