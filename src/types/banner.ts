/**
 * PROVISÓRIO: ainda não existe model/endpoint de banner no backend
 * `luxury_fashion` (não há nada em products/categories/etc que sirva pra
 * isso). Esse tipo é um rascunho baseado no que a home costuma precisar —
 * quando o model real for criado, ajuste os nomes de campo aqui e troque
 * a fonte de dados em HomePage.tsx (hoje usa HOME_CAROUSEL_SLIDES, um
 * mock local) por uma chamada em api/banners.ts.
 */
export interface Banner {
  banner_id: string;
  image_url: string;
  title: string;
  subtitle?: string;
  cta_label?: string;
  cta_url?: string;
  display_order: number;
}