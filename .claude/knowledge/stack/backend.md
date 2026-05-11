# Stack — Backend

## Supabase

### Projeto
- URL: https://becxwylwezsitoukqesu.supabase.co
- Região: East US (North Virginia) — us-east-1
- Credenciais: `C:\Users\DELL\vault\marketplaceAdulto\credenciais.md`

### Clientes Supabase

**Browser (client components):**
```ts
import { createClient } from "@/lib/supabase";
const supabase = createClient();
```

**Server (server components, route handlers):**
```ts
import { createServerSupabaseClient } from "@/lib/supabase-server";
const supabase = await createServerSupabaseClient();
```

**NUNCA usar service_role key no frontend.**

### Storage Buckets
| Bucket | Público | Uso |
|--------|---------|-----|
| profile-photos | ✅ Sim | Fotos dos perfis |
| verification-videos | ❌ Não | Vídeos de verificação (admin only) |

### Funções RPC disponíveis
```sql
recalculate_trust_score(p_profile_id UUID)  -- recalcula score
increment_view_count(p_profile_id UUID)      -- incrementa views
increment_flag_count(p_review_id UUID)       -- incrementa denúncias
```

## Separação server/client — REGRA CRÍTICA

### lib/queries.ts (SERVER ONLY)
- Usa `createServerSupabaseClient` que depende de `next/headers`
- APENAS em Server Components e Route Handlers
- Nunca importar em `"use client"`

### lib/mutations.ts (CLIENT SAFE)
- Usa `createClient()` (browser)
- Pode ser importado em `"use client"`
- Contém: upsertProfile, uploadProfilePhoto, deleteProfilePhoto,
  uploadVerificationVideo, submitReview, incrementViewCount

## Trust Score — fórmula
```
Avaliações: média × 20 × 0.5 = até 50 pts
Vídeo verificado: +25 pts
WhatsApp verificado: +15 pts
3+ fotos: +10 pts
Máximo: 100 pts
```

## Middleware de proteção
```
/dashboard/* → exige auth (redireciona para /login)
/admin/*     → exige auth + role=admin (redireciona para /)
/login, /cadastro → redireciona logado para /dashboard
```
