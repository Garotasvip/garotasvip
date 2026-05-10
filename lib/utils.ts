import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateAuthorToken(ip: string): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const data = new TextEncoder().encode(`${ip}:${today}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getStorageUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function getCoverPhoto(photos: { storage_path: string; is_cover: boolean }[]): string | null {
  if (!photos || photos.length === 0) return null;
  const cover = photos.find((p) => p.is_cover) ?? photos[0];
  return getStorageUrl("profile-photos", cover.storage_path);
}

const BLOCKED_WORDS = ["spam", "fraude", "golpe"];

export function moderateComment(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => lower.includes(word));
}
