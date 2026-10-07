import { Servicio } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function Servicios() {
  const servicios = await prisma.servicio.findMany({ orderBy: { id: "asc" } });

  return (
    <section id="servicios" className="py-20 px-4 bg-surface">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-center text-foreground mb-10">
        Nuestros <span className="text-gold">Servicios</span>
      </h2>
      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {servicios.length === 0 && (
          <p className="text-foreground/60 col-span-full text-center">
            Aún no hay servicios cargados en la base de datos.
          </p>
        )}
        {servicios.map((s) => (
          <div key={s.id} className="rounded-lg border border-gold-dark/30 bg-background p-6">
            <h3 className="text-lg font-semibold text-foreground">{s.nombre}</h3>
            {s.descripcion && <p className="mt-2 text-sm text-foreground/70">{s.descripcion}</p>}
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gold font-semibold">${s.precio.toString()}</span>
              <span className="text-foreground/60">{s.duracionMin} min</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}