import type { ReactNode } from "react";
import type { Category } from "@/types/category";
import type { ProductColor, ProductGender, ProductListFilters, ProductSize } from "@/types/product";
import { PRODUCT_COLOR_LABELS, PRODUCT_COLOR_SWATCH, PRODUCT_GENDER_LABELS } from "@/types/product";

const COMMON_SIZES: ProductSize[] = ["PP", "P", "M", "G", "GG", "XGG"];
const COMMON_COLORS: ProductColor[] = ["black", "white", "beige", "navy", "wine", "brown", "gray", "off_white"];

interface ProductFiltersProps {
  categories: Category[];
  filters: ProductListFilters;
  onChange: (filters: ProductListFilters) => void;
}

export function ProductFilters({ categories, filters, onChange }: ProductFiltersProps) {
  function toggle<K extends keyof ProductListFilters>(key: K, value: ProductListFilters[K]) {
    onChange({
      ...filters,
      page: 1,
      [key]: filters[key] === value ? undefined : value,
    });
  }

  return (
    <aside className="flex flex-col gap-8">
      <FilterSection title="Categorias">
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label key={category.product_category_id} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={filters.product_category_id === category.product_category_id}
                onChange={() => toggle("product_category_id", category.product_category_id)}
                className="h-4 w-4 rounded border-black/20 text-gold focus:ring-gold"
              />
              {category.category_name}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gênero">
        <div className="flex flex-col gap-2">
          {(Object.keys(PRODUCT_GENDER_LABELS) as ProductGender[]).map((gender) => (
            <label key={gender} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={filters.gender === gender}
                onChange={() => toggle("gender", gender)}
                className="h-4 w-4 rounded border-black/20 text-gold focus:ring-gold"
              />
              {PRODUCT_GENDER_LABELS[gender]}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {COMMON_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggle("size", size)}
              aria-pressed={filters.size === size}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                filters.size === size ? "border-gold bg-gold/10 text-gold-dark" : "border-black/15 text-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Cor">
        <div className="flex flex-wrap gap-2">
          {COMMON_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => toggle("color", color)}
              title={PRODUCT_COLOR_LABELS[color]}
              aria-pressed={filters.color === color}
              className={`h-7 w-7 rounded-full border-2 ${
                filters.color === color ? "border-gold scale-110" : "border-black/10"
              }`}
              style={{ backgroundColor: PRODUCT_COLOR_SWATCH[color] }}
            />
          ))}
        </div>
      </FilterSection>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={Boolean(filters.in_stock_only)}
          onChange={() => onChange({ ...filters, page: 1, in_stock_only: !filters.in_stock_only })}
          className="h-4 w-4 rounded border-black/20 text-gold focus:ring-gold"
        />
        Somente em estoque
      </label>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-base text-ink">{title}</h3>
      {children}
    </div>
  );
}
