"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, Star, Flag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlaggedReview {
  id: string;
  profileName: string;
  city: string;
  rating: number;
  comment: string;
  flagCount: number;
  flagReasons: string[];
  createdAt: string;
  status: "pending" | "kept" | "removed";
}

const MOCK_REVIEWS: FlaggedReview[] = [
  {
    id: "1", profileName: "Ana Silva", city: "São Paulo", rating: 1,
    comment: "Essa pessoa é uma fraude total, não recomendo de jeito nenhum!",
    flagCount: 4, flagReasons: ["Conteúdo falso", "Linguagem ofensiva", "Spam"],
    createdAt: "há 1h", status: "pending",
  },
  {
    id: "2", profileName: "Julia Santos", city: "Rio de Janeiro", rating: 2,
    comment: "Atendimento péssimo, completamente diferente das fotos.",
    flagCount: 3, flagReasons: ["Conteúdo falso", "Informação incorreta"],
    createdAt: "há 3h", status: "pending",
  },
  {
    id: "3", profileName: "Carla Mendes", city: "BH", rating: 1,
    comment: "GOLPE! Não paguem! É tudo mentira o que está escrito aqui.",
    flagCount: 5, flagReasons: ["Spam", "Conteúdo falso", "Linguagem ofensiva", "Outro"],
    createdAt: "há 5h", status: "pending",
  },
  {
    id: "4", profileName: "Fernanda Costa", city: "Brasília", rating: 3,
    comment: "Atendimento ok, mas poderia ser melhor.",
    flagCount: 3, flagReasons: ["Conteúdo falso"],
    createdAt: "há 1d", status: "kept",
  },
  {
    id: "5", profileName: "Paula Lima", city: "Curitiba", rating: 1,
    comment: "Conteúdo removido pela moderação.",
    flagCount: 6, flagReasons: ["Spam", "Linguagem ofensiva"],
    createdAt: "há 2d", status: "removed",
  },
];

export default function ModeracaoPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  function updateStatus(id: string, status: "kept" | "removed") {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }

  const pending = reviews.filter((r) => r.status === "pending");
  const resolved = reviews.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderação de Comentários</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Avaliações denunciadas por 3 ou mais usuários aguardam revisão.
        </p>
      </div>

      {/* Pendentes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-semibold text-gray-900">Aguardando revisão</h2>
          {pending.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
            <p>Nenhum comentário pendente. Tudo em dia!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onKeep={() => updateStatus(review.id, "kept")}
                onRemove={() => updateStatus(review.id, "removed")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resolvidos */}
      {resolved.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Resolvidos recentemente</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {resolved.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{review.profileName}</p>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{review.comment}</p>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0",
                  review.status === "kept" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {review.status === "kept" ? "Mantido" : "Removido"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, onKeep, onRemove }: {
  review: FlaggedReview;
  onKeep: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-gray-900">{review.profileName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{review.city}
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
          <span className="text-xs font-bold text-red-600">{review.flagCount} denúncias</span>
        </div>
      </div>

      {/* Comentário */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-800 leading-relaxed">"{review.comment}"</p>
        <p className="text-xs text-muted-foreground mt-2">Enviado {review.createdAt}</p>
      </div>

      {/* Motivos de denúncia */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-700">Motivos relatados:</p>
        <div className="flex flex-wrap gap-1.5">
          {review.flagReasons.map((reason) => (
            <span key={reason} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2.5 py-0.5">
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-1">
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
          onClick={onKeep}
        >
          <CheckCircle2 className="w-4 h-4" />
          Manter comentário
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-red-200 text-red-500 hover:bg-red-50 gap-2"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
          Remover
        </Button>
      </div>
    </div>
  );
}
