import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const items: { productoId: number; cantidad: number }[] = body.items;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  const productos = await prisma.producto.findMany({
    where: { id: { in: items.map((i) => i.productoId) } },
  });

  let total = 0;
  const itemsConPrecio = items.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
    total += Number(producto.precio) * item.cantidad;
    return { productoId: item.productoId, cantidad: item.cantidad, precioUnitario: producto.precio };
  });

  const pedido = await prisma.pedido.create({
    data: {
      clienteNombre: body.clienteNombre || "Cliente",
      telefono: body.telefono || "",
      total,
      items: { create: itemsConPrecio },
    },
    include: { items: true },
  });

  return NextResponse.json(pedido);
}