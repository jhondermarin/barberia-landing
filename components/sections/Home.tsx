export default function Homep() {
  return (
    <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-background">
      <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-bold text-foreground">
        Estilo y tradición <span className="text-gold">en cada corte</span>
      </h1>
      <p className="mt-4 max-w-xl text-foreground/70">
        Cortes clásicos, cuidado de barba y una experiencia pensada para ti.
      </p>
      <a
        href="#reserva"
        className="mt-8 inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background hover:bg-gold-dark transition-colors"
      >
        Reservar cita
      </a>
    </section>
  );
}