export default function Contacto() {
  return (
    <section id="contacto" className="py-20 px-4 bg-surface">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-center text-foreground mb-10">
        <span className="text-gold">Contacto</span>
      </h2>
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        <div className="space-y-3 text-foreground/80">
          <p><strong className="text-foreground">Dirección:</strong> Carretera de Barcelona 275</p>
          <p><strong className="text-foreground">Teléfono:</strong> +34 93 123 45 67</p>
          <p><strong className="text-foreground">Horario:</strong> Lun-Sáb 9:00-20:00</p>
        </div>
        <iframe
          src="https://www.google.com/maps?q=Carretera+de+Barcelona+275&output=embed"
          className="w-full h-64 rounded-lg border-0"
          loading="lazy"
          title="Ubicación de la barbería"
        />
      </div>
    </section>
  );
}