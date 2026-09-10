import type { Address } from "@/types/address";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetPreferential?: () => void;
  onSelect?: () => void;
  selected?: boolean;
}

export function AddressCard({ address, onEdit, onDelete, onSetPreferential, onSelect, selected }: AddressCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-medium text-ink">
          {address.street}, {address.number}
        </span>
        {address.is_preferential && <Badge className="bg-gold/15 text-gold-dark">Padrão</Badge>}
      </div>
      {address.complement && <p className="text-sm text-ink/60">{address.complement}</p>}
      <p className="text-sm text-ink/60">
        {address.neighborhood} — {address.city}/{address.state}
      </p>
      <p className="text-sm text-ink/60">CEP {address.cep}</p>
    </>
  );

  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg border p-4 transition-colors ${
        selected ? "border-gold bg-gold/5" : "border-black/10"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
    >
      {content}
      {(onEdit || onDelete || onSetPreferential) && (
        <div className="mt-2 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          {onSetPreferential && !address.is_preferential && (
            <Button variant="ghost" size="sm" onClick={onSetPreferential}>
              Definir como padrão
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:bg-red-50">
              Excluir
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
