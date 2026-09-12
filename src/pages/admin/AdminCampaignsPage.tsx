import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as campaignsApi from "@/api/campaigns";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import type { Campaign } from "@/types/campaign";

export function AdminCampaignsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Campaign | null>(null);

  const campaignsQuery = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: () => campaignsApi.listCampaigns(1, 50, false),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
  }

  const toggleActiveMutation = useMutation({
    mutationFn: (campaign: Campaign) =>
      campaign.is_active
        ? campaignsApi.deactivateCampaign(campaign.campaign_id)
        : campaignsApi.activateCampaign(campaign.campaign_id),
    onSuccess: () => {
      showToast("Status da campanha atualizado.", "success");
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (campaignId: string) => campaignsApi.deleteCampaign(campaignId),
    onSuccess: () => {
      showToast("Campanha excluída.", "success");
      invalidate();
      setPendingDelete(null);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir.", "error");
      setPendingDelete(null);
    },
  });

  const campaigns = campaignsQuery.data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Campanhas</h2>
          <p className="mt-1 text-sm text-ink/50">Banners e campanhas promocionais da vitrine/home.</p>
        </div>
        <Link to="/admin/campanhas/nova">
          <Button>Nova campanha</Button>
        </Link>
      </div>

      {campaignsQuery.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : campaignsQuery.isError ? (
        <ErrorState onRetry={() => campaignsQuery.refetch()} />
      ) : campaigns.length === 0 ? (
        <EmptyState title="Nenhuma campanha cadastrada" description="Crie a primeira campanha promocional." />
      ) : (
        <div className="flex flex-col divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
          {campaigns.map((campaign) => (
            <div key={campaign.campaign_id} className="flex items-center gap-4 px-5 py-4">
              <Link to={`/admin/campanhas/${campaign.campaign_id}`} className="min-w-0 flex-1 hover:underline">
                <p className="truncate text-sm font-medium text-ink">{campaign.title}</p>
                <p className="truncate text-xs text-ink/50">
                  {campaign.starts_at ? formatDateTime(campaign.starts_at) : "Sem início definido"}
                  {" — "}
                  {campaign.ends_at ? formatDateTime(campaign.ends_at) : "Sem fim definido"}
                </p>
              </Link>
              <Badge className={campaign.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
                {campaign.is_active ? "Ativa" : "Inativa"}
              </Badge>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  isLoading={toggleActiveMutation.isPending}
                  onClick={() => toggleActiveMutation.mutate(campaign)}
                >
                  {campaign.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Link to={`/admin/campanhas/${campaign.campaign_id}`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setPendingDelete(campaign)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Excluir campanha"
        description={`Tem certeza que deseja excluir "${pendingDelete?.title}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.campaign_id)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}