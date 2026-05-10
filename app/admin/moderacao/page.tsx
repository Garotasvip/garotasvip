"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Trash2, Star, Flag, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface FlaggedReview {
  id: string;
  rating: number;
  comment: string;
  flag_count: number;
  is_approved: boolean;
  created_at: string;
  profiles: {
    display_name: string;
    city: string | null;
  };
  review_flags: {
    reason: string;
  }[];
}

export default function ModeracaoPage() {
  const [reviews, setReviews] = useState<FlaggedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, comment, flag_count, is_approved, created_at, profiles(display_name, city), review_flags(reason)")
      .gte("flag_count", 3)
      .order("flag_count", { ascending: false });

    setReviews((data as unknown as FlaggedReview[]) ?? []);
    setLoading(false);
  }

  async function keepReview(id: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("reviews").update({ flag_count: 0, is_flagged: false }).eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setUpdating(null);
  }

  async function removeReview(id: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("reviews").update({ is_approved: false }).eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setUpdating(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#C2185B]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderação de Comentários</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Avaliações denunciadas por 3 ou mais usuários aguardam revisão.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
          <p>Nenhum comentário pendente. Tudo em dia!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reasons = Array.from(new Set(review.review_flags.map((f) => f.reason)));
            return (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-gray-900">{review.profiles.display_name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{review.profiles.city ?? "—"}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn("w-4 h-4", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 flex-shrink-0">
                    <Flag className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-xs font-bold text-red-600">{review.flag_count} denúncias</span>
                  </div>
                </div>

                {/* Comentário */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-800 leading-relaxed">"{review.comment}"</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Motivos */}
                {reasons.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-700">Motivos relatados:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {reasons.map((reason) => (
                        <span key={reason} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2.5 py-0.5">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-1">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
                    onClick={() => keepReview(review.id)}
                    disabled={updating === review.id}
                  >
                    {updating === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Manter comentário
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-500 hover:bg-red-50 gap-2"
                    onClick={() => removeReview(review.id)}
                    disabled={updating === review.id}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
