import { EmptyState } from "@/components/ui/StatusStates";

interface AdminComingSoonPageProps {
  resource: string;
}

export function AdminComingSoonPage({ resource }: AdminComingSoonPageProps) {
  return (
    <div className="border-t border-black/8 pt-8">
      <EmptyState
        title={`Gestão de ${resource}`}
        description="A API já dá suporte a esse recurso — a tela de gerenciamento ainda vai ser construída aqui."
      />
    </div>
  );
}