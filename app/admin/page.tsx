import Link from "next/link";
import {
  Users, Video, MessageSquareWarning, DollarSign,
  TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight, Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminMetrics } from "@/lib/queries";

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700" },
  active: { label: "Ativo", class: "bg-green-100 text-green-700" },
  suspended: { label: "Suspenso", class: "bg-red-100 text-red-700" },
};

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  const METRICS = [
    { label: "Perfis Ativos", value: String(metrics.totalActive), icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Aguardando Aprovação", value: String(metrics.totalPending), icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Perfis Suspensos", value: String(metrics.totalSuspended), icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Perfis Premium", value: String(metrics.totalPremium), icon: Crown, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Vídeos Pendentes", value: String(metrics.videosQueue), icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Denúncias Abertas", value: String(metrics.flaggedReviews), icon: MessageSquareWarning, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma em tempo real.</p>
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
          {metrics.recentProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum perfil ainda.</p>
          ) : (
            <div className="space-y-3">
              {metrics.recentProfiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C2185B] font-bold text-xs">{p.display_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.display_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.city ?? "—"} · {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]?.class ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]?.label ?? p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações pendentes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ações Pendentes</h2>
          <div className="space-y-3">
            {[
              { label: `${metrics.totalPending} perfis aguardando aprovação`, href: "/admin/perfis", icon: Users, color: "text-yellow-500", urgent: metrics.totalPending > 0 },
              { label: `${metrics.videosQueue} vídeos aguardando revisão`, href: "/admin/videos", icon: Video, color: "text-blue-500", urgent: metrics.videosQueue > 0 },
              { label: `${metrics.flaggedReviews} comentários denunciados`, href: "/admin/moderacao", icon: MessageSquareWarning, color: "text-orange-500", urgent: metrics.flaggedReviews > 0 },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                  action.urgent
                    ? "border-orange-100 bg-orange-50/50 hover:border-[#C2185B]/30"
                    : "border-gray-100 hover:border-gray-200"
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="flex-1 text-sm text-gray-700">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>

          {/* Totais rápidos */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Resumo da plataforma</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-gray-900">{metrics.totalActive + metrics.totalPending + metrics.totalSuspended}</p>
                <p className="text-xs text-muted-foreground">Total de perfis</p>
              </div>
              <div className="bg-[#F8BBD9]/20 rounded-xl p-3">
                <p className="text-xl font-bold text-[#C2185B]">{metrics.totalPremium}</p>
                <p className="text-xs text-muted-foreground">Perfis premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
