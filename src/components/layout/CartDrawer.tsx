import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusStates";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/formatters";

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, isLoading, updateItemQuantity, removeItem, isMutating } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Minha sacola">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5">
          {isLoading && <p className="py-10 text-center text-sm text-ink/50">Carregando sacola...</p>}

          {!isLoading && (!cart || cart.items.length === 0) && (
            <EmptyState
              title="Sua sacola está vazia"
              description="Adicione produtos para vê-los aqui."
              action={
                <Link to="/produtos" onClick={onClose}>
                  <Button size="sm">Ver produtos</Button>
                </Link>
              }
            />
          )}

          {cart?.items.map((item) => (
            <CartItemRow
              key={item.cart_item_id}
              item={item}
              isUpdating={isMutating}
              onQuantityChange={(quantity) => updateItemQuantity(item.cart_item_id, quantity)}
              onRemove={() => removeItem(item.cart_item_id)}
            />
          ))}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-black/10 p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.total_price)}</span>
            </div>
            <Link to="/carrinho" onClick={onClose}>
              <Button fullWidth size="lg">
                Finalizar compra
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  );
}
