import { useEffect, useMemo, useState } from "react";
import type { ProductColor, ProductSize, ProductVariant } from "@/types/product";
import { PRODUCT_COLOR_LABELS, PRODUCT_COLOR_SWATCH } from "@/types/product";

interface VariantSelectorProps {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant | null) => void;
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size).filter((s): s is ProductSize => Boolean(s)))),
    [variants]
  );
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter((c): c is ProductColor => Boolean(c)))),
    [variants]
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(sizes.length === 1 ? sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(colors.length === 1 ? colors[0] : null);

  const matched = useMemo(() => {
    const needsSize = sizes.length > 0;
    const needsColor = colors.length > 0;
    if (needsSize && !selectedSize) return null;
    if (needsColor && !selectedColor) return null;
    return (
      variants.find(
        (v) =>
          (!needsSize || v.size === selectedSize) &&
          (!needsColor || v.color === selectedColor)
      ) ?? null
    );
  }, [variants, sizes, colors, selectedSize, selectedColor]);

  function selectSize(size: ProductSize) {
    setSelectedSize(size);
    const next = variants.find(
      (v) => v.size === size && (colors.length === 0 || v.color === selectedColor)
    );
    onSelect(next ?? null);
  }

  function selectColor(color: ProductColor) {
    setSelectedColor(color);
    const next = variants.find(
      (v) => v.color === color && (sizes.length === 0 || v.size === selectedSize)
    );
    onSelect(next ?? null);
  }

  // Se só existe 1 combinação possível, já seleciona automaticamente.
  useEffect(() => {
    if (sizes.length === 0 && colors.length === 0 && variants.length === 1) {
      onSelect(variants[0]);
    } else if (sizes.length === 1 && colors.length === 0) {
      onSelect(variants.find((v) => v.size === sizes[0]) ?? null);
    } else if (colors.length === 1 && sizes.length === 0) {
      onSelect(variants.find((v) => v.color === colors[0]) ?? null);
    } else if (sizes.length === 1 && colors.length === 1) {
      onSelect(variants.find((v) => v.size === sizes[0] && v.color === colors[0]) ?? null);
    }
    // Roda só quando a lista de variantes muda (troca de produto) — onSelect
    // é estável o bastante vindo do pai (setState direto).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  return (
    <div className="flex flex-col gap-5">
      {colors.length > 0 && (
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Cor</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variantForColor = variants.find((v) => v.color === color);
              const isOutOfStock = variantForColor && !variantForColor.in_stock && !sizes.length;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color)}
                  title={PRODUCT_COLOR_LABELS[color]}
                  aria-pressed={selectedColor === color}
                  disabled={Boolean(isOutOfStock)}
                  className={`h-9 w-9 rounded-full border-2 transition-all disabled:opacity-30 ${
                    selectedColor === color ? "border-gold scale-110" : "border-black/10"
                  }`}
                  style={{ backgroundColor: PRODUCT_COLOR_SWATCH[color] }}
                />
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Tamanho</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variantForSize = variants.find(
                (v) => v.size === size && (colors.length === 0 || v.color === selectedColor)
              );
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => selectSize(size)}
                  aria-pressed={selectedSize === size}
                  disabled={colors.length > 0 && selectedColor !== null && !variantForSize}
                  className={`min-w-[2.75rem] rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-30 ${
                    selectedSize === size ? "border-gold bg-gold/10 text-gold-dark" : "border-black/15 text-ink"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {matched && !matched.in_stock && (
        <p className="text-sm text-red-600">Essa combinação está sem estoque no momento.</p>
      )}
    </div>
  );
}
