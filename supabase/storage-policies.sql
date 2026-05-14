-- ============================================================
-- STORAGE: Buckets e Policies
-- Execute no SQL Editor do Supabase (uma vez, em produção)
-- ============================================================

-- 1. Criar buckets (se não existirem)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-videos',
  'verification-videos',
  false,
  52428800, -- 50MB
  ARRAY['video/mp4', 'video/mov', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Policies para profile-photos (bucket público)
-- SELECT não precisa de policy — bucket é public = true
-- ============================================================

CREATE POLICY "upload_fotos_autenticados"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "atualizar_fotos_autenticados"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos');

CREATE POLICY "deletar_fotos_autenticados"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-photos');

-- ============================================================
-- 3. Policies para verification-videos (bucket privado)
-- ============================================================

CREATE POLICY "upload_video_autenticados"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'verification-videos');

CREATE POLICY "ver_video_autenticados"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'verification-videos');

CREATE POLICY "deletar_video_autenticados"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'verification-videos');
