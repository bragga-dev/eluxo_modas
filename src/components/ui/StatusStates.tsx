import type { ReactNode } from "react";
import { Button } from "./Button";

interface StateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
      {icon}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/60">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorStateProps extends StateProps {
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não conseguimos carregar essas informações agora.",
  onRetry,
}: Partial<ErrorStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-6 py-16 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink/60">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
