import { ShieldCheck, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  type: "video" | "whatsapp";
  size?: "sm" | "md";
}

export function VerifiedBadge({ type, size = "md" }: VerifiedBadgeProps) {
  const isVideo = type === "video";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        isVideo
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-emerald-100 text-emerald-700 border border-emerald-200",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      )}
    >
      {isVideo ? (
        <ShieldCheck className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      ) : (
        <MessageCircle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      )}
      {isVideo ? "Vídeo Verificado" : "WhatsApp Verificado"}
    </div>
  );
}
