import { useState, type FormEvent } from "react";
import { sendContactMessage } from "@/api/contact";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/types/api";

const CONTACT_EMAIL = "contato@eluxomodas.com.br";

export function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await sendContactMessage({
        full_name: name,
        subject,
        message,
        email,
        phone,
      });
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.detail, "error");
        setFieldErrors(err.fieldErrors ?? {});
      } else {
        showToast("Não foi possível enviar sua mensagem agora.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Contato" }]} />
      <h1 className="mt-3 mb-2 font-display text-3xl text-ink">Fale Conosco</h1>
      <p className="mb-8 text-sm text-ink/60">Estamos prontos para te atender.</p>

      {sent ? (
        <div className="rounded-xl border border-black/10 bg-cream/40 px-6 py-8 text-center">
          <h2 className="mb-2 font-display text-xl text-ink">Mensagem enviada!</h2>
          <p className="text-sm text-ink/60">Obrigado pelo contato. Nossa equipe vai responder em breve.</p>
          <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
            Enviar outra mensagem
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.full_name}
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />
          <Input
            label="Telefone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldErrors.phone}
          />
          <Input
            label="Assunto"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            error={fieldErrors.subject}
          />
          <Textarea
            label="Mensagem"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={fieldErrors.message}
          />
          <Button type="submit" size="lg" className="self-start" isLoading={isSubmitting}>
            Enviar mensagem
          </Button>
        </form>
      )}

      <div className="mt-10 border-t border-black/10 pt-6 text-sm text-ink/60">
        <p>E-mail: {CONTACT_EMAIL}</p>
        <p>Jequié, Bahia</p>
      </div>
    </div>
  );
}