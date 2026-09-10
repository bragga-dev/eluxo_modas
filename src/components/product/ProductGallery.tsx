import { useState } from "react";
import type { ProductImage } from "@/types/product";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-cream">
        <span className="font-display text-ink/30">Éluxo Modas</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
        {sorted.map((image, index) => (
          <button
            key={image.image_id}
            onClick={() => setActiveIndex(index)}
            aria-label={`Ver imagem ${index + 1} de ${productName}`}
            aria-current={index === activeIndex}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
              index === activeIndex ? "border-gold" : "border-transparent opacity-70"
            }`}
          >
            <img src={image.product_image_url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="aspect-square w-full flex-1 overflow-hidden rounded-xl bg-cream">
        <img src={active.product_image_url} alt={productName} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
