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

// Restrições operacionais (regras de atendimento)
const OPERATIONAL_KEYWORDS = ["pagamento", "hora marcada", "mínimo", "desconto", "higiene", "antecipado", "aplicativo"];

function splitRestrictions(restrictions: string[]) {
  const rules: string[] = [];
  const clientRestrictions: string[] = [];
  restrictions.forEach((r) => {
    const lower = r.toLowerCase();
    if (OPERATIONAL_KEYWORDS.some((k) => lower.includes(k))) {
      rules.push(r);
    } else {
      clientRestrictions.push(r);
    }
  });
  return { rules, clientRestrictions };
}

function buildMessage(name: string, props: Omit<WhatsAppButtonProps, "number" | "name" | "fixed">) {
  const { city, services = [], restrictions = [], hourPrice, nightPrice } = props;

  const lines: string[] = [`Olá ${name}! Vi seu perfil no GarotasVip`];

  if (city || hourPrice || nightPrice) {
    const parts: string[] = [];
    if (city) parts.push(city);
    if (hourPrice) parts.push(hourPrice);
    if (nightPrice) parts.push(nightPrice);
    lines.push(parts.join("  |  "));
  }

  if (services.length > 0) {
    const shown = services.slice(0, 5).join(", ");
    const extra = services.length > 5 ? ` (+${services.length - 5} serviços)` : "";
    lines.push(`Faço: ${shown}${extra}`);
  }

  const { rules, clientRestrictions } = splitRestrictions(restrictions);
  if (rules.length > 0) lines.push(`Condições: ${rules.join(" | ")}`);
  if (clientRestrictions.length > 0) lines.push(`Não atendo: ${clientRestrictions.join(", ")}`);

  lines.push(`\nPodemos conversar?`);
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
