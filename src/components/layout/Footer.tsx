import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <span className="font-display text-xl text-white">Éluxo Modas</span>
          <p className="mt-3 text-sm text-cream/60">Feminina e masculina — mais que moda, é estilo de vida.</p>
        </div>

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

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/50">
        © {year} Éluxo Modas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
