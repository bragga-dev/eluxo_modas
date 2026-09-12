import { Link } from "react-router-dom";
import type { Category } from "@/types/category";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/produtos?categoria=${category.product_category_id}`}
      className="group relative flex h-48 items-end overflow-hidden rounded-xl bg-cocoa/20"
    >
      <img
        src={category.category_image_url}
        alt={category.category_name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative z-10 flex w-full items-center justify-between p-5">
        <span className="font-display text-xl text-white">{category.category_name}</span>
      </div>
    </Link>
  );
}
