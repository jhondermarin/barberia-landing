import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.nombreCliente || !body.telefono || !body.servicioId || !body.fecha || !body.hora) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const cita = await prisma.cita.create({
    data: {
      nombreCliente: body.nombreCliente,
      telefono: body.telefono,
      servicioId: Number(body.servicioId),
      fecha: new Date(body.fecha),
      hora: new Date(`1970-01-01T${body.hora}:00`),
    },
  });

  return NextResponse.json(cita);
}