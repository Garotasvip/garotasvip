"use client";

import { useState } from "react";
import { Star, Flag, Send, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
}

interface ReviewSectionProps {
  profileId: string;
  profileSlug: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Selecione uma avaliação").max(5),
  comment: z.string().min(10, "Comentário deve ter pelo menos 10 caracteres").max(500),
});

type ReviewForm = z.infer<typeof reviewSchema>;

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
          aria-label={`${star} estrelas`}
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors",
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-muted-foreground">{rating}</span>
      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 text-muted-foreground text-right">{count}</span>
    </div>
  );
}

export function ReviewSection({
  profileId,
  reviews,
  averageRating,
  totalReviews,
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<ReviewForm>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0 } });

  const rating = watch("rating");

  // Distribuição de estrelas
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    rating: s,
    count: localReviews.filter((r) => Math.round(r.rating) === s).length,
  }));

  async function onSubmit(data: ReviewForm) {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profileId,
        rating: data.rating,
        comment: data.comment,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error ?? "Erro ao enviar avaliação.");
      return;
    }

    const newReview: Review = {
      id: json.review?.id ?? crypto.randomUUID(),
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    reset();
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Avaliações</h2>

      {/* Resumo */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Nota geral */}
          <div className="text-center flex-shrink-0">
            <p className="text-6xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "w-4 h-4",
                    s <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{totalReviews} avaliações</p>
          </div>

          {/* Barras */}
          <div className="flex-1 space-y-2 justify-center flex flex-col">
            {dist.map((d) => (
              <RatingBar key={d.rating} rating={d.rating} count={d.count} total={totalReviews} />
            ))}
          </div>
        </div>

        {/* Botão avaliar */}
        {!submitted ? (
          <div className="mt-5 pt-5 border-t border-gray-100">
            {!showForm ? (
              <Button
                variant="outline"
                className="w-full border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                onClick={() => setShowForm(true)}
              >
                <Star className="w-4 h-4 mr-2" />
                Avaliar este perfil
              </Button>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Sua nota</p>
                  <StarPicker value={rating} onChange={(v) => setValue("rating", v)} />
                  {errors.rating && (
                    <p className="text-red-500 text-xs">{errors.rating.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Comentário</p>
                  <Textarea
                    placeholder="Conte sua experiência (mínimo 10 caracteres)..."
                    rows={3}
                    {...register("comment")}
                    className={errors.comment ? "border-red-500" : ""}
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs">{errors.comment.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#C2185B] hover:bg-[#C2185B]/90 text-white gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-sm text-green-600 text-center font-medium">
              ✓ Obrigada pela sua avaliação!
            </p>
          </div>
        )}
      </div>

      {/* Lista de comentários */}
      {localReviews.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>Nenhuma avaliação ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  {/* Estrelas */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-4 h-4",
                          s <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Denúncia */}
                <FlagButton reviewId={review.id} />
              </div>

              {/* Resposta do perfil */}
              {review.reply && (
                <div className="mt-3 pl-4 border-l-2 border-[#F8BBD9]">
                  <p className="text-xs font-semibold text-[#C2185B] mb-1">Resposta do perfil</p>
                  <p className="text-sm text-gray-700">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FlagButton({ reviewId }: { reviewId: string }) {
  const [flagged, setFlagged] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleFlag() {
    const today = new Date().toISOString().split("T")[0];
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(`flag:${today}`));
    const reporterToken = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();

    await supabase.from("review_flags").insert({
      review_id: reviewId,
      reason: "Conteúdo inadequado",
      reporter_token: reporterToken,
    });

    await supabase.rpc("increment_flag_count" as never, { p_review_id: reviewId } as never);

    setFlagged(true);
    setShowConfirm(false);
  }

  if (flagged) {
    return <span className="text-xs text-muted-foreground">Denunciado</span>;
  }

  return showConfirm ? (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">Denunciar?</p>
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setShowConfirm(false)}>
          Não
        </Button>
        <Button size="sm" className="h-7 text-xs px-2 bg-red-500 hover:bg-red-600 text-white" onClick={handleFlag}>
          Sim
        </Button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
      title="Denunciar avaliação"
    >
      <Flag className="w-4 h-4" />
    </button>
  );
}
