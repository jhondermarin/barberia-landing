import { Globe, AtSign, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#home" },
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Contacto", href: "#contacto" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold-dark/30 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-gold">
            Barbería
          </span>
          <p className="mt-2 text-sm text-foreground/70 max-w-xs">
            Cortes clásicos, cuidado personal y una experiencia pensada para ti.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-4 items-start">
          <a href="#" aria-label="Instagram" className="text-foreground/80 hover:text-gold">
            <Globe size={20} />
          </a>
          <a href="#" aria-label="Facebook" className="text-foreground/80 hover:text-gold">
            <AtSign size={20} />
          </a>
          <a href="#" aria-label="WhatsApp" className="text-foreground/80 hover:text-gold">
            <MessageCircle size={20} />
          </a>
        </div>
      </div>

      <div className="border-t border-gold-dark/20 py-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} Barbería. Todos los derechos reservados.
      </div>
    </footer>
  );
}