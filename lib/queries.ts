// Funções server-side — usar apenas em Server Components e Route Handlers
import { createServerSupabaseClient } from "@/lib/supabase-server";

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
  if (priceMax) query = query.lte("price_to", priceMax);
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

export async function getAdminMetrics() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalActive },
    { count: totalPending },
    { count: totalSuspended },
    { count: totalPremium },
    { count: videosQueue },
    { count: flaggedReviews },
    recentProfiles,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "suspended"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_premium", true),
    supabase.from("verification_videos").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reviews").select("*", { count: "exact", head: true }).gte("flag_count", 3).eq("is_approved", true),
    supabase.from("profiles")
      .select("id, display_name, city, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totalActive: totalActive ?? 0,
    totalPending: totalPending ?? 0,
    totalSuspended: totalSuspended ?? 0,
    totalPremium: totalPremium ?? 0,
    videosQueue: videosQueue ?? 0,
    flaggedReviews: flaggedReviews ?? 0,
    recentProfiles: recentProfiles.data ?? [],
  };
}
