import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as campaignsApi from "@/api/campaigns";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { ImageGalleryManager } from "@/components/admin/ImageGalleryManager";
import { ApiError } from "@/types/api";

/** input[type=datetime-local] só aceita "YYYY-MM-DDTHH:mm", sem timezone/segundos. */
function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function AdminCampaignFormPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  return campaignId ? <EditCampaign campaignId={campaignId} /> : <CreateCampaign />;
}

function CreateCampaign() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: () =>
      campaignsApi.createCampaign({
        title,
        description: description || undefined,
        starts_at: fromDatetimeLocal(startsAt),
        ends_at: fromDatetimeLocal(endsAt),
      }),
    onSuccess: (campaign) => {
      showToast("Campanha criada com sucesso.", "success");
      navigate(`/admin/campanhas/${campaign.campaign_id}`, { replace: true });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.detail, "error");
        setFieldErrors(error.fieldErrors ?? {});
      } else {
        showToast("Não foi possível criar a campanha.", "error");
      }
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/campanhas" className="text-sm font-medium text-ink/60 hover:text-ink">
        ← Voltar para campanhas
      </Link>

      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">Nova campanha</h2>
        <p className="mt-1 text-sm text-ink/50">
          Depois de criada, você pode adicionar os banners/imagens e ativá-la.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-black/8 bg-white p-6">
        <Input label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} error={fieldErrors.title} />
        <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Início"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            hint="Opcional — deixe em branco para sem data de início"
          />
          <Input
            label="Fim"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            hint="Opcional — deixe em branco para sem data de término"
          />
        </div>
        <div className="mt-2">
          <Button type="submit" isLoading={createMutation.isPending}>
            Criar campanha
          </Button>
        </div>
      </form>
    </div>
  );
}

function EditCampaign({ campaignId }: { campaignId: string }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const campaignQuery = useQuery({
    queryKey: ["admin-campaign", campaignId],
    queryFn: () => campaignsApi.getCampaign(campaignId),
  });
  const imagesQuery = useQuery({
    queryKey: ["admin-campaign-images", campaignId],
    queryFn: () => campaignsApi.listCampaignImages(campaignId),
  });

  const campaign = campaignQuery.data;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [hydratedId, setHydratedId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (campaign && hydratedId !== campaign.campaign_id) {
    setHydratedId(campaign.campaign_id);
    setTitle(campaign.title);
    setDescription(campaign.description ?? "");
    setStartsAt(toDatetimeLocal(campaign.starts_at));
    setEndsAt(toDatetimeLocal(campaign.ends_at));
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-campaign", campaignId] });
    queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
  }

  const updateMutation = useMutation({
    mutationFn: () =>
      campaignsApi.updateCampaign(campaignId, {
        title,
        description,
        starts_at: fromDatetimeLocal(startsAt),
        ends_at: fromDatetimeLocal(endsAt),
      }),
    onSuccess: () => {
      showToast("Campanha atualizada.", "success");
      invalidate();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.detail, "error");
        setFieldErrors(error.fieldErrors ?? {});
      } else {
        showToast("Não foi possível salvar.", "error");
      }
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () =>
      campaign?.is_active ? campaignsApi.deactivateCampaign(campaignId) : campaignsApi.activateCampaign(campaignId),
    onSuccess: () => {
      showToast("Status atualizado.", "success");
      invalidate();
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível atualizar.", "error"),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => campaignsApi.uploadCampaignImage(campaignId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-campaign-images", campaignId] }),
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível enviar a imagem.", "error"),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => campaignsApi.deleteCampaignImage(imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-campaign-images", campaignId] }),
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível excluir a imagem.", "error"),
  });

  const setCoverImageMutation = useMutation({
    mutationFn: (imageId: string) => campaignsApi.setCoverCampaignImage(imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-campaign-images", campaignId] }),
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível definir a capa.", "error"),
  });

  if (campaignQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (campaignQuery.isError || !campaign) {
    return <ErrorState onRetry={() => campaignQuery.refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/campanhas" className="text-sm font-medium text-ink/60 hover:text-ink">
        ← Voltar para campanhas
      </Link>

      <div className="flex flex-col gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl text-ink">{campaign.title}</h2>
          <Badge className={campaign.is_active ? "bg-green-100 text-green-700" : "bg-black/10 text-ink/60"}>
            {campaign.is_active ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-black/8 bg-white p-6">
        <Switch
          label="Campanha ativa"
          hint="Só campanhas ativas e dentro do período aparecem na vitrine/home."
          checked={campaign.is_active}
          onChange={() => toggleActiveMutation.mutate()}
          disabled={toggleActiveMutation.isPending}
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
        className="flex flex-col gap-4 rounded-xl border border-black/8 bg-white p-6"
      >
        <h3 className="text-sm font-semibold text-ink">Dados gerais</h3>
        <Input label="Título" required value={title} onChange={(e) => setTitle(e.target.value)} error={fieldErrors.title} />
        <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Início" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          <Input label="Fim" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </div>
        <div>
          <Button type="submit" size="sm" isLoading={updateMutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>

      <div className="rounded-xl border border-black/8 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-ink">Banners / imagens</h3>
        <ImageGalleryManager
          images={(imagesQuery.data ?? []).map((img) => ({
            id: img.campaign_mage_id,
            url: img.image_url,
            is_cover: img.is_cover,
          }))}
          onUpload={(file) => uploadImageMutation.mutateAsync(file)}
          onDelete={(id) => deleteImageMutation.mutateAsync(id)}
          onSetCover={(id) => setCoverImageMutation.mutateAsync(id)}
        />
      </div>
    </div>
  );
}