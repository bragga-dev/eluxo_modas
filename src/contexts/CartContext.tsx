import { createContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "@/api/cart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { Cart, CartItemCreatePayload } from "@/types/cart";
import { ApiError } from "@/types/api";

export const CART_QUERY_KEY = ["cart"] as const;

interface CartContextValue {
  cart: Cart | undefined;
  isLoading: boolean;
  itemCount: number;
  addItem: (payload: CartItemCreatePayload) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isMutating: boolean;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getMyCart,
    enabled: isAuthenticated,
    // Carrinho vazio é modelado como "404 CartNotFound" pelo backend em
    // alguns fluxos — trata como carrinho vazio em vez de propagar erro.
    retry: false,
  });

  function handleError(error: unknown, fallback: string) {
    const message = error instanceof ApiError ? error.detail : fallback;
    showToast(message, "error");
  }

  const addMutation = useMutation({
    mutationFn: cartApi.addCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart);
      showToast("Produto adicionado à sacola.", "success");
    },
    onError: (error) => handleError(error, "Não foi possível adicionar o produto."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      cartApi.updateCartItem(cartItemId, { quantity_item: quantity }),
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
    onError: (error) => handleError(error, "Não foi possível atualizar a quantidade."),
  });

  const removeMutation = useMutation({
    mutationFn: cartApi.removeCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart);
      showToast("Produto removido da sacola.", "success");
    },
    onError: (error) => handleError(error, "Não foi possível remover o produto."),
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearMyCart,
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
    onError: (error) => handleError(error, "Não foi possível esvaziar a sacola."),
  });

  const value = useMemo<CartContextValue>(
    () => ({
      cart: cartQuery.data,
      isLoading: cartQuery.isLoading,
      itemCount: cartQuery.data?.items.reduce((acc, item) => acc + item.quantity_item, 0) ?? 0,
      addItem: async (payload) => {
        await addMutation.mutateAsync(payload);
      },
      updateItemQuantity: async (cartItemId, quantity) => {
        await updateMutation.mutateAsync({ cartItemId, quantity });
      },
      removeItem: async (cartItemId) => {
        await removeMutation.mutateAsync(cartItemId);
      },
      clearCart: async () => {
        await clearMutation.mutateAsync();
      },
      isMutating:
        addMutation.isPending ||
        updateMutation.isPending ||
        removeMutation.isPending ||
        clearMutation.isPending,
    }),
    [cartQuery.data, cartQuery.isLoading, addMutation, updateMutation, removeMutation, clearMutation]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
