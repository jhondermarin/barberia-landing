"use client";

import { useEffect, useState } from "react";

type ServicioOption = { id: number; nombre: string };

const NUMERO_WHATSAPP = "521234567890"; // reemplaza por el número real

export default function Reserva({ servicios }: { servicios: ServicioOption[] }) {
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [refresco, setRefresco] = useState(0);
  const [resultado, setResultado] = useState<{ clave: string; franjas: string[] }>({
    clave: "",
    franjas: [],
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Identifica qué consulta toca ahora; cambia si cambia el servicio, la fecha o el refresco
  const clave = servicioId && fecha ? `${servicioId}|${fecha}|${refresco}` : "";
  // Valores calculados: no hace falta guardarlos en estado
  const cargandoFranjas = clave !== "" && resultado.clave !== clave;
  const franjas = resultado.clave === clave ? resultado.franjas : [];

  useEffect(() => {
    if (!clave) return;
    let cancelado = false;
    fetch(`/api/disponibilidad?fecha=${fecha}&servicioId=${servicioId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelado) setResultado({ clave, franjas: d.franjas ?? [] });
      })
      .catch(() => {
        if (!cancelado) setResultado({ clave, franjas: [] });
      });
    return () => {
      cancelado = true;
    };
  }, [clave, fecha, servicioId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hora) {
      setError("Elige una hora disponible.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const nombre = form.get("nombre") as string;
    const telefono = form.get("telefono") as string;

    setEnviando(true);
    setError("");

    const res = await fetch("/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreCliente: nombre, telefono, servicioId, fecha, hora }),
    });

    if (res.ok) {
      const servicioNombre = servicios.find((s) => s.id === Number(servicioId))?.nombre ?? "";
      const mensaje = encodeURIComponent(
        `Hola, soy ${nombre}. Quiero confirmar mi cita para ${servicioNombre} el ${fecha} a las ${hora}.`
      );
      window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, "_blank");
      setEnviado(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar la cita. Inténtalo de nuevo.");
      if (res.status === 409) {
        setHora(""); // la hora elegida ya no vale
        setRefresco((n) => n + 1); // alguien se adelantó: recarga las horas libres
      }
    }
    setEnviando(false);
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
        <select
          required
          value={servicioId}
          onChange={(e) => {
            setServicioId(e.target.value);
            setHora("");
          }}
          className="w-full rounded bg-surface p-3 text-foreground"
        >
          <option value="">Selecciona un servicio</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          required
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setHora("");
          }}
          className="w-full rounded bg-surface p-3 text-foreground"
        />

        {servicioId && fecha && (
          <div>
            <p className="mb-2 text-sm text-foreground/70">Horas disponibles</p>
            {cargandoFranjas ? (
              <p className="text-sm text-foreground/60">Cargando...</p>
            ) : franjas.length === 0 ? (
              <p className="text-sm text-foreground/60">No hay horas libres ese día. Prueba con otra fecha.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {franjas.map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setHora(f)}
                    className={`rounded py-2 text-sm transition-colors ${
                      hora === f
                        ? "bg-gold font-semibold text-background"
                        : "bg-surface text-foreground hover:text-gold"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={enviando || !hora}
          className="w-full rounded-full bg-gold py-3 font-semibold text-background hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Reservar"}
        </button>
      </form>
    </section>
  );
}