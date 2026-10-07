"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, total } = useCart();

  async function checkout() {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteNombre: "Cliente",
        telefono: "",
        items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      }),
    });
    if (res.ok) {
      alert("Pedido creado");
      setOpen(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative text-foreground hover:text-gold">
        🛒 {items.length > 0 && <span className="ml-1 text-xs text-gold">({items.length})</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-foreground font-semibold mb-4">Tu carrito</h3>
            {items.length === 0 && <p className="text-foreground/60 text-sm">Tu carrito está vacío</p>}
            {items.map((i) => (
              <div key={i.productoId} className="flex justify-between text-sm text-foreground/80 mb-2">
                <span>{i.nombre} x{i.cantidad}</span>
                <button onClick={() => removeItem(i.productoId)} className="text-gold">✕</button>
              </div>
            ))}
            <p className="mt-4 font-semibold text-foreground">Total: ${total.toFixed(2)}</p>
            <button
              disabled={items.length === 0}
              onClick={checkout}
              className="mt-4 w-full rounded-full bg-gold py-2 text-background font-semibold disabled:opacity-50"
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      )}
    </>
  );
}