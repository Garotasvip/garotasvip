import { notFound } from "next/navigation";
import { MapPin, DollarSign, Clock, Eye, Crown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileGallery } from "@/components/ProfileGallery";
import { TrustScoreBar } from "@/components/TrustScoreBar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ReviewSection } from "@/components/ReviewSection";
import { Badge } from "@/components/ui/badge";
import { getProfileBySlug, getProfileReviews, incrementViewCount } from "@/lib/queries";
import { getStorageUrl } from "@/lib/utils";

const DAYS_LABEL: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const { profile } = await getProfileBySlug(params.slug);
  if (!profile) return { title: "Perfil não encontrado" };
  return {
    title: `${profile.display_name} — ${profile.city}`,
    description: (profile.description as string)?.slice(0, 160) ?? "",
  };
}

export default async function PerfilPage({ params }: PageProps) {
  const { profile, error } = await getProfileBySlug(params.slug);

  if (!profile || error) notFound();

  const { reviews } = await getProfileReviews(profile.id);

  // Incrementa views (fire and forget)
  incrementViewCount(profile.id);

  const photos = (profile.profile_photos as { id: string; storage_path: string; is_cover: boolean; sort_order: number }[]) ?? [];
  const photoUrls = photos
    .sort((a, b) => (a.is_cover ? -1 : b.is_cover ? 1 : a.sort_order - b.sort_order))
    .map((p) => getStorageUrl("profile-photos", p.storage_path));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const priceLabel =
    profile.price_from && profile.price_to
      ? `R$ ${profile.price_from} – R$ ${profile.price_to}`
      : profile.price_from
      ? `A partir de R$ ${profile.price_from}`
      : null;

  const availability = profile.availability as Record<string, string> | null;

  const formattedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
    reply: (r.review_replies as { reply_text: string }[])?.[0]?.reply_text,
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Coluna esquerda: galeria ──────────────────── */}
            <div className="lg:col-span-1 space-y-4">
              <ProfileGallery photos={photoUrls} name={profile.display_name} />

              <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                {profile.whatsapp_number && (
                  <WhatsAppButton number={profile.whatsapp_number} name={profile.display_name} />
                )}
                {priceLabel && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-[#C2185B]" />
                    <span className="font-medium text-gray-900">{priceLabel}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {(profile.view_count ?? 0).toLocaleString("pt-BR")} visualizações
                </div>
              </div>
            </div>

            {/* ── Coluna direita ────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                      {profile.is_premium && (
                        <Badge className="bg-[#C2185B] text-white border-0 gap-1">
                          <Crown className="w-3 h-3" />Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />{profile.city}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.is_video_verified && <VerifiedBadge type="video" />}
                    {profile.is_whatsapp_verified && <VerifiedBadge type="whatsapp" />}
                  </div>
                </div>

                <TrustScoreBar score={Math.round(profile.trust_score ?? 0)} showDetails />

                {priceLabel && (
                  <div className="lg:hidden flex items-center gap-2 text-[#C2185B] font-semibold">
                    <DollarSign className="w-4 h-4" />{priceLabel}
                  </div>
                )}

                {profile.description && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">Sobre mim</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.description}</p>
                  </div>
                )}

                {profile.services && (profile.services as string[]).length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">Serviços</h2>
                    <div className="flex flex-wrap gap-2">
                      {(profile.services as string[]).map((s) => (
                        <Badge key={s} variant="secondary" className="bg-[#F8BBD9]/40 text-[#C2185B] border-[#F8BBD9]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {availability && Object.keys(availability).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#C2185B]" />
                    <h2 className="font-semibold text-gray-900">Disponibilidade</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(availability).map(([day, hours]) => (
                      <div key={day} className={`rounded-xl p-3 text-center text-sm ${
                        hours === "Indisponível" ? "bg-gray-50 text-gray-400" : "bg-[#F8BBD9]/20 text-gray-700"
                      }`}>
                        <p className="font-semibold text-xs uppercase tracking-wide mb-1">{DAYS_LABEL[day] ?? day}</p>
                        <p className="text-xs">{hours}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ReviewSection
                profileId={profile.id}
                profileSlug={profile.slug}
                reviews={formattedReviews}
                averageRating={averageRating}
                totalReviews={reviews.length}
              />
            </div>
          </div>
        </div>
      </main>

      {profile.whatsapp_number && (
        <WhatsAppButton number={profile.whatsapp_number} name={profile.display_name} fixed />
      )}
      <Footer />
    </>
  );
}
