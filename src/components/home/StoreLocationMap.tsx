export function StoreLocationMap() {
  return (
    <section className="w-full bg-cream">
      <div className="mx-auto max-w-7xl px-4 pt-12 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-ink">Onde estamos</h2>
        <p className="mt-2 text-sm text-ink/70">Visite nossa loja em Jequié, BA</p>
      </div>

      <div className="mt-6 h-[450px] w-full sm:h-[550px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1679.49767428352!2d-40.107711852786096!3d-13.85938490247375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x740af9f046d4737%3A0x69f0d32bc728ef82!2sSupermercado%20Mundial!5e1!3m2!1spt-BR!2sbr!4v1789132356165!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Localização da Éluxo Modas"
        />
      </div>
    </section>
  );
}