interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ page, pages, onPageChange, isLoading }: PaginationProps) {
  if (pages <= 1) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < pages;

  // Mostra no máx. 5 números, sempre com a página atual visível.
  const windowStart = Math.max(1, Math.min(page - 2, pages - 4));
  const windowEnd = Math.min(pages, windowStart + 4);
  const pageNumbers = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1.5 py-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev || isLoading}
        aria-label="Página anterior"
        className="h-9 w-9 rounded-md border border-black/10 text-sm disabled:opacity-30 hover:border-gold"
      >
        ‹
      </button>

      {windowStart > 1 && (
        <>
          <PageButton n={1} active={page === 1} onClick={onPageChange} />
          {windowStart > 2 && <span className="px-1 text-ink/40">…</span>}
        </>
      )}

      {pageNumbers.map((n) => (
        <PageButton key={n} n={n} active={n === page} onClick={onPageChange} />
      ))}

      {windowEnd < pages && (
        <>
          {windowEnd < pages - 1 && <span className="px-1 text-ink/40">…</span>}
          <PageButton n={pages} active={page === pages} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext || isLoading}
        aria-label="Próxima página"
        className="h-9 w-9 rounded-md border border-black/10 text-sm disabled:opacity-30 hover:border-gold"
      >
        ›
      </button>
    </nav>
  );
}

function PageButton({ n, active, onClick }: { n: number; active: boolean; onClick: (n: number) => void }) {
  return (
    <button
      onClick={() => onClick(n)}
      aria-current={active ? "page" : undefined}
      className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-gold text-white" : "border border-black/10 text-ink hover:border-gold"
      }`}
    >
      {n}
    </button>
  );
}
