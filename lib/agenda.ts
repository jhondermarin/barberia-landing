import { prisma } from "@/lib/prisma";

// Ajusta estos valores al horario real de la barbería
export const ZONA = "Europe/Madrid";
export const APERTURA = 9 * 60; // 09:00, en minutos desde medianoche
export const CIERRE = 20 * 60; // 20:00
export const PASO = 30; // las citas empiezan cada 30 minutos
export const DIAS_ABIERTO = [1, 2, 3, 4, 5, 6]; // 0 = domingo ... 6 = sábado

type Db = Pick<typeof prisma, "cita">;

export function aMinutos(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function aHHMM(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function hoyYAhora() {
  const ahora = new Date();
  return {
    hoy: ahora.toLocaleDateString("en-CA", { timeZone: ZONA }), // AAAA-MM-DD
    minutos: aMinutos(
      ahora.toLocaleTimeString("en-GB", {
        timeZone: ZONA,
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
  };
}

export async function franjasLibres(fecha: string, duracion: number, db: Db = prisma) {
  const dia = new Date(`${fecha}T00:00:00.000Z`).getUTCDay();
  if (!DIAS_ABIERTO.includes(dia)) return [];

  const { hoy, minutos } = hoyYAhora();
  if (fecha < hoy) return [];

  const citas = await db.cita.findMany({
    where: { fecha: new Date(`${fecha}T00:00:00.000Z`), estado: { not: "cancelada" } },
    select: { hora: true, servicio: { select: { duracionMin: true } } },
  });

  const ocupados = citas.map((c) => {
    const inicio = c.hora.getUTCHours() * 60 + c.hora.getUTCMinutes();
    return { inicio, fin: inicio + c.servicio.duracionMin };
  });

  const libres: string[] = [];
  for (let inicio = APERTURA; inicio + duracion <= CIERRE; inicio += PASO) {
    if (fecha === hoy && inicio <= minutos) continue; // ya pasó
    const fin = inicio + duracion;
    const solapa = ocupados.some((o) => inicio < o.fin && o.inicio < fin);
    if (!solapa) libres.push(aHHMM(inicio));
  }
  return libres;
}