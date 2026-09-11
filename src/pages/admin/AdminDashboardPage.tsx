import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ResourceCard {
  title: string;
  description: string;
  to: string;
}

const RESOURCES: ResourceCard[] = [
  { title: "Usuários", description: "Buscar, ativar e desativar contas de clientes e administradores.", to: "/admin/usuarios" },
  { title: "Produtos", description: "Cadastro, edição e estoque do catálogo.", to: "/admin/produtos" },
  { title: "Categorias", description: "Organização das categorias da loja.", to: "/admin/categorias" },
  { title: "Pedidos", description: "Acompanhamento e status dos pedidos.", to: "/admin/pedidos" },
  { title: "Avaliações", description: "Moderação das avaliações de produtos.", to: "/admin/avaliacoes" },
  { title: "Site", description: "Banners, campanhas e mensagens de contato.", to: "/admin/site" },
];

export function AdminDashboardPage() {
  const { me } = useAuth();
  const firstName = me?.admin?.full_name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="border-t border-black/8 pt-8">
        <h2 className="font-display text-xl text-ink">
          {firstName ? `Olá, ${firstName}.` : "Bem-vindo."}
        </h2>
        <p className="mt-1 text-sm text-ink/50">Escolha um recurso para gerenciar.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RESOURCES.map((resource) => (
          <Link
            key={resource.to}
            to={resource.to}
            className="flex flex-col gap-1.5 rounded-xl border border-black/8 bg-white p-5 shadow-card transition-colors hover:border-gold"
          >
            <span className="font-display text-lg text-ink">{resource.title}</span>
            <span className="text-sm text-ink/60">{resource.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}