export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          slug: string;
          city: string | null;
          birth_date: string | null;
          description: string | null;
          services: string[] | null;
          price_from: number | null;
          price_to: number | null;
          whatsapp_number: string | null;
          availability: Json | null;
          is_whatsapp_verified: boolean;
          is_video_verified: boolean;
          is_premium: boolean;
          premium_until: string | null;
          trust_score: number;
          status: string;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      profile_photos: {
        Row: {
          id: string;
          profile_id: string;
          storage_path: string;
          is_cover: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profile_photos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["profile_photos"]["Insert"]>;
      };
      verification_videos: {
        Row: {
          id: string;
          profile_id: string;
          storage_path: string;
          status: string;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["verification_videos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["verification_videos"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          profile_id: string;
          author_token: string;
          rating: number;
          comment: string;
          is_approved: boolean;
          is_flagged: boolean;
          flag_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      review_replies: {
        Row: {
          id: string;
          review_id: string;
          profile_id: string;
          reply_text: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["review_replies"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["review_replies"]["Insert"]>;
      };
      review_flags: {
        Row: {
          id: string;
          review_id: string;
          reason: string;
          reporter_token: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["review_flags"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["review_flags"]["Insert"]>;
      };
      premium_subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          stripe_session_id: string;
          plan: string;
          status: string;
          started_at: string | null;
          expires_at: string | null;
          amount_paid: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["premium_subscriptions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["premium_subscriptions"]["Insert"]>;
      };
    };
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string[]>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfilePhoto = Database["public"]["Tables"]["profile_photos"]["Row"];
export type VerificationVideo = Database["public"]["Tables"]["verification_videos"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewReply = Database["public"]["Tables"]["review_replies"]["Row"];
export type ReviewFlag = Database["public"]["Tables"]["review_flags"]["Row"];
export type PremiumSubscription = Database["public"]["Tables"]["premium_subscriptions"]["Row"];
