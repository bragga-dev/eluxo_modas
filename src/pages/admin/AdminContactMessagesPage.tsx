import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contactApi from "@/api/contact";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import type { ContactMessage, ContactStatus } from "@/types/contact";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "resolved", label: "Resolvida" },
  { value: "archived", label: "Arquivada" },
];

const STATUS_STYLES: Record<ContactStatus, string> = {
  pending: "bg-gold-light/20 text-gold-dark",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  archived: "bg-black/10 text-ink/60",
};

export function AdminContactMessagesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContactStatus | "">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(null);
  const debouncedSearch = useDebounce(search);

  const contactsQuery = useQuery({
    queryKey: ["admin-contacts", debouncedSearch, status, page],
    queryFn: () =>
      contactApi.listContactsAdmin({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status || undefined,
      }),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ contactId, newStatus }: { contactId: string; newStatus: ContactStatus }) =>
      contactApi.updateContactStatus(contactId, { status: newStatus }),
    onSuccess: (updated) => {
      showToast("Status atualizado.", "success");
      setSelected(updated);
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (contactId: string) => contactApi.deleteContactAdmin(contactId),
    onSuccess: () => {
      showToast("Mensagem excluída.", "success");
      invalidate();
      setPendingDelete(null);
      setSelected(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  const contacts = contactsQuery.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Mensagens de contato</h2>
        <p className="mt-1 text-sm text-ink/50">Acompanhe e responda o que os clientes enviam pelo "Fale Conosco".</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Buscar"
          placeholder="Nome, e-mail ou assunto"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          label="Status"
          placeholder="Todos"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as ContactStatus | "");
          }}
        />
      </div>

      {contactsQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : contactsQuery.isError ? (
        <ErrorState onRetry={() => contactsQuery.refetch()} />
      ) : contacts.length === 0 ? (
        <EmptyState title="Nenhuma mensagem encontrada" description="Ajuste os filtros e tente novamente." />
      ) : (
        <div className="flex flex-col divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
          {contacts.map((contact) => (
            <button
              key={contact.contact_id}
              onClick={() => setSelected(contact)}
              className="flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-cream/40"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{contact.subject}</p>
                <p className="truncate text-xs text-ink/50">
                  {contact.full_name} · {contact.email}
                </p>
              </div>
              <Badge className={STATUS_STYLES[contact.status]}>{contact.status_label}</Badge>
              <span className="hidden shrink-0 text-xs text-ink/40 sm:block">{formatDateTime(contact.created_at)}</span>
            </button>
          ))}
        </div>
      )}

      {contactsQuery.data && (
        <Pagination
          page={contactsQuery.data.page}
          pages={contactsQuery.data.pages}
          onPageChange={setPage}
          isLoading={contactsQuery.isFetching}
        />
      )}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.subject ?? ""}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="text-sm text-ink/70">
              <p>
                <span className="font-medium text-ink">{selected.full_name}</span> · {selected.email} · {selected.phone}
              </p>
              <p className="mt-1 text-xs text-ink/40">Enviada em {formatDateTime(selected.created_at)}</p>
            </div>
            <p className="whitespace-pre-wrap rounded-lg bg-cream/40 px-4 py-3 text-sm text-ink/80">
              {selected.message}
            </p>

            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={selected.status}
              onChange={(e) =>
                updateStatusMutation.mutate({ contactId: selected.contact_id, newStatus: e.target.value as ContactStatus })
              }
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="danger" onClick={() => setPendingDelete(selected)}>
                Excluir
              </Button>
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir mensagem"
        description="Essa ação exclui a mensagem de contato permanentemente."
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.contact_id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}