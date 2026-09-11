import { useEffect, useRef, useState } from "react";

/**
 * Tipagem mínima do Google Identity Services (GIS), carregado via
 * <script src="https://accounts.google.com/gsi/client"> no index.html.
 * Não há @types oficial leve pra isso — declaramos só o que usamos.
 */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
            }
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface GoogleLoginButtonProps {
  onCredential: (idToken: string) => Promise<void> | void;
  /** Texto do botão do Google. Padrão: "continue_with". */
  text?: "signin_with" | "signup_with" | "continue_with";
}

export function GoogleLoginButton({ onCredential, text = "continue_with" }: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Login com Google indisponível no momento.");
      return;
    }

    let cancelled = false;

    function render() {
      if (cancelled || !containerRef.current || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID as string,
        callback: (response) => {
          void onCredential(response.credential);
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        width: containerRef.current.offsetWidth || 320,
        logo_alignment: "center",
      });
    }

    // O script é carregado com `async defer`; se ainda não tiver chegado,
    // aguarda um pouco e tenta de novo em vez de falhar silenciosamente.
    if (window.google) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          render();
        }
      }, 100);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!window.google) setError("Não foi possível carregar o login com Google.");
      }, 5000);
      return () => {
        cancelled = true;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [onCredential, text]);

  if (error) {
    return <p className="text-center text-xs text-ink/40">{error}</p>;
  }

  return <div ref={containerRef} className="flex w-full justify-center" />;
}