// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/useToast";

export function Footer() {
  const year = new Date().getFullYear();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleNewsletterSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    // Sem endpoint de newsletter no backend hoje — mantém apenas o feedback visual
    // combinado com o time de produto antes de ligar a uma API real.
    showToast("Inscrição recebida. Em breve você recebe nossas novidades.", "success");
    setEmail("");
  }

  return (
    <footer className="mt-20 bg-ink text-cream/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="font-display text-2xl text-white">Éluxo Modas</span>
            <p className="mt-2 max-w-xs text-sm text-cream/60">
              Feminina e masculina — mais que moda, é estilo de vida.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Receba novidades e lançamentos"
              className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-cream/40 outline-none focus:border-gold-light"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-light"
            >
              Assinar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Institucional</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/sobre" className="hover:text-gold-light">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="hover:text-gold-light">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-gold-light">
                  Fale conosco
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Coleções</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/produtos?genero=feminino" className="hover:text-gold-light">
                  Feminino
                </Link>
              </li>
              <li>
                <Link to="/produtos?genero=masculino" className="hover:text-gold-light">
                  Masculino
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="hover:text-gold-light">
                  Categorias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Minha conta</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/minha-conta/pedidos" className="hover:text-gold-light">
                  Meus pedidos
                </Link>
              </li>
              <li>
                <Link to="/minha-conta/enderecos" className="hover:text-gold-light">
                  Endereços
                </Link>
              </li>
              <li>
                <Link to="/entrar" className="hover:text-gold-light">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Atendimento</h4>
            <p className="text-sm text-cream/60">contato@eluxomodas.com.br</p>
            <p className="text-sm text-cream/60">Jequié, Bahia</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/50">
        © {year} Éluxo Modas. Todos os direitos reservados.
      </div>
    </footer>
  );
}