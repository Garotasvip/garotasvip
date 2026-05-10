"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ShieldCheck, MessageCircle, Crown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getTrustScoreColor, getTrustScoreLabel } from "@/lib/trust-score";

export interface ProfileCardProps {
  slug: string;
  displayName: string;
  city: string;
  priceFrom: number | null;
  priceTo: number | null;
  coverPhoto: string | null;
  averageRating: number;
  reviewCount: number;
  trustScore: number;
  isVideoVerified: boolean;
  isWhatsappVerified: boolean;
  isPremium: boolean;
  viewCount?: number;
}

export function ProfileCard({
  slug,
  displayName,
  city,
  priceFrom,
  priceTo,
  coverPhoto,
  averageRating,
  reviewCount,
  trustScore,
  isVideoVerified,
  isWhatsappVerified,
  isPremium,
  viewCount,
}: ProfileCardProps) {
  const priceLabel = formatPrice(priceFrom, priceTo);

  return (
    <Link href={`/perfis/${slug}`} className="group block focus:outline-none">
      <article
        className={cn(
          "relative rounded-2xl overflow-hidden bg-white shadow-md",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:-translate-y-1",
          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          isPremium && "ring-2 ring-[#C2185B] ring-offset-1"
        )}
      >
        {/* Foto de capa */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F8BBD9]/30">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={isPremium}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F8BBD9] to-[#C2185B]/20">
              <span className="text-5xl text-[#C2185B]/40 font-bold select-none">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Gradiente inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Badge Premium */}
          {isPremium && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#C2185B] text-white border-0 shadow-lg gap-1 text-xs font-semibold px-2 py-0.5">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            </div>
          )}

          {/* Selos de verificação */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isVideoVerified && (
              <div
                title="Vídeo Verificado"
                className="bg-green-500 text-white rounded-full p-1 shadow-md"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
            {isWhatsappVerified && (
              <div
                title="WhatsApp Verificado"
                className="bg-emerald-500 text-white rounded-full p-1 shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Visualizações */}
          {viewCount !== undefined && viewCount > 0 && (
            <div className="absolute bottom-[4.5rem] right-2 flex items-center gap-1 text-white/70 text-xs">
              <Eye className="w-3 h-3" />
              <span>{formatViewCount(viewCount)}</span>
            </div>
          )}

          {/* Nome e cidade sobre a foto */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-base leading-tight truncate drop-shadow">
              {displayName}
            </h3>
            <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          </div>
        </div>

        {/* Rodapé do card */}
        <div className="p-3 space-y-2">
          {/* Preço */}
          {priceLabel && (
            <p className="text-[#C2185B] font-semibold text-sm">{priceLabel}</p>
          )}

          {/* Avaliação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <StarRating rating={averageRating} />
              {reviewCount > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({reviewCount})
                </span>
              )}
            </div>
          </div>

          {/* Trust Score */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{getTrustScoreLabel(trustScore)}</span>
              <span className="font-medium text-foreground">{trustScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getTrustScoreColor(trustScore)
                )}
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Sub-componentes ────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-3.5 h-3.5",
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────

function formatPrice(from: number | null, to: number | null): string {
  if (!from && !to) return "";
  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return `A partir de ${fmt(from)}`;
  if (to) return `Até ${fmt(to)}`;
  return "";
}

function formatViewCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
