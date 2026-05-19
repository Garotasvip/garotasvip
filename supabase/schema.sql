-- ============================================================
-- MARKETPLACE ADULTO - Schema Supabase
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- TABELA: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(100),
  birth_date DATE,
  description TEXT,
  services TEXT[],
  restrictions TEXT[],
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  whatsapp_number VARCHAR(20),
  availability JSONB,
  is_whatsapp_verified BOOLEAN DEFAULT false,
  is_video_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  trust_score DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','active','suspended')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: profile_photos
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: verification_videos
CREATE TABLE IF NOT EXISTS public.verification_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_token VARCHAR(64) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Constraint: 1 avaliação por token por perfil por dia (enforced via trigger)
CREATE OR REPLACE FUNCTION check_review_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.reviews
    WHERE profile_id = NEW.profile_id
      AND author_token = NEW.author_token
      AND created_at::date = NOW()::date
  ) THEN
    RAISE EXCEPTION 'Você já avaliou este perfil hoje.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_review_limit
  BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION check_review_limit();

-- TABELA: review_replies
CREATE TABLE IF NOT EXISTS public.review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Apenas 1 resposta por avaliação
CREATE UNIQUE INDEX IF NOT EXISTS idx_review_replies_unique
  ON public.review_replies (review_id);

-- TABELA: review_flags
CREATE TABLE IF NOT EXISTS public.review_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  reason VARCHAR(200) NOT NULL,
  reporter_token VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Apenas 1 denúncia por token por avaliação
CREATE UNIQUE INDEX IF NOT EXISTS idx_review_flags_unique
  ON public.review_flags (review_id, reporter_token);

-- TABELA: premium_subscriptions
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(200) UNIQUE NOT NULL,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('weekly','monthly','quarterly')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  amount_paid DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGER: atualizar updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- PROFILES: qualquer pessoa pode ver perfis ativos
CREATE POLICY "perfis_publicos_ativos" ON public.profiles
  FOR SELECT USING (status = 'active');

-- PROFILES: dono pode ver o próprio perfil independente do status
CREATE POLICY "dono_ve_proprio_perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- PROFILES: dono pode editar o próprio perfil
CREATE POLICY "dono_edita_proprio_perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- PROFILES: usuário logado pode criar o próprio perfil
CREATE POLICY "usuario_cria_perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PROFILE_PHOTOS: qualquer um lê fotos de perfis ativos
CREATE POLICY "fotos_publicas" ON public.profile_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id AND status = 'active'
    )
  );

-- PROFILE_PHOTOS: dono gerencia suas fotos
CREATE POLICY "dono_gerencia_fotos" ON public.profile_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- REVIEWS: qualquer um lê avaliações aprovadas
CREATE POLICY "reviews_publicas" ON public.reviews
  FOR SELECT USING (is_approved = true);

-- REVIEWS: qualquer um pode criar avaliação (anônimo)
CREATE POLICY "qualquer_um_avalia" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- REVIEW_REPLIES: qualquer um lê respostas
CREATE POLICY "replies_publicas" ON public.review_replies
  FOR SELECT USING (true);

-- REVIEW_REPLIES: só o dono do perfil responde
CREATE POLICY "dono_responde_avaliacao" ON public.review_replies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- REVIEW_FLAGS: qualquer um pode denunciar
CREATE POLICY "qualquer_um_denuncia" ON public.review_flags
  FOR INSERT WITH CHECK (true);

-- VERIFICATION_VIDEOS: dono gerencia seus vídeos
CREATE POLICY "dono_gerencia_video" ON public.verification_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- PREMIUM_SUBSCRIPTIONS: dono vê suas assinaturas
CREATE POLICY "dono_ve_assinaturas" ON public.premium_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNÇÃO: recalcular trust_score
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_trust_score(p_profile_id UUID)
RETURNS VOID AS $$
DECLARE
  v_avg_rating DECIMAL;
  v_is_video_verified BOOLEAN;
  v_is_whatsapp_verified BOOLEAN;
  v_photo_count INTEGER;
  v_score DECIMAL := 0;
BEGIN
  SELECT
    COALESCE(AVG(r.rating), 0),
    p.is_video_verified,
    p.is_whatsapp_verified
  INTO v_avg_rating, v_is_video_verified, v_is_whatsapp_verified
  FROM public.profiles p
  LEFT JOIN public.reviews r ON r.profile_id = p.id AND r.is_approved = true
  WHERE p.id = p_profile_id
  GROUP BY p.is_video_verified, p.is_whatsapp_verified;

  SELECT COUNT(*) INTO v_photo_count
  FROM public.profile_photos
  WHERE profile_id = p_profile_id;

  v_score := v_avg_rating * 20 * 0.5;
  IF v_is_video_verified THEN v_score := v_score + 25; END IF;
  IF v_is_whatsapp_verified THEN v_score := v_score + 15; END IF;
  IF v_photo_count >= 3 THEN v_score := v_score + 10; END IF;

  UPDATE public.profiles
  SET trust_score = LEAST(v_score, 100)
  WHERE id = p_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNÇÃO: incrementar view_count
-- ============================================================
CREATE OR REPLACE FUNCTION increment_view_count(p_profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET view_count = view_count + 1
  WHERE id = p_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKETS (execute no SQL Editor ou via Supabase UI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verification-videos', 'verification-videos', false);
