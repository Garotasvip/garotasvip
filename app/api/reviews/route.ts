import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { moderateComment } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { profile_id, rating, comment } = await request.json();

    // Validação básica
    if (!profile_id || !rating || !comment) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Nota inválida." }, { status: 400 });
    }
    if (comment.length < 10 || comment.length > 500) {
      return NextResponse.json({ error: "Comentário inválido." }, { status: 400 });
    }

    // Gera token server-side (IP real + data)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const today = new Date().toISOString().split("T")[0];
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(`${ip}:${today}`));
    const authorToken = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Moderação automática
    const isApproved = !moderateComment(comment);

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert({ profile_id, author_token: authorToken, rating, comment, is_approved: isApproved })
      .select()
      .single();

    if (error) {
      if (error.message?.includes("já avaliou") || error.code === "23505") {
        return NextResponse.json({ error: "Você já avaliou este perfil hoje." }, { status: 429 });
      }
      return NextResponse.json({ error: "Erro ao salvar avaliação." }, { status: 500 });
    }

    // Recalcula trust score
    await supabase.rpc("recalculate_trust_score", { p_profile_id: profile_id });

    return NextResponse.json({ review: data, isApproved });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
