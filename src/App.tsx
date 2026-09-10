import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AppRouter } from "@/routes/AppRouter";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
