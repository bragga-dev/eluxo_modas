import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelMyOrder, getMyOrder } from "@/api/orders";
import { listOrderPayments } from "@/api/payments";
import { getMyAddress } from "@/api/address";
import { useToast } from "@/hooks/useToast";
import { getCachedProductForVariant } from "@/lib/productCache";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/StatusStates";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { ORDER_STATUS_STYLES } from "@/types/order";
import { BILLING_TYPE_LABELS } from "@/types/payment";
import { PRODUCT_COLOR_LABELS } from "@/types/product";
import { ApiError } from "@/types/api";

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getMyOrder(orderId as string),
    enabled: Boolean(orderId),
  });

  const paymentsQuery = useQuery({
    queryKey: ["orders", orderId, "payments"],
    queryFn: () => listOrderPayments(orderId as string),
    enabled: Boolean(orderId),
  });

  const addressQuery = useQuery({
    queryKey: ["addresses", orderQuery.data?.shipping_address_id],
    queryFn: () => getMyAddress(orderQuery.data!.shipping_address_id),
    enabled: Boolean(orderQuery.data?.shipping_address_id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelMyOrder(orderId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showToast("Pedido cancelado.", "success");
    },
    onError: (error) => showToast(error instanceof ApiError ? error.detail : "Não foi possível cancelar o pedido.", "error"),
  });

  if (orderQuery.isLoading) return <Skeleton className="h-96 w-full" />;
  if (orderQuery.isError || !orderQuery.data) return <ErrorState onRetry={() => orderQuery.refetch()} />;

  const order = orderQuery.data;
  const latestPayment = paymentsQuery.data?.[paymentsQuery.data.length - 1];
  const canCancel = order.order_status === "PENDING";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink">Pedido #{order.code}</h2>
          <p className="text-sm text-ink/60">{formatDateTime(order.created_at)}</p>
        </div>
        <Badge className={ORDER_STATUS_STYLES[order.order_status]}>{order.order_status_label}</Badge>
      </div>

      <section className="rounded-xl border border-black/10 p-6">
        <h3 className="mb-4 font-display text-base text-ink">Itens</h3>
        <ul className="flex flex-col divide-y divide-black/5">
          {order.items.map((item) => {
            const cached = getCachedProductForVariant(item.variant.variant_id);
            const attrs = [item.variant.color ? PRODUCT_COLOR_LABELS[item.variant.color] : null, item.variant.size]
              .filter(Boolean)
              .join(" · ");
            return (
              <li key={item.order_item_id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{cached?.productName ?? "Produto"}</p>
                  {attrs && <p className="text-xs text-ink/50">{attrs}</p>}
                  <p className="text-xs text-ink/50">Qtd: {item.order_item_quantity}</p>
                </div>
                <span className="text-sm font-medium text-ink">{formatCurrency(item.subtotal)}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Frete</span>
            <span>{formatCurrency(order.order_shipping_total)}</span>
          </div>
          <div className="flex justify-between font-display text-base text-ink">
            <span>Total</span>
            <span>{formatCurrency(order.total_geral)}</span>
          </div>
        </div>
      </section>

      {addressQuery.data && (
        <section className="rounded-xl border border-black/10 p-6">
          <h3 className="mb-2 font-display text-base text-ink">Endereço de entrega</h3>
          <p className="text-sm text-ink/70">
            {addressQuery.data.street}, {addressQuery.data.number} — {addressQuery.data.neighborhood}
          </p>
          <p className="text-sm text-ink/70">
            {addressQuery.data.city}/{addressQuery.data.state} — CEP {addressQuery.data.cep}
          </p>
        </section>
      )}

      {latestPayment && (
        <section className="rounded-xl border border-black/10 p-6">
          <h3 className="mb-2 font-display text-base text-ink">Pagamento</h3>
          <p className="text-sm text-ink/70">{BILLING_TYPE_LABELS[latestPayment.billing_type]}</p>
          <p className="text-sm text-ink/70">Status: {latestPayment.status}</p>

          {latestPayment.pix_copy_paste && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-ink/60">Pix copia e cola</p>
              <code className="block break-all rounded-md bg-black/5 p-3 text-xs">{latestPayment.pix_copy_paste}</code>
            </div>
          )}
          {latestPayment.bank_slip_url && (
            <a
              href={latestPayment.bank_slip_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-gold-dark hover:underline"
            >
              Visualizar boleto →
            </a>
          )}
          {latestPayment.invoice_url && (
            <a
              href={latestPayment.invoice_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-gold-dark hover:underline"
            >
              Ver fatura →
            </a>
          )}
        </section>
      )}

      {canCancel && (
        <Button
          variant="danger"
          className="self-start"
          onClick={() => cancelMutation.mutate()}
          isLoading={cancelMutation.isPending}
        >
          Cancelar pedido
        </Button>
      )}
    </div>
  );
}
