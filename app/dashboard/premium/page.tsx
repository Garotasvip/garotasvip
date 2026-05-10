"use client";

import { useState } from "react";
import { Crown, Check, Zap, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    key: "weekly",
    name: "Semanal",
    price: "R$ 49,90",
    period: "por 7 dias",
    priceValue: 4990,
    highlight: false,
    features: [
      "Perfil em destaque por 7 dias",
      "Aparece antes dos gratuitos",
      "Badge Premium no perfil",
      "Suporte prioritário",
    ],
  },
  {
    key: "monthly",
    name: "Mensal",
    price: "R$ 149,90",
    period: "por 30 dias",
    priceValue: 14990,
    highlight: true,
    badge: "Mais popular",
    features: [
      "Perfil em destaque por 30 dias",
      "Aparece antes dos gratuitos",
      "Badge Premium no perfil",
      "Suporte prioritário",
      "Economia de 25% vs semanal",
    ],
  },
  {
    key: "quarterly",
    name: "Trimestral",
    price: "R$ 349,90",
    period: "por 90 dias",
    priceValue: 34990,
    highlight: false,
    badge: "Melhor valor",
    features: [
      "Perfil em destaque por 90 dias",
      "Aparece antes dos gratuitos",
      "Badge Premium no perfil",
      "Suporte prioritário",
      "Economia de 41% vs semanal",
      "Destaque extra na home",
    ],
  },
];

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planKey: string) {
    setLoading(planKey);
    // Futuramente: criar sessão Stripe Checkout
    await new Promise((r) => setTimeout(r, 1000));
    alert("Integração com Stripe em breve!");
    setLoading(null);
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#F8BBD9]/40 text-[#C2185B] rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
          <Crown className="w-4 h-4" />
          Plano Premium
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Apareça em destaque e receba mais visitas
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Perfis premium aparecem sempre antes dos gratuitos e recebem até 5x mais visualizações.
        </p>
      </div>

      {/* Benefícios rápidos */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "5x mais visitas", color: "text-blue-500" },
          { icon: Star, label: "Destaque garantido", color: "text-yellow-500" },
          { icon: Zap, label: "Ativação imediata", color: "text-green-500" },
        ].map((b) => (
          <div key={b.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <b.icon className={cn("w-6 h-6 mx-auto mb-2", b.color)} />
            <p className="text-xs font-medium text-gray-700">{b.label}</p>
          </div>
        ))}
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "bg-white rounded-2xl border p-6 flex flex-col relative",
              plan.highlight
                ? "border-[#C2185B] shadow-lg shadow-[#C2185B]/10 scale-[1.02]"
                : "border-gray-100"
            )}
          >
            {/* Badge */}
            {plan.badge && (
              <div className={cn(
                "absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full",
                plan.highlight
                  ? "bg-[#C2185B] text-white"
                  : "bg-gray-900 text-white"
              )}>
                {plan.badge}
              </div>
            )}

            <div className="mb-5">
              <p className="font-semibold text-gray-900">{plan.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{plan.price}</p>
              <p className="text-xs text-muted-foreground">{plan.period}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "w-full font-semibold",
                plan.highlight
                  ? "bg-[#C2185B] hover:bg-[#C2185B]/90 text-white"
                  : "border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
              )}
              variant={plan.highlight ? "default" : "outline"}
              onClick={() => handleSubscribe(plan.key)}
              disabled={loading === plan.key}
            >
              {loading === plan.key ? "Aguarde..." : "Assinar agora"}
            </Button>
          </div>
        ))}
      </div>

      {/* Garantias */}
      <div className="bg-gray-50 rounded-2xl p-5 text-center space-y-2">
        <p className="text-sm font-semibold text-gray-900">Pagamento 100% seguro</p>
        <p className="text-xs text-muted-foreground">
          Processado pelo Stripe. Seus dados financeiros nunca passam pelos nossos servidores.
        </p>
        <p className="text-xs text-muted-foreground">
          Cancele quando quiser. Sem fidelidade. Sem cobranças surpresa.
        </p>
      </div>
    </div>
  );
}
