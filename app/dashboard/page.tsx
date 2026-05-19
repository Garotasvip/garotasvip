import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Images, Video, Crown, ShieldCheck, MessageCircle, Eye, ArrowRight, AlertCircle } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getProfileByUserId } from "@/lib/queries";
import { TrustScoreBar } from "@/components/TrustScoreBar";
import { VerifiedBadge } from "@/components/VerifiedBadge";

const STEPS = [
  { id: 1, title: "Complete seu perfil", desc: "Adicione descrição, cidade e serviços", icon: User, href: "/dashboard/perfil" },
  { id: 2, title: "Adicione fotos", desc: "Pelo menos 3 fotos para ganhar pontos", icon: Images, href: "/dashboard/fotos" },
  { id: 3, title: "Envie vídeo de verificação", desc: "Ganhe o selo e +25 pontos no Trust Score", icon: Video, href: "/dashboard/video" },
  { id: 4, title: "Assine o Premium", desc: "Apareça em destaque e receba mais visitas", icon: Crown, href: "/dashboard/premium" },
];

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { profile } = await getProfileByUserId(user.id);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-4">Perfil não encontrado.</p>
        <Link href="/dashboard/perfil" className="text-[#C2185B] font-medium hover:underline">
          Completar cadastro →
        </Link>
      </div>
    );
  }

  const isPending = profile.status === "pending";
  const photos = (profile.profile_photos as { id: string }[]) ?? [];

  const stepsStatus = [
    !!profile.description && !!profile.city,
    photos.length >= 1,
    profile.is_video_verified,
    profile.is_premium,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {profile.display_name} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie seu perfil e acompanhe seu desempenho.</p>
      </div>

      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">Perfil aguardando aprovação</p>
            <p className="text-xs text-yellow-700 mt-0.5">Complete os passos abaixo e nossa equipe revisará em até 24h.</p>
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Visualizações", value: profile.view_count ?? 0, icon: Eye, color: "text-blue-500" },
          { label: "Fotos", value: photos.length, icon: Images, color: "text-purple-500" },
          { label: "Trust Score", value: `${Math.round(profile.trust_score ?? 0)}%`, icon: ShieldCheck, color: "text-green-500" },
          { label: "Status", value: profile.is_premium ? "Premium" : "Gratuito", icon: Crown, color: "text-yellow-500" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Trust Score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <TrustScoreBar score={Math.round(profile.trust_score ?? 0)} showDetails />
      </div>

      {/* Selos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Seus selos</h2>
        <div className="flex flex-wrap gap-3">
          {profile.is_video_verified ? (
            <VerifiedBadge type="video" />
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed border-gray-200 rounded-full px-3 py-1">
              <Video className="w-4 h-4" />Vídeo não verificado
            </div>
          )}
          {profile.is_whatsapp_verified ? (
            <VerifiedBadge type="whatsapp" />
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed border-gray-200 rounded-full px-3 py-1">
              <MessageCircle className="w-4 h-4" />WhatsApp não verificado
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Configure seu perfil</h2>
        <div className="space-y-3">
          {STEPS.map((step, idx) => (
            <Link key={step.id} href={step.href}>
              <div className={`flex items-center gap-4 p-3 rounded-xl border transition-colors cursor-pointer
                ${stepsStatus[idx] ? "border-green-200 bg-green-50" : "border-gray-100 hover:border-[#F8BBD9] hover:bg-[#F8BBD9]/10"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                  ${stepsStatus[idx] ? "bg-green-500" : "bg-[#F8BBD9]/40"}`}>
                  <step.icon className={`w-4 h-4 ${stepsStatus[idx] ? "text-white" : "text-[#C2185B]"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${stepsStatus[idx] ? "text-green-700 line-through" : "text-gray-900"}`}>{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {!stepsStatus[idx] && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
