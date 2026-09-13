import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const CONTACT_EMAIL = "contato@eluxomodas.com.br";

/**
 * LIMITAÇÃO REAL DA API: o backend não expõe nenhum endpoint de contato
 * (não existe router registrado em config/api.py para isso — só há um
 * arquivo de exceção não utilizado em core/exceptions). Por isso este
 * formulário não faz POST para nenhum lugar: ele monta um link `mailto:`
 * com os dados preenchidos, em vez de fingir que existe uma API de envio.
 * Se o backend ganhar um endpoint de contato no futuro, é só trocar o
 * `handleSubmit` por uma chamada em api/contact.ts.
 */
export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\nTelefone: ${phone}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Contato via site — ÉLUXO MODAS"
    )}&body=${body}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Contato" }]} />
      <h1 className="mt-3 mb-2 font-display text-3xl text-ink">Fale Conosco</h1>
      <p className="mb-8 text-sm text-ink/60">Estamos prontos para te atender.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-ink">
            Mensagem <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <Button type="submit" size="lg" className="self-start">
          Enviar mensagem
        </Button>
      </form>

      <div className="mt-10 border-t border-black/10 pt-6 text-sm text-ink/60">
        <p>E-mail: {CONTACT_EMAIL}</p>
        <p>Jequié, Bahia</p>
      </div>
    </div>
  );
}
