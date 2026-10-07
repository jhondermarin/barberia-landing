"use client";

import { useCart } from "@/lib/cart-context";

type Producto = { id: number; nombre: string; precio: string };

export default function Catalogo({ productos }: { productos: Producto[] }) {
  const { addItem } = useCart();

  return (
    <section id="catalogo" className="py-20 px-4 bg-surface">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-center text-foreground mb-10">
        Nuestro <span className="text-gold">Catálogo</span>
      </h2>
      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {productos.length === 0 && (
          <p className="text-foreground/60 col-span-full text-center">
            Aún no hay productos cargados en la base de datos.
          </p>
        )}
        {productos.map((p) => (
          <div key={p.id} className="rounded-lg border border-gold-dark/30 bg-background p-6">
            <h3 className="text-lg font-semibold text-foreground">{p.nombre}</h3>
            <p className="mt-2 text-gold font-semibold">${p.precio}</p>
            <button
              onClick={() => addItem({ productoId: p.id, nombre: p.nombre, precio: Number(p.precio) })}
              className="mt-4 w-full rounded-full bg-gold py-2 text-sm font-semibold text-background hover:bg-gold-dark transition-colors"
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}