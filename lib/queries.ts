import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createClient } from "@/lib/supabase";

// ─── Perfis ─────────────────────────────────────────────────

export async function getActiveProfiles({
  city,
  priceMin,
  priceMax,
  ratingMin,
  premiumOnly,
  page = 1,
  perPage = 20,
}: {
  city?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  premiumOnly?: boolean;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("profiles")
    .select("*, profile_photos(storage_path, is_cover)", { count: "exact" })
    .eq("status", "active")
    .order("is_premium", { ascending: false })
    .order("trust_score", { ascending: false })
    .range(from, to);

  if (city) query = query.ilike("city", `%${city}%`);
  if (priceMin) query = query.gte("price_from", priceMin);
  if (priceMax) query = query.lte("price_from", priceMax);
  if (ratingMin) query = query.gte("trust_score", ratingMin * 20);
  if (premiumOnly) query = query.eq("is_premium", true);

  const { data, count, error } = await query;
  return { profiles: data ?? [], total: count ?? 0, error };
}

export async function getFeaturedProfiles(limit = 6) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_photos(storage_path, is_cover)")
    .eq("status", "active")
    .eq("is_premium", true)
    .order("trust_score", { ascending: false })
    .limit(limit);

  return { profiles: data ?? [], error };
}

export async function getRecentProfiles(limit = 8) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_photos(storage_path, is_cover)")
    .eq("status", "active")
    .eq("is_premium", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { profiles: data ?? [], error };
}

export async function getProfileBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_photos(id, storage_path, is_cover, sort_order)")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  return { profile: data, error };
}

export async function getProfileReviews(profileId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, review_replies(reply_text)")
    .eq("profile_id", profileId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return { reviews: data ?? [], error };
}

export async function getProfileByUserId(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, profile_photos(id, storage_path, is_cover, sort_order)")
    .eq("user_id", userId)
    .single();

  return { profile: data, error };
}

// ─── Mutações (client-side) ──────────────────────────────────

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
