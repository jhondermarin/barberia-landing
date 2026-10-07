"use client";

import { useState } from "react";

type Faq = { id: number; pregunta: string; respuesta: string };
type Message = { from: "user" | "bot"; text: string };

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function Chatbot({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "¡Hola! Soy el asistente de la barbería. Elige una pregunta o escribe la tuya." },
  ]);

  function findAnswer(question: string) {
    const userText = normalize(question);
    let best: Faq | null = null;
    let bestScore = 0;

    for (const faq of faqs) {
      const keywords = normalize(faq.pregunta)
        .split(/\W+/)
        .filter((w) => w.length > 3);
      const score = keywords.filter((w) => userText.includes(w)).length;
      if (score > bestScore) {
        best = faq;
        bestScore = score;
      }
    }

    return best
      ? best.respuesta
      : "No tengo una respuesta para eso. Puedes escribirnos por WhatsApp desde la sección de Reserva.";
  }

  function askFree() {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: findAnswer(input) },
    ]);
    setInput("");
  }

  function askFaq(faq: Faq) {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: faq.pregunta },
      { from: "bot", text: faq.respuesta },
    ]);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 rounded-lg border border-gold-dark/30 bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-gold-dark/30 px-4 py-3">
            <span className="font-semibold text-gold">Asistente</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="text-foreground/60 hover:text-gold">
              ✕
            </button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.from === "bot"
                    ? "bg-background text-foreground"
                    : "ml-auto bg-gold text-background"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gold-dark/30 p-3">
            {faqs.map((f) => (
              <button
                key={f.id}
                onClick={() => askFaq(f)}
                className="rounded-full border border-gold-dark/50 px-3 py-1 text-xs text-foreground/80 hover:border-gold hover:text-gold"
              >
                {f.pregunta}
              </button>
            ))}
          </div>

          <div className="flex gap-2 border-t border-gold-dark/30 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askFree()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 rounded bg-background px-3 py-2 text-sm text-foreground"
            />
            <button onClick={askFree} className="rounded bg-gold px-3 text-sm font-semibold text-background">
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat"
          className="h-14 w-14 rounded-full bg-gold text-2xl shadow-lg hover:bg-gold-dark transition-colors"
        >
          💬
        </button>
      )}
    </div>
  );
}