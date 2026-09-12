import { useQueries, useQuery } from "@tanstack/react-query";
import { listCampaignImages, listRunningCampaigns } from "@/api/campaigns";
import type { Banner } from "@/types/banner";

/**
 * Monta os slides do carrossel da home a partir das campanhas reais:
 * 1. GET /campaigns/running — campanhas ativas e dentro da janela de vigência.
 * 2. GET /campaigns/{id}/images — imagens/banners de cada campanha (em paralelo).
 *
 * Cada CampaignImage vira um slide (Banner), usando o título/descrição da
 * campanha-mãe como texto e sempre linkando pra vitrine de produtos, já que
 * Campaign/CampaignImage não tem cta_label/cta_url próprios (ver
 * types/campaign.ts). Ordenado por display_order da imagem.
 */
export function useHomeCampaignBanners(): { banners: Banner[]; isLoading: boolean } {
  const campaignsQuery = useQuery({
    queryKey: ["campaigns", "running"],
    queryFn: () => listRunningCampaigns(),
    staleTime: 60_000,
  });

  const campaigns = campaignsQuery.data ?? [];

  const imagesQueries = useQueries({
    queries: campaigns.map((campaign) => ({
      queryKey: ["campaigns", campaign.campaign_id, "images"],
      queryFn: () => listCampaignImages(campaign.campaign_id),
      staleTime: 60_000,
      enabled: campaignsQuery.isSuccess,
    })),
  });

  const isLoading = campaignsQuery.isLoading || imagesQueries.some((q) => q.isLoading);

  const banners: Banner[] = campaigns
    .flatMap((campaign, index) => {
      const images = imagesQueries[index]?.data ?? [];
      return images.map((image) => ({
        banner_id: image.campaign_mage_id,
        image_url: image.image_url,
        title: campaign.title,
        subtitle: campaign.description ?? undefined,
        cta_label: "Ver produtos",
        cta_url: "/produtos",
        display_order: image.display_order,
      }));
    })
    .sort((a, b) => a.display_order - b.display_order);

  return { banners, isLoading };
}