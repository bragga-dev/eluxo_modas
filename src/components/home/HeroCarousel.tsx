import { Link } from "react-router-dom";
import { Carousel } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import type { Banner } from "@/types/banner";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const sorted = [...banners].sort((a, b) => a.display_order - b.display_order);

  const slides = sorted.map((banner) => (
    <div key={banner.banner_id} className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
      <img
        src={banner.image_url}
        alt={banner.title}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent sm:bg-gradient-to-r" />

      <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 sm:justify-center sm:p-12">
        <h2 className="max-w-md font-display text-2xl text-white sm:text-4xl">{banner.title}</h2>
        {banner.subtitle && <p className="max-w-sm text-sm text-white/90 sm:text-base">{banner.subtitle}</p>}
        {banner.cta_label && banner.cta_url && (
          <Link to={banner.cta_url} className="mt-2 w-fit">
            <Button size="lg">{banner.cta_label}</Button>
          </Link>
        )}
      </div>
    </div>
  ));

  return <Carousel slides={slides} ariaLabel="Destaques ÉLUXO MODAS" className="" />;
}