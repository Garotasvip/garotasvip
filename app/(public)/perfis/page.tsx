import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileCard } from "@/components/ProfileCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { getActiveProfiles } from "@/lib/queries";
import { getCoverPhoto } from "@/lib/utils";

const PER_PAGE = 20;

interface PageProps {
  searchParams: {
    city?: string;
    priceMin?: string;
    priceMax?: string;
    ratingMin?: string;
    premium?: string;
    page?: string;
  };
}

export default async function PerfisPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));

  const { profiles, total } = await getActiveProfiles({
    city: searchParams.city,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
    ratingMin: searchParams.ratingMin ? Number(searchParams.ratingMin) : undefined,
    premiumOnly: searchParams.premium === "true",
    page,
    perPage: PER_PAGE,
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildPageUrl(p: number) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(p));
    return `/perfis?${params.toString()}`;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Encontrar Acompanhantes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {total} perfil{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
              {searchParams.city ? ` em ${searchParams.city}` : ""}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <Suspense>
              <SearchFilters />
            </Suspense>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5 lg:hidden">
                <Suspense><SearchFilters /></Suspense>
                <span className="text-sm text-muted-foreground">{total} perfis</span>
              </div>

              {profiles.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">Nenhum perfil encontrado.</p>
                  <Link href="/perfis">
                    <Button variant="outline" className="mt-4 border-[#C2185B] text-[#C2185B]">Limpar filtros</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {profiles.map((p: Record<string, unknown>) => {
                      const photos = (p.profile_photos as { storage_path: string; is_cover: boolean }[]) ?? [];
                      return (
                        <ProfileCard
                          key={p.id as string}
                          slug={p.slug as string}
                          displayName={p.display_name as string}
                          city={(p.city as string) ?? "—"}
                          priceFrom={p.price_from as number | null}
                          priceTo={p.price_to as number | null}
                          coverPhoto={getCoverPhoto(photos)}
                          averageRating={0}
                          reviewCount={0}
                          trustScore={Math.round(p.trust_score as number)}
                          isVideoVerified={p.is_video_verified as boolean}
                          isWhatsappVerified={p.is_whatsapp_verified as boolean}
                          isPremium={p.is_premium as boolean}
                          viewCount={p.view_count as number}
                        />
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      {page > 1 && (
                        <Link href={buildPageUrl(page - 1)}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ChevronLeft className="w-4 h-4" />Anterior
                          </Button>
                        </Link>
                      )}
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                          .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                            acc.push(p);
                            return acc;
                          }, [])
                          .map((item, idx) =>
                            item === "..." ? (
                              <span key={`d${idx}`} className="px-2 py-1 text-muted-foreground text-sm">...</span>
                            ) : (
                              <Link key={item} href={buildPageUrl(item as number)}>
                                <Button variant={item === page ? "default" : "outline"} size="sm"
                                  className={item === page ? "bg-[#C2185B] hover:bg-[#C2185B]/90 text-white" : ""}>
                                  {item}
                                </Button>
                              </Link>
                            )
                          )}
                      </div>
                      {page < totalPages && (
                        <Link href={buildPageUrl(page + 1)}>
                          <Button variant="outline" size="sm" className="gap-1">
                            Próximo<ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
