export interface TrustScoreFactors {
  averageRating: number;
  isVideoVerified: boolean;
  isWhatsappVerified: boolean;
  photoCount: number;
}

export function calculateTrustScore(factors: TrustScoreFactors): number {
  let score = 0;

  // Média das avaliações × 20 × 0,5 = até 50 pontos
  if (factors.averageRating > 0) {
    score += factors.averageRating * 20 * 0.5;
  }

  if (factors.isVideoVerified) score += 25;
  if (factors.isWhatsappVerified) score += 15;
  if (factors.photoCount >= 3) score += 10;

  return Math.min(Math.round(score), 100);
}

export function getTrustScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

export function getTrustScoreLabel(score: number): string {
  if (score >= 70) return "Alta Confiança";
  if (score >= 40) return "Confiança Média";
  return "Baixa Confiança";
}
