"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Play, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VideoStatus = "pending" | "approved" | "rejected";

interface VideoItem {
  id: string;
  profileName: string;
  city: string;
  submittedAt: string;
  status: VideoStatus;
  videoUrl: string;
}

const MOCK_VIDEOS: VideoItem[] = [
  { id: "1", profileName: "Ana Silva", city: "São Paulo", submittedAt: "há 2h", status: "pending", videoUrl: "" },
  { id: "2", profileName: "Julia Santos", city: "Rio de Janeiro", submittedAt: "há 5h", status: "pending", videoUrl: "" },
  { id: "3", profileName: "Carla Mendes", city: "Belo Horizonte", submittedAt: "há 8h", status: "pending", videoUrl: "" },
  { id: "4", profileName: "Fernanda Costa", city: "Brasília", submittedAt: "há 1d", status: "approved", videoUrl: "" },
  { id: "5", profileName: "Paula Lima", city: "Curitiba", submittedAt: "há 2d", status: "rejected", videoUrl: "" },
];

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved: { label: "Aprovado", class: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Rejeitado", class: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [playing, setPlaying] = useState<string | null>(null);

  function updateStatus(id: string, status: VideoStatus) {
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
    if (playing === id) setPlaying(null);
  }

  const pending = videos.filter((v) => v.status === "pending");
  const reviewed = videos.filter((v) => v.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificação de Vídeos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Revise os vídeos enviados e aprove ou rejeite a verificação.
        </p>
      </div>

      {/* Fila pendente */}
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
              <VideoCard
                key={video.id}
                video={video}
                isPlaying={playing === video.id}
                onTogglePlay={() => setPlaying(playing === video.id ? null : video.id)}
                onApprove={() => updateStatus(video.id, "approved")}
                onReject={() => updateStatus(video.id, "rejected")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Revisados */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Revisados recentemente</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {reviewed.map((video) => {
              const cfg = STATUS_CONFIG[video.status];
              return (
                <div key={video.id} className="flex items-center justify-between p-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center">
                      <span className="text-[#C2185B] font-bold text-sm">{video.profileName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{video.profileName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{video.city} · {video.submittedAt}
                      </div>
                    </div>
                  </div>
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", cfg.class)}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video, isPlaying, onTogglePlay, onApprove, onReject,
}: {
  video: VideoItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F8BBD9]/40 flex items-center justify-center">
            <span className="text-[#C2185B] font-bold">{video.profileName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{video.profileName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />{video.city} · enviado {video.submittedAt}
            </div>
          </div>
        </div>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
          Pendente
        </span>
      </div>

      {/* Player */}
      <div
        className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
        onClick={onTogglePlay}
      >
        {video.videoUrl ? (
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover"
            controls={isPlaying}
            autoPlay={isPlaying}
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

      {/* Ações */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
          onClick={onApprove}
        >
          <CheckCircle2 className="w-4 h-4" />
          Aprovar verificação
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-red-200 text-red-500 hover:bg-red-50 gap-2"
          onClick={onReject}
        >
          <XCircle className="w-4 h-4" />
          Rejeitar
        </Button>
      </div>
    </div>
  );
}
