import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { franjasLibres } from "@/lib/agenda";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get("fecha") ?? "";
  const servicioId = Number(searchParams.get("servicioId"));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !servicioId) {
    return NextResponse.json({ error: "Faltan fecha o servicioId" }, { status: 400 });
  }

  const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
  if (!servicio) {
    return NextResponse.json({ error: "El servicio no existe" }, { status: 404 });
  }

  const franjas = await franjasLibres(fecha, servicio.duracionMin);
  return NextResponse.json({ franjas });
}