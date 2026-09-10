import { Link } from "react-router-dom";
import { Fragment } from "react";

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink/50">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && <span aria-hidden="true">/</span>}
            <li>
              {item.to ? (
                <Link to={item.to} className="hover:text-gold-dark">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink/80" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
