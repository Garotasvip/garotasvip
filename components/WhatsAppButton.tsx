"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  number: string;
  name: string;
  fixed?: boolean;
  city?: string;
  services?: string[];
  restrictions?: string[];
  hourPrice?: string | null;
  nightPrice?: string | null;
}

function buildMessage(name: string, props: Omit<WhatsAppButtonProps, "number" | "name" | "fixed">) {
  const { city, services = [], restrictions = [], hourPrice, nightPrice } = props;
  const lines: string[] = [`Olá ${name}! Vi seu perfil no GarotasVip 💋`];

  if (city) lines.push(`📍 ${city}`);

  if (hourPrice || nightPrice) {
    const prices = [hourPrice, nightPrice].filter(Boolean).join(" | ");
    lines.push(`💰 ${prices}`);
  }

  if (services.length > 0) {
    const shown = services.slice(0, 6).join(", ");
    const extra = services.length > 6 ? ` (e mais ${services.length - 6})` : "";
    lines.push(`✅ Faço: ${shown}${extra}`);
  }

  if (restrictions.length > 0) {
    lines.push(`❌ Não atendo: ${restrictions.join(", ")}`);
  }

  lines.push(`\nTenho interesse, podemos conversar?`);
  return encodeURIComponent(lines.join("\n"));
}

export function WhatsAppButton({ number, name, fixed = false, ...profileProps }: WhatsAppButtonProps) {
  const digits = number.replace(/\D/g, "");
  const clean = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  const message = buildMessage(name, profileProps);
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
