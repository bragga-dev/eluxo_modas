import { Link } from "react-router-dom";
import { Carousel } from "@/components/ui/Carousel";
import type { Banner } from "@/types/banner";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const sorted = [...banners].sort((a, b) => a.display_order - b.display_order);

  const slides = sorted.map((banner) => {
    const image = (
      <img
        src={banner.image_url}
        alt={banner.title}
        loading="eager"
        className="h-full w-full object-cover"
      />
    );

    return (
      <div key={banner.banner_id} className="aspect-[16/9] w-full sm:aspect-[21/9]">
        {banner.cta_url ? (
          <Link to={banner.cta_url} className="block h-full w-full" aria-label={banner.title}>
            {image}
          </Link>
        ) : (
          image
        )}
      </div>
    );
  });

  return <Carousel slides={slides} ariaLabel="Destaques ÉLUXO MODAS" className="" />;
}