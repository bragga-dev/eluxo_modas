/** Espelha CampaignOut (website/schemas/campaign_schema.py). */
export interface Campaign {
  campaign_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Espelha CampaignImageOut (website/schemas/campaign_image_schema.py). */
export interface CampaignImage {
  campaign_mage_id: string;
  campaign_id: string;
  image_url: string;
  is_cover: boolean;
  display_order: number;
}

/** Espelha CampaignCreateIn. */
export interface CampaignCreatePayload {
  title: string;
  description?: string;
  starts_at?: string | null;
  ends_at?: string | null;
}

/** Espelha CampaignUpdateIn. */
export interface CampaignUpdatePayload {
  title?: string;
  description?: string;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}