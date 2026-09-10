export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">Sobre a Éluxo Modas</span>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Mais que moda, é estilo de vida.</h1>
      <p className="mt-6 text-ink/70">
        Somos a Éluxo Modas: uma marca criada por mulheres e homens que valorizam estilo, qualidade e autenticidade.
        Nosso propósito é oferecer roupas e acessórios que unam elegância, conforto e modernidade, acompanhando
        você em todos os momentos.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <InfoCard title="Qualidade garantida" description="Peças selecionadas com atenção a cada detalhe." />
        <InfoCard title="Atendimento especializado" description="Um time pronto para te ajudar a encontrar o look ideal." />
        <InfoCard title="Entrega rápida" description="Enviamos para todo o Brasil com agilidade." />
      </div>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-black/10 p-5">
      <h3 className="font-display text-base text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{description}</p>
    </div>
  );
}
