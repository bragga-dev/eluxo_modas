import { Link } from "react-router-dom";
import type { Order } from "@/types/order";
import { ORDER_STATUS_STYLES } from "@/types/order";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to={`/minha-conta/pedidos/${order.order_id}`}
      className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 transition-colors hover:border-gold"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-ink">Pedido #{order.code}</span>
        <Badge className={ORDER_STATUS_STYLES[order.order_status]}>{order.order_status_label}</Badge>
      </div>
      <p className="text-sm text-ink/60">{formatDate(order.created_at)}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink/60">{order.items.length} item(ns)</span>
        <span className="font-display text-base text-ink">{formatCurrency(order.total_geral)}</span>
      </div>
    </Link>
  );
}
