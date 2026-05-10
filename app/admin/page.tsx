import Link from "next/link";
import {
  Users, Video, MessageSquareWarning, DollarSign,
  TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const METRICS = [
  { label: "Perfis Ativos", value: "124", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
  { label: "Aguardando Aprovação", value: "5", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
  { label: "Perfis Suspensos", value: "3", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  { label: "Receita do Mês", value: "R$ 2.840", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Vídeos Pendentes", value: "3", icon: Video, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Denúncias Abertas", value: "8", icon: MessageSquareWarning, color: "text-orange-500", bg: "bg-orange-50" },
];

const RECENT_PROFILES = [
  { name: "Camila Rocha", city: "Salvador", status: "pending", time: "há 2h" },
  { name: "Thaís Oliveira", city: "Fortaleza", status: "pending", time: "há 4h" },
  { name: "Jéssica Alves", city: "Recife", status: "active", time: "há 6h" },
  { name: "Beatriz Nunes", city: "Manaus", status: "pending", time: "há 8h" },
  { name: "Larissa Lima", city: "Goiânia", status: "suspended", time: "há 1d" },
];

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700" },
  active: { label: "Ativo", class: "bg-green-100 text-green-700" },
  suspended: { label: "Suspenso", class: "bg-red-100 text-red-700" },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfis recentes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Perfis Recentes</h2>
            <Link href="/admin/perfis">
              <Button variant="ghost" size="sm" className="text-[#C2185B] gap-1 text-xs">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_PROFILES.map((p) => (
              <div key={p.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C2185B] font-bold text-xs">{p.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.city} · {p.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG].class}`}>
                  {STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ações Pendentes</h2>
          <div className="space-y-3">
            {[
              { label: "5 perfis aguardando aprovação", href: "/admin/perfis", icon: Users, color: "text-yellow-500", urgent: true },
              { label: "3 vídeos aguardando revisão", href: "/admin/videos", icon: Video, color: "text-purple-500", urgent: true },
              { label: "8 comentários denunciados", href: "/admin/moderacao", icon: MessageSquareWarning, color: "text-orange-500", urgent: true },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#C2185B]/30 hover:bg-[#F8BBD9]/10 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center`}>
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="flex-1 text-sm text-gray-700">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {/* Gráfico simples de receita */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Receita — últimos 7 dias</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#C2185B]/20 rounded-t-sm hover:bg-[#C2185B]/40 transition-colors"
                  style={{ height: `${h}%` }}
                  title={`R$ ${(h * 10).toFixed(0)}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                <span key={d} className="flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
