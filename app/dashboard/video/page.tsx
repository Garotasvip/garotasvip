"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Upload, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { uploadVerificationVideo } from "@/lib/queries";
import { cn } from "@/lib/utils";

type VideoStatus = "none" | "uploading" | "pending" | "approved" | "rejected";

export default function VideoPage() {
  const [status, setStatus] = useState<VideoStatus>("none");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;
      setProfileId(profile.id);

      const { data: video } = await supabase
        .from("verification_videos")
        .select("status")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (video) setStatus(video.status as VideoStatus);
    }
    load();
  }, []);

  async function handleFile(file: File | null) {
    if (!file || !profileId) return;
    if (!file.type.startsWith("video/")) return;
    if (file.size > 50 * 1024 * 1024) { alert("Máximo 50MB."); return; }

    setVideoUrl(URL.createObjectURL(file));
    setStatus("uploading");

    const { error } = await uploadVerificationVideo(file, profileId);
    if (error) {
      setStatus("none");
      setVideoUrl(null);
      alert("Erro ao enviar vídeo. Tente novamente.");
      return;
    }

    setStatus("pending");
  }

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", title: "Vídeo em análise", desc: "Nossa equipe revisará em até 24 horas." },
    approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200", title: "Vídeo aprovado!", desc: "Você ganhou o selo de Vídeo Verificado e +25 pontos no Trust Score." },
    rejected: { icon: X, color: "text-red-600", bg: "bg-red-50 border-red-200", title: "Vídeo rejeitado", desc: "O vídeo não atendeu aos critérios. Envie um novo seguindo as instruções." },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vídeo de Verificação</h1>
        <p className="text-muted-foreground text-sm mt-1">Envie um vídeo curto para ganhar o selo de verificação e +25 pontos.</p>
      </div>

      {(status === "pending" || status === "approved" || status === "rejected") && (
        <div className={cn("rounded-2xl border p-5 flex gap-4", statusConfig[status].bg)}>
          {(() => {
            const { icon: Icon, color, title, desc } = statusConfig[status];
            return (
              <>
                <Icon className={cn("w-6 h-6 flex-shrink-0 mt-0.5", color)} />
                <div>
                  <p className={cn("font-semibold", color)}>{title}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{desc}</p>
                  {status === "rejected" && (
                    <Button size="sm" variant="outline" className="mt-3 border-red-300 text-red-600"
                      onClick={() => { setStatus("none"); setVideoUrl(null); }}>
                      Enviar novo vídeo
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {videoUrl && status !== "none" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-900">Seu vídeo</p>
            {status !== "approved" && status !== "pending" && (
              <button onClick={() => { setVideoUrl(null); setStatus("none"); }} className="text-muted-foreground hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <video src={videoUrl} controls className="w-full max-h-64 rounded-xl bg-black" />
          {status === "uploading" && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />Enviando vídeo...
            </div>
          )}
        </div>
      )}

      {status === "none" && (
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors",
            dragging ? "border-[#C2185B] bg-[#F8BBD9]/20" : "border-gray-200 hover:border-[#C2185B]/50 hover:bg-gray-50"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <Video className="w-12 h-12 text-[#C2185B]/40 mx-auto mb-4" />
          <p className="font-medium text-gray-700">Clique ou arraste o vídeo aqui</p>
          <p className="text-sm text-muted-foreground mt-1">MP4, MOV ou WEBM • Máx 50MB • Até 30 segundos</p>
          <input ref={inputRef} type="file" accept="video/*" className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Como gravar o vídeo</h2>
        <div className="space-y-3">
          {[
            "Grave um vídeo de até 30 segundos mostrando seu rosto claramente",
            'Segure um papel escrito "GarotasVip" + a data de hoje',
            "Fale seu nome de exibição no vídeo",
            "Certifique-se de ter boa iluminação e áudio claro",
          ].map((text, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#C2185B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
              <p className="text-sm text-gray-700 pt-1">{text}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#F8BBD9]/20 rounded-xl p-4 text-sm text-gray-700">
          <strong className="text-[#C2185B]">Privacidade:</strong> seu vídeo é visto apenas pela equipe de moderação e nunca será exibido publicamente.
        </div>
      </div>
    </div>
  );
}
