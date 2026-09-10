import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/api/orders";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/ui/StatusStates";
import { ErrorState } from "@/components/ui/StatusStates";
import { Skeleton } from "@/components/ui/Skeleton";

export function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: listMyOrders,
  });

  if (ordersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (ordersQuery.isError) {
    return <ErrorState onRetry={() => ordersQuery.refetch()} />;
  }

  const orders = ordersQuery.data ?? [];

  if (orders.length === 0) {
    return <EmptyState title="Você ainda não tem pedidos" description="Seus pedidos aparecerão aqui." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
    </div>
  );
}
