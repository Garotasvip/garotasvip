// Funções client-side — seguras para usar em componentes "use client"
import { createClient } from "@/lib/supabase";

export async function upsertProfile(userId: string, values: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...values }, { onConflict: "user_id" })
    .select()
    .single();
  return { profile: data, error };
}

export async function incrementViewCount(profileId: string) {
  const supabase = createClient();
  await supabase.rpc("increment_view_count", { p_profile_id: profileId });
}

export async function submitReview(review: {
  profile_id: string;
  author_token: string;
  rating: number;
  comment: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();
  return { review: data, error };
}

export async function uploadProfilePhoto(
  file: File,
  profileId: string,
  isCover: boolean,
  sortOrder: number
) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${profileId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { upsert: false });

  if (uploadError) return { error: uploadError };

  const { error: dbError } = await supabase
    .from("profile_photos")
    .insert({ profile_id: profileId, storage_path: path, is_cover: isCover, sort_order: sortOrder });

  return { error: dbError, path };
}

export async function deleteProfilePhoto(photoId: string, storagePath: string) {
  const supabase = createClient();
  await supabase.storage.from("profile-photos").remove([storagePath]);
  const { error } = await supabase.from("profile_photos").delete().eq("id", photoId);
  return { error };
}

export async function uploadVerificationVideo(file: File, profileId: string) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${profileId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("verification-videos")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError };

  const { error: dbError } = await supabase
    .from("verification_videos")
    .upsert({ profile_id: profileId, storage_path: path, status: "pending" }, { onConflict: "profile_id" });

  return { error: dbError, path };
}
