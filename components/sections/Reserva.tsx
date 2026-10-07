"use client";

import { useState } from "react";

type ServicioOption = { id: number; nombre: string };

export default function Reserva({ servicios }: { servicios: ServicioOption[] }) {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const NUMERO_WHATSAPP = "521234567890"; // reemplaza por el número real de la barbería

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    const form = new FormData(e.currentTarget);
    const data = {
      nombreCliente: form.get("nombre") as string,
      telefono: form.get("telefono") as string,
      servicioId: form.get("servicio") as string,
      fecha: form.get("fecha") as string,
      hora: form.get("hora") as string,
    };

    const res = await fetch("/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const servicioNombre = servicios.find((s) => s.id === Number(data.servicioId))?.nombre ?? "";
      const mensaje = encodeURIComponent(
        `Hola, soy ${data.nombreCliente}. Quiero confirmar mi cita para ${servicioNombre} el ${data.fecha} a las ${data.hora}.`
      );
      window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, "_blank");
      setEnviado(true);
    }
    setCargando(false);
  }

  if (enviado) {
    return (
      <section id="reserva" className="py-20 px-4 text-center bg-background">
        <p className="text-foreground">¡Cita registrada! Te redirigimos a WhatsApp para confirmar.</p>
      </section>
    );
  }

  return (
    <section id="reserva" className="py-20 px-4 bg-background">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-center text-foreground mb-10">
        Reserva tu <span className="text-gold">Cita</span>
      </h2>
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
        <input name="nombre" required placeholder="Tu nombre" className="w-full rounded bg-surface p-3 text-foreground" />
        <input name="telefono" required placeholder="Teléfono" className="w-full rounded bg-surface p-3 text-foreground" />
        <select name="servicio" required className="w-full rounded bg-surface p-3 text-foreground">
          <option value="">Selecciona un servicio</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <input name="fecha" type="date" required className="w-full rounded bg-surface p-3 text-foreground" />
        <input name="hora" type="time" required className="w-full rounded bg-surface p-3 text-foreground" />
        <button disabled={cargando} className="w-full rounded-full bg-gold py-3 font-semibold text-background hover:bg-gold-dark transition-colors">
          {cargando ? "Enviando..." : "Reservar"}
        </button>
      </form>
    </section>
  );
}