import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { franjasLibres } from "@/lib/agenda";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { nombreCliente, telefono, servicioId, fecha, hora } = body;

  if (!nombreCliente || !telefono || !servicioId || !fecha || !hora) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return NextResponse.json({ error: "Formato de fecha u hora no válido" }, { status: 400 });
  }

  const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } });
  if (!servicio) {
    return NextResponse.json({ error: "El servicio no existe" }, { status: 404 });
  }

  try {
    const cita = await prisma.$transaction(
      async (tx) => {
        const libres = await franjasLibres(fecha, servicio.duracionMin, tx);
        if (!libres.includes(hora)) throw new Error("FRANJA_OCUPADA");

        return tx.cita.create({
          data: {
            nombreCliente,
            telefono,
            servicioId: servicio.id,
            fecha: new Date(`${fecha}T00:00:00.000Z`),
            hora: new Date(`1970-01-01T${hora}:00.000Z`),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
    return NextResponse.json(cita);
  } catch (e) {
    const ocupada =
      (e instanceof Error && e.message === "FRANJA_OCUPADA") ||
      (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2034");
    if (ocupada) {
      return NextResponse.json({ error: "Esa hora ya no está disponible. Elige otra." }, { status: 409 });
    }
    throw e;
  }
}