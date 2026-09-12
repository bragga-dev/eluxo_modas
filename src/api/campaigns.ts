import { http } from "./client";
import type { Page } from "@/types/api";
import type {
  Campaign,
  CampaignCreatePayload,
  CampaignImage,
  CampaignUpdatePayload,
} from "@/types/campaign";

/** GET /campaigns — paginado. Admin usa active_only=false para ver todas. */
export async function listCampaigns(page = 1, pageSize = 20, activeOnly = false): Promise<Page<Campaign>> {
  const { data } = await http.get<Page<Campaign>>("/campaigns", {
    params: { page, page_size: pageSize, active_only: activeOnly },
  });
  return data;
}

export async function getCampaign(campaignId: string): Promise<Campaign> {
  const { data } = await http.get<Campaign>(`/campaigns/${campaignId}`);
  return data;
}

/** GET /campaigns/running — público, já filtra ativas + dentro de starts_at/ends_at. Uso: home/vitrine. */
export async function listRunningCampaigns(): Promise<Campaign[]> {
  const { data } = await http.get<Campaign[]>("/campaigns/running");
  return data;
}

export async function createCampaign(payload: CampaignCreatePayload): Promise<Campaign> {
  const { data } = await http.post<Campaign>("/campaigns", payload);
  return data;
}

export async function updateCampaign(campaignId: string, payload: CampaignUpdatePayload): Promise<Campaign> {
  const { data } = await http.patch<Campaign>(`/campaigns/${campaignId}`, payload);
  return data;
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  await http.delete(`/campaigns/${campaignId}`);
}

export async function activateCampaign(campaignId: string): Promise<Campaign> {
  const { data } = await http.post<Campaign>(`/campaigns/${campaignId}/activate`);
  return data;
}

export async function deactivateCampaign(campaignId: string): Promise<Campaign> {
  const { data } = await http.post<Campaign>(`/campaigns/${campaignId}/deactivate`);
  return data;
}

// ── Imagens/banners ────────────────────────────────────────────────────────────

export async function listCampaignImages(campaignId: string): Promise<CampaignImage[]> {
  const { data } = await http.get<CampaignImage[]>(`/campaigns/${campaignId}/images`);
  return data;
}

export async function uploadCampaignImage(
  campaignId: string,
  image: File,
  isCover = false,
  displayOrder = 0
): Promise<CampaignImage> {
  const form = new FormData();
  form.append("image", image);
  const { data } = await http.post<CampaignImage>(`/campaigns/${campaignId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { is_cover: isCover, display_order: displayOrder },
  });
  return data;
}

export async function deleteCampaignImage(campaignImageId: string): Promise<void> {
  await http.delete(`/campaigns/images/${campaignImageId}`);
}

export async function setCoverCampaignImage(campaignImageId: string): Promise<CampaignImage> {
  const { data } = await http.post<CampaignImage>(`/campaigns/images/${campaignImageId}/set-cover`);
  return data;
}

export async function reorderCampaignImage(campaignImageId: string, displayOrder: number): Promise<CampaignImage> {
  const { data } = await http.post<CampaignImage>(`/campaigns/images/${campaignImageId}/reorder`, null, {
    params: { display_order: displayOrder },
  });
  return data;
}