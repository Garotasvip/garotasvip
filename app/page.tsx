import Link from "next/link";
import { ShieldCheck, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getFeaturedProfiles, getRecentProfiles } from "@/lib/queries";
import { getCoverPhoto } from "@/lib/utils";
import { HeroSearch } from "@/components/HeroSearch";

function toCardProps(profile: Record<string, unknown>) {
  const photos = (profile.profile_photos as { storage_path: string; is_cover: boolean }[]) ?? [];
  return {
    slug: profile.slug as string,
    displayName: profile.display_name as string,
    city: (profile.city as string) ?? "—",
    priceFrom: profile.price_from as number | null,
    priceTo: profile.price_to as number | null,
    coverPhoto: getCoverPhoto(photos),
    averageRating: (profile.trust_score as number) >= 50 ? 4.5 : 3.5,
    reviewCount: 0,
    trustScore: Math.round(profile.trust_score as number),
    isVideoVerified: profile.is_video_verified as boolean,
    isWhatsappVerified: profile.is_whatsapp_verified as boolean,
    isPremium: profile.is_premium as boolean,
    viewCount: profile.view_count as number,
  };
}

export default async function Home() {
  const [{ profiles: featured }, { profiles: recent }] = await Promise.all([
    getFeaturedProfiles(6),
    getRecentProfiles(8),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-[#C2185B] via-[#E91E8C] to-[#F8BBD9] text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
              Encontre acompanhantes<br />
              <span className="text-[#F8BBD9]">verificadas perto de você</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
              Perfis com verificação real, avaliações honestas e total segurança.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <HeroSearch />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#F8BBD9]" />Perfis verificados</div>
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#F8BBD9]" />Avaliações reais</div>
              <div className="flex items-center gap-1.5"><Crown className="w-4 h-4 text-[#F8BBD9]" />Destaque premium</div>
            </div>
          </div>
        </section>

        {/* ── Destaques Premium ────────────────────────────── */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-[#C2185B]" />
                  <h2 className="text-xl font-bold text-gray-900">Destaques Premium</h2>
                </div>
                <p className="text-sm text-muted-foreground">Perfis verificados em destaque</p>
              </div>
              <Link href="/perfis?premium=true">
                <Button variant="ghost" size="sm" className="text-[#C2185B]">Ver todos →</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featured.map((p) => (
                <ProfileCard key={p.id as string} {...toCardProps(p as Record<string, unknown>)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Estatísticas ─────────────────────────────────── */}
        <div className="bg-[#F8BBD9]/20 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { label: "Perfis ativos", value: "1.200+" },
                { label: "Cidades", value: "180+" },
                { label: "Avaliações", value: "8.400+" },
                { label: "Verificados", value: "640+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-[#C2185B]">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Perfis Recentes ───────────────────────────────── */}
        {recent.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Perfis Recentes</h2>
                <p className="text-sm text-muted-foreground">Novidades na plataforma</p>
              </div>
              <Link href="/perfis">
                <Button variant="ghost" size="sm" className="text-[#C2185B]">Ver todos →</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recent.map((p) => (
                <ProfileCard key={p.id as string} {...toCardProps(p as Record<string, unknown>)} />
              ))}
            </div>
          </section>
        )}

        {/* Se não há perfis ainda */}
        {featured.length === 0 && recent.length === 0 && (
          <section className="max-w-2xl mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground text-lg">Nenhum perfil ativo ainda.</p>
            <p className="text-sm text-muted-foreground mt-2">Cadastre-se e seja o primeiro!</p>
            <Link href="/cadastro" className="mt-6 inline-block">
              <Button className="bg-[#C2185B] hover:bg-[#C2185B]/90 text-white">Criar perfil</Button>
            </Link>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#C2185B] to-[#E91E8C] text-white py-10 sm:py-14">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Quer anunciar seu perfil?</h2>
            <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8">Crie sua conta gratuitamente e alcance milhares de clientes todos os dias.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/cadastro">
                <Button size="lg" className="bg-white text-[#C2185B] hover:bg-white/90 font-semibold px-10">Criar conta grátis</Button>
              </Link>
              <Link href="/perfis">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white px-10">Explorar perfis</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
