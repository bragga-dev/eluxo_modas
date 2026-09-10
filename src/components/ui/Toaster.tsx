import { useToast } from "@/hooks/useToast";
import { CloseIcon } from "./Icons";

const VARIANT_CLASSES = {
  success: "bg-ink text-white",
  error: "bg-red-600 text-white",
  info: "bg-white text-ink border border-black/10",
};

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:right-6 sm:left-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex max-w-sm items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-card ${VARIANT_CLASSES[toast.variant]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Fechar notificação"
            className="text-current/70 hover:text-current"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}