"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Star, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { uploadProfilePhoto, deleteProfilePhoto } from "@/lib/mutations";
import { getStorageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PhotoItem {
  id: string;
  url: string;
  storagePath: string;
  isCover: boolean;
  uploading?: boolean;
}

const MAX_PHOTOS = 10;

export default function FotosPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, profile_photos(id, storage_path, is_cover, sort_order)")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        const existing = (profile.profile_photos as { id: string; storage_path: string; is_cover: boolean; sort_order: number }[]) ?? [];
        setPhotos(
          existing
            .sort((a, b) => (a.is_cover ? -1 : b.is_cover ? 1 : a.sort_order - b.sort_order))
            .map((p) => ({
              id: p.id,
              url: getStorageUrl("profile-photos", p.storage_path),
              storagePath: p.storage_path,
              isCover: p.is_cover,
            }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || !profileId) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining).filter((f) => f.type.startsWith("image/"));

    for (const file of toAdd) {
      const tempId = crypto.randomUUID();
      const tempUrl = URL.createObjectURL(file);
      const isCover = photos.length === 0;

      setPhotos((prev) => [...prev, { id: tempId, url: tempUrl, storagePath: "", isCover, uploading: true }]);

      const { path, error } = await uploadProfilePhoto(file, profileId, isCover, photos.length);

      if (error || !path) {
        setPhotos((prev) => prev.filter((p) => p.id !== tempId));
        toast.error("Erro ao enviar foto. Verifique o arquivo e tente novamente.");
        continue;
      }

      // Busca o id real do banco
      const supabase = createClient();
      const { data } = await supabase
        .from("profile_photos")
        .select("id")
        .eq("profile_id", profileId)
        .eq("storage_path", path)
        .single();

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === tempId
            ? { ...p, id: data?.id ?? tempId, storagePath: path, uploading: false }
            : p
        )
      );
      toast.success("Foto enviada com sucesso!");
    }
  }

  async function setCover(id: string) {
    setPhotos((prev) => prev.map((p) => ({ ...p, isCover: p.id === id })));
    const supabase = createClient();
    if (!profileId) return;
    await supabase.from("profile_photos").update({ is_cover: false }).eq("profile_id", profileId);
    await supabase.from("profile_photos").update({ is_cover: true }).eq("id", id);
  }

  async function removePhoto(photo: PhotoItem) {
    if (photo.uploading) return;
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photo.id);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) filtered[0].isCover = true;
      return filtered;
    });
    await deleteProfilePhoto(photo.id, photo.storagePath);
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
        <h1 className="text-2xl font-bold text-gray-900">Minhas Fotos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Adicione até {MAX_PHOTOS} fotos. A foto com ⭐ será a capa do seu perfil.
        </p>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
          dragging ? "border-[#C2185B] bg-[#F8BBD9]/20" : "border-gray-200 hover:border-[#C2185B]/50 hover:bg-gray-50",
          photos.length >= MAX_PHOTOS && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="w-10 h-10 text-[#C2185B]/50 mx-auto mb-3" />
        <p className="font-medium text-gray-700">
          {photos.length >= MAX_PHOTOS ? "Limite atingido" : "Clique ou arraste as fotos aqui"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          JPG, PNG ou WEBP • Máx 5MB • {photos.length}/{MAX_PHOTOS} fotos
        </p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {photos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhuma foto ainda.</p>
          <p className="text-sm">Adicione pelo menos 3 para +10 pontos no Trust Score.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={photo.url} alt="Foto" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setCover(photo.id)} title="Definir como capa"
                  className="bg-white/90 rounded-full p-3 hover:bg-yellow-400 hover:text-white transition-colors">
                  <Star className="w-5 h-5" />
                </button>
                <button onClick={() => removePhoto(photo)} title="Remover"
                  className="bg-white/90 rounded-full p-3 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {photo.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              {photo.isCover && !photo.uploading && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-900" />Capa
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#F8BBD9]/20 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold text-[#C2185B]">Dicas para boas fotos</p>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Use fotos com boa iluminação natural</li>
          <li>Prefira fotos nítidas e recentes</li>
          <li>3 ou mais fotos aumentam seu Trust Score em +10 pontos</li>
        </ul>
      </div>
    </div>
  );
}
