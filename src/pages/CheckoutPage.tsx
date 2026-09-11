import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as addressApi from "@/api/address";
import { createOrder } from "@/api/orders";
import { createPayment } from "@/api/payments";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/StatusStates";
import { formatCurrency, formatCep } from "@/lib/formatters";
import { ApiError } from "@/types/api";
import type { BillingType, CreditCardHolderInfo, CreditCardInput } from "@/types/payment";
import { BILLING_TYPE_LABELS } from "@/types/payment";

type Step = "endereco" | "pagamento";

export function CheckoutPage() {
  const { me } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("endereco");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [card, setCard] = useState<CreditCardInput>({
    holder_name: "",
    number: "",
    expiry_month: "",
    expiry_year: "",
    ccv: "",
  });
  const [holderInfo, setHolderInfo] = useState<CreditCardHolderInfo>({
    name: "",
    email: me?.user.email ?? "",
    cpf_cnpj: me?.client?.cpf ?? "",
    postal_code: "",
    address_number: "",
  });

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.listMyAddresses,
  });

  const createAddressMutation = useMutation({
    mutationFn: addressApi.createMyAddress,
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelectedAddressId(address.address_id);
      setIsAddingAddress(false);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível salvar o endereço.", "error");
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) throw new Error("Selecione um endereço.");
      const order = await createOrder({ shipping_address_id: selectedAddressId });
      const payment = await createPayment(order.order_id, {
        billing_type: billingType,
        ...(billingType === "CREDIT_CARD" ? { credit_card: card, credit_card_holder_info: holderInfo } : {}),
      });
      return { order, payment };
    },
    onSuccess: ({ order }) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showToast("Pedido realizado com sucesso!", "success");
      navigate(`/minha-conta/pedidos/${order.order_id}`);
    },
    onError: (error) => {
      showToast(error instanceof ApiError ? error.detail : "Não foi possível concluir o pedido.", "error");
    },
  });

  if (isCartLoading || addressesQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Sua sacola está vazia" description="Adicione produtos antes de finalizar a compra." />
      </div>
    );
  }

  const addresses = addressesQuery.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl text-ink">Finalizar Compra</h1>

      <div className="mb-8 flex items-center gap-4 text-sm">
        <StepIndicator index={1} label="Endereço" active={step === "endereco"} done={step === "pagamento"} />
        <div className="h-px flex-1 bg-black/10" />
        <StepIndicator index={2} label="Pagamento" active={step === "pagamento"} done={false} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {step === "endereco" && (
            <div className="flex flex-col gap-4">
              {addresses.length === 0 && !isAddingAddress && (
                <EmptyState
                  title="Você ainda não tem endereços"
                  description="Cadastre um endereço de entrega para continuar."
                  action={
                    <Button size="sm" onClick={() => setIsAddingAddress(true)}>
                      Cadastrar endereço
                    </Button>
                  }
                />
              )}

              {addresses.map((address) => (
                <AddressCard
                  key={address.address_id}
                  address={address}
                  selected={selectedAddressId === address.address_id}
                  onSelect={() => setSelectedAddressId(address.address_id)}
                />
              ))}

              {addresses.length > 0 && !isAddingAddress && (
                <Button variant="ghost" size="sm" className="self-start" onClick={() => setIsAddingAddress(true)}>
                  + Adicionar novo endereço
                </Button>
              )}

              {isAddingAddress && (
                <div className="rounded-lg border border-black/10 p-5">
                  <AddressForm
                    isSubmitting={createAddressMutation.isPending}
                    onCancel={() => setIsAddingAddress(false)}
                    onSubmit={(payload) => createAddressMutation.mutateAsync(payload)}
                  />
                </div>
              )}

              <Button
                size="lg"
                className="mt-4 self-start"
                disabled={!selectedAddressId}
                onClick={() => setStep("pagamento")}
              >
                Continuar para pagamento
              </Button>
            </div>
          )}

          {step === "pagamento" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                {(Object.keys(BILLING_TYPE_LABELS) as BillingType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBillingType(type)}
                    aria-pressed={billingType === type}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                      billingType === type ? "border-gold bg-gold/10 text-gold-dark" : "border-black/15 text-ink"
                    }`}
                  >
                    {BILLING_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>

              {billingType === "CREDIT_CARD" && (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Nome no cartão"
                    required
                    value={card.holder_name}
                    onChange={(e) => setCard((prev) => ({ ...prev, holder_name: e.target.value }))}
                  />
                  <Input
                    label="Número do cartão"
                    required
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => setCard((prev) => ({ ...prev, number: e.target.value.replace(/\D/g, "") }))}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Mês"
                      required
                      placeholder="MM"
                      value={card.expiry_month}
                      onChange={(e) => setCard((prev) => ({ ...prev, expiry_month: e.target.value }))}
                    />
                    <Input
                      label="Ano"
                      required
                      placeholder="AAAA"
                      value={card.expiry_year}
                      onChange={(e) => setCard((prev) => ({ ...prev, expiry_year: e.target.value }))}
                    />
                    <Input
                      label="CVV"
                      required
                      value={card.ccv}
                      onChange={(e) => setCard((prev) => ({ ...prev, ccv: e.target.value }))}
                    />
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-ink">Dados do titular</h3>
                  <Input
                    label="Nome completo"
                    required
                    value={holderInfo.name}
                    onChange={(e) => setHolderInfo((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    label="E-mail"
                    required
                    type="email"
                    value={holderInfo.email}
                    onChange={(e) => setHolderInfo((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    label="CPF/CNPJ"
                    required
                    value={holderInfo.cpf_cnpj}
                    onChange={(e) => setHolderInfo((prev) => ({ ...prev, cpf_cnpj: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="CEP de cobrança"
                      required
                      value={holderInfo.postal_code}
                      onChange={(e) =>
                        setHolderInfo((prev) => ({ ...prev, postal_code: formatCep(e.target.value) }))
                      }
                    />
                    <Input
                      label="Número"
                      required
                      value={holderInfo.address_number}
                      onChange={(e) => setHolderInfo((prev) => ({ ...prev, address_number: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {billingType === "PIX" && (
                <p className="text-sm text-ink/60">
                  Após confirmar, geraremos um QR Code Pix para você concluir o pagamento.
                </p>
              )}
              {billingType === "BOLETO" && (
                <p className="text-sm text-ink/60">
                  Após confirmar, geraremos o boleto bancário para você concluir o pagamento.
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("endereco")}>
                  Voltar
                </Button>
                <Button
                  size="lg"
                  isLoading={orderMutation.isPending}
                  onClick={() => orderMutation.mutate()}
                >
                  Finalizar Compra
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit bg-cream/60 p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Resumo do Pedido</h2>
          <ul className="mb-4 flex flex-col gap-2 text-sm text-ink/70">
            {cart.items.map((item) => (
              <li key={item.cart_item_id} className="flex justify-between">
                <span>{item.quantity_item}x</span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-black/10 pt-3 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.total_price)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Frete</span>
              <span>{formatCurrency(cart.total_shipping)}</span>
            </div>
            <div className="flex justify-between font-display text-base text-ink">
              <span>Total</span>
              <span>{formatCurrency(cart.total_geral)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepIndicator({ index, label, active, done }: { index: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          active || done ? "bg-gold text-white" : "border border-black/20 text-ink/50"
        }`}
      >
        {index}
      </span>
      <span className={active ? "font-medium text-ink" : "text-ink/50"}>{label}</span>
    </div>
  );
}