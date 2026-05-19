"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  number: string;
  name: string;
  fixed?: boolean;
}

export function WhatsAppButton({ number, name, fixed = false }: WhatsAppButtonProps) {
  const digits = number.replace(/\D/g, "");
  const clean = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  const message = encodeURIComponent(`Olá ${name}, vi seu perfil no GarotasVip e gostaria de saber mais.`);
  const href = `https://wa.me/55${clean}?text=${message}`;

  if (fixed) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
        aria-label="Contatar via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600",
        "text-white font-semibold px-6 py-3 rounded-xl transition-all",
        "hover:scale-[1.02] active:scale-95 shadow-md w-full"
      )}
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      Entrar em contato
    </a>
  );
}
