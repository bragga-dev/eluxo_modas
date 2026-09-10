import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

function useLockBodyScroll(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);
}

export function Modal({ isOpen, onClose, children, title }: OverlayProps) {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-card"
      >
        {title && <h2 className="mb-4 font-display text-xl text-ink">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
}

interface DrawerProps extends OverlayProps {
  side?: "left" | "right";
}

export function Drawer({ isOpen, onClose, children, title, side = "right" }: DrawerProps) {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  const sideClasses = side === "right" ? "right-0" : "left-0";

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 ${sideClasses} flex h-full w-full max-w-sm flex-col bg-white shadow-drawer`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="font-display text-lg text-ink">{title}</h2>
            <button onClick={onClose} aria-label="Fechar" className="text-ink/60 hover:text-ink">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}