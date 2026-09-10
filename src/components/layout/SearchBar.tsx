import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@/components/ui/Icons";

export function SearchBar({ className = "" }: { className?: string }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = term.trim();
    navigate(trimmed ? `/produtos?busca=${encodeURIComponent(trimmed)}` : "/produtos");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={`relative ${className}`}>
      <label htmlFor="global-search" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="global-search"
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar produtos..."
        className="w-full rounded-full border border-black/10 bg-white px-4 py-2 pr-9 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />
      <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
        <SearchIcon className="h-4 w-4" />
      </button>
    </form>
  );
}