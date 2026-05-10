"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileGalleryProps {
  photos: string[];
  name: string;
}

export function ProfileGallery({ photos, name }: ProfileGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  function prev() {
    setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  }

  function next() {
    setLightbox((i) => (i !== null ? (i + 1) % photos.length : null));
  }

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-[#F8BBD9]/20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <ImageIcon className="w-12 h-12 opacity-30" />
        <p className="text-sm">Sem fotos cadastradas</p>
      </div>
    );
  }

  const [cover, ...rest] = photos;

  return (
    <>
      {/* Grid de fotos */}
      <div
        className={cn(
          "grid gap-2 rounded-2xl overflow-hidden",
          photos.length === 1 && "grid-cols-1",
          photos.length === 2 && "grid-cols-2",
          photos.length >= 3 && "grid-cols-2"
        )}
      >
        {/* Foto principal */}
        <div
          className={cn(
            "relative cursor-pointer overflow-hidden bg-gray-100",
            photos.length >= 3 ? "row-span-2 aspect-[3/4]" : "aspect-[3/4]"
          )}
          onClick={() => setLightbox(0)}
        >
          <Image
            src={cover}
            alt={`Foto de ${name}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Fotos secundárias */}
        {rest.slice(0, 4).map((photo, idx) => (
          <div
            key={idx}
            className="relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
            onClick={() => setLightbox(idx + 1)}
          >
            <Image
              src={photo}
              alt={`Foto ${idx + 2} de ${name}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay "+X" na última foto se houver mais */}
            {idx === 3 && photos.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{photos.length - 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Fechar */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Contador */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox + 1} / {photos.length}
          </span>

          {/* Imagem */}
          <div
            className="relative w-full max-w-2xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox]}
              alt={`Foto ${lightbox + 1} de ${name}`}
              width={800}
              height={1000}
              className="object-contain w-full max-h-[85vh] rounded-xl"
            />
          </div>

          {/* Navegar */}
          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white/70 hover:text-white bg-black/40 rounded-full p-2"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-2"
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
