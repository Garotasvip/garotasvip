import { cn } from "@/lib/utils";
import { getTrustScoreColor, getTrustScoreLabel } from "@/lib/trust-score";
import { Info } from "lucide-react";

interface TrustScoreBarProps {
  score: number;
  showDetails?: boolean;
}

export function TrustScoreBar({ score, showDetails = false }: TrustScoreBarProps) {
  const color = getTrustScoreColor(score);
  const label = getTrustScoreLabel(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-900">Trust Score</span>
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              score >= 70 ? "bg-green-100 text-green-700" :
              score >= 40 ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            )}
          >
            {label}
          </span>
          <span className="text-sm font-bold text-gray-900">{score}/100</span>
        </div>
      </div>

      {/* Barra */}
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Detalhes dos critérios */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { label: "Avaliações", points: "até 50pts" },
            { label: "Vídeo verificado", points: "+25pts" },
            { label: "WhatsApp verificado", points: "+15pts" },
            { label: "3+ fotos", points: "+10pts" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-xs text-muted-foreground">
              <span>{item.label}</span>
              <span className="font-medium text-gray-500">{item.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
