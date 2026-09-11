import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { EmptyState } from "@/components/ui/StatusStates";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/formatters";

export function CartPage() {
  const { cart, isLoading, updateItemQuantity, removeItem, clearCart, isMutating } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Sua sacola está vazia"
        description="Explore nossa coleção e adicione seus produtos favoritos."
        action={
          <Link to="/produtos">
            <Button>Ver produtos</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        {cart.items.map((item) => (
          <CartItemRow
            key={item.cart_item_id}
            item={item}
            isUpdating={isMutating}
            onQuantityChange={(quantity) => updateItemQuantity(item.cart_item_id, quantity)}
            onRemove={() => removeItem(item.cart_item_id)}
          />
        ))}
        <button
          onClick={() => clearCart()}
          disabled={isMutating}
          className="mt-4 text-sm font-medium text-ink/50 underline hover:text-red-600"
        >
          Esvaziar sacola
        </button>
      </div>

      <aside className="h-fit bg-cream/60 p-6">
        <h2 className="mb-4 font-display text-lg text-ink">Resumo do Pedido</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.total_price)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Frete</span>
            <span>{Number(cart.total_shipping) > 0 ? formatCurrency(cart.total_shipping) : "Calculado no checkout"}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-black/10 pt-3 font-display text-base text-ink">
            <span>Total</span>
            <span>{formatCurrency(cart.total_geral)}</span>
          </div>
        </div>

        <Link to="/checkout" className="mt-6 block">
          <Button fullWidth size="lg">
            Finalizar compra
          </Button>
        </Link>
        <Link to="/produtos" className="mt-3 block text-center text-sm text-ink/60 hover:text-gold-dark">
          Continuar comprando
        </Link>
      </aside>
    </div>
  );
}