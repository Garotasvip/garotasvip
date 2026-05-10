"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, MapPin, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type VideoStatus = "pending" | "approved" | "rejected";

interface VideoItem {
  id: string;
  status: VideoStatus;
  storage_path: string;
  created_at: string;
  profiles: {
    id: string;
    display_name: string;
    city: string | null;
  };
}

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Aprovado", class: "bg-green-100 text-green-700" },
  rejected: { label: "Rejeitado", class: "bg-red-100 text-red-700" },
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const supabase = createClient();
    const { data } = await supabase
      .from("verification_videos")
      .select("id, status, storage_path, created_at, profiles(id, display_name, city)")
      .order("created_at", { ascending: false });

    setVideos((data as unknown as VideoItem[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(videoId: string, profileId: string, status: VideoStatus) {
    setUpdating(videoId);
    const supabase = createClient();

    await supabase
      .from("verification_videos")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", videoId);

    if (status === "approved") {
      await supabase
        .from("profiles")
        .update({ is_video_verified: true })
        .eq("id", profileId);

      // Recalcula trust score
      await supabase.rpc("recalculate_trust_score", { p_profile_id: profileId });
    }

    setVideos((prev) => prev.map((v) => v.id === videoId ? { ...v, status } : v));
    setUpdating(null);
  }

  function getVideoUrl(storagePath: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("verification-videos").getPublicUrl(storagePath);
    return data.publicUrl;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#C2185B]" />
      </div>
    );
  }

  const pending = videos.filter((v) => v.status === "pending");
  const reviewed = videos.filter((v) => v.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificação de Vídeos</h1>
        <p className="text-muted-foreground text-sm mt-1">Revise os vídeos e aprove ou rejeite a verificação.</p>
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
            <p>Nenhum vídeo pendente. Tudo em dia!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center">
                      <span className="text-[#C2185B] font-bold">{video.profiles.display_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{video.profiles.display_name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{video.profiles.city ?? "—"} · {new Date(video.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">Pendente</span>
                </div>

                {/* Player */}
                <div
                  className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setPlaying(playing === video.id ? null : video.id)}
                >
                  {playing === video.id ? (
                    <video
                      src={getVideoUrl(video.storage_path)}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                      <p className="text-xs text-gray-400">Clique para reproduzir</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
                    onClick={() => updateStatus(video.id, video.profiles.id, "approved")}
                    disabled={updating === video.id}
                  >
                    {updating === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Aprovar verificação
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-500 hover:bg-red-50 gap-2"
                    onClick={() => updateStatus(video.id, video.profiles.id, "rejected")}
                    disabled={updating === video.id}
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revisados */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Revisados recentemente</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {reviewed.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center">
                    <span className="text-[#C2185B] font-bold text-sm">{video.profiles.display_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{video.profiles.display_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(video.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", STATUS_CONFIG[video.status].class)}>
                  {STATUS_CONFIG[video.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
