const images = ["/gallery/1.jpg", "/gallery/2.jpg", "/gallery/3.jpg", "/gallery/4.jpg"];

export default function Galeria() {
  return (
    <section id="galeria" className="py-20 px-4 bg-background">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-center text-foreground mb-10">
        Nuestra <span className="text-gold">Galería</span>
      </h2>
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-lg bg-surface">
            <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}