import type { Category } from "./category";

/** Espelha ProductGenderEnum (products/schemas/product_enums_schema.py). */
export type ProductGender = "masculino" | "feminino" | "unissex";

/** Espelha ProductSizeEnum. */
export type ProductSize =
  | "PP" | "P" | "M" | "G" | "GG" | "XGG"
  | "G1" | "G2" | "G3" | "G4" | "G5" | "G6"
  | "34" | "36" | "38" | "40" | "42" | "44" | "46" | "48" | "50" | "52" | "54" | "56" | "58" | "60" | "62" | "64";

/** Espelha ProductColorEnum. */
export type ProductColor =
  | "black" | "white" | "red" | "blue" | "green" | "pink" | "yellow"
  | "orange" | "purple" | "brown" | "beige" | "gray" | "navy" | "wine" | "off_white";

export const PRODUCT_GENDER_LABELS: Record<ProductGender, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  unissex: "Unissex",
};

export const PRODUCT_COLOR_LABELS: Record<ProductColor, string> = {
  black: "Preto",
  white: "Branco",
  red: "Vermelho",
  blue: "Azul",
  green: "Verde",
  pink: "Rosa",
  yellow: "Amarelo",
  orange: "Laranja",
  purple: "Roxo",
  brown: "Marrom",
  beige: "Bege",
  gray: "Cinza",
  navy: "Azul-marinho",
  wine: "Vinho",
  off_white: "Off-White",
};

/** Hex aproximado só para o swatch de cor no filtro/seletor — não vem da API. */
export const PRODUCT_COLOR_SWATCH: Record<ProductColor, string> = {
  black: "#1a1a1a",
  white: "#ffffff",
  red: "#c0392b",
  blue: "#2e5fa3",
  green: "#3f7a4f",
  pink: "#e39cae",
  yellow: "#e8c547",
  orange: "#d97a3d",
  purple: "#6b4c8a",
  brown: "#6b4226",
  beige: "#d9c7a3",
  gray: "#8c8c8c",
  navy: "#1f2d4d",
  wine: "#5e2129",
  off_white: "#f5f0e6",
};

/** Espelha VariantOut (products/schemas/product_variant_schema.py). */
export interface ProductVariant {
  variant_id: string;
  size: ProductSize | null;
  color: ProductColor | null;
  gender: ProductGender | null;
  price: string;
  stock: number;
  description: string;
  is_active: boolean;
  in_stock: boolean;
}

/** Espelha ImageOut (products/schemas/produc_image_schema.py). */
export interface ProductImage {
  image_id: string;
  product_image_url: string;
  is_cover: boolean;
  display_order: number;
}

/** Espelha ProductListOut (products/schemas/product_schema.py) — usado na vitrine. */
export interface ProductListItem {
  product_id: string;
  product_name: string;
  category: Category;
  is_active: boolean;
  variants: ProductVariant[];
  cover_image: ProductImage | null;
  min_price: string | null;
  max_price: string | null;
  in_stock: boolean;
}

/** Espelha ProductOut — usado na página de detalhe (com galeria completa). */
export interface Product extends ProductListItem {
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

/** Filtros aceitos por GET /products (query string). */
export interface ProductListFilters {
  page?: number;
  page_size?: number;
  search?: string;
  product_category_id?: string;
  gender?: ProductGender;
  size?: ProductSize;
  color?: ProductColor;
  in_stock_only?: boolean;
}
