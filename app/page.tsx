import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Contacto from "@/components/sections/Contacto";
import Galeria from "@/components/sections/Galeria";
import Homep from "@/components/sections/Home";
import Servicios from "@/components/sections/Servicios";
import Reserva from "@/components/sections/Reserva";
import {prisma} from "@/lib/prisma";
import Catalogo from "@/components/sections/Catalogo";
import Chatbot from "@/components/chatbot/Chatbot";
  


export default async function Home() {
  const servicios = await prisma.servicio.findMany({ select: { id: true, nombre: true } });
  const productosRaw = await prisma.producto.findMany({ select: { id: true, nombre: true, precio: true } });
  const productos = productosRaw.map((p) => ({ ...p, precio: p.precio.toString() }));
  const faqs = await prisma.faq.findMany({ select: { id: true, pregunta: true, respuesta: true } });

  return (
    <main>
      <Header />
      <Homep />
      <Servicios />
      <Galeria />
      <Contacto />
      <Reserva servicios={servicios} />
      <Catalogo productos={productos} />
      <Chatbot faqs={faqs} />
      <Footer />
    </main>
  );
}
