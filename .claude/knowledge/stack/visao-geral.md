# Stack — Visão Geral

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js | 14.2.35 |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 3.x |
| Componentes | shadcn/ui (Radix UI) | default style |
| Banco | Supabase PostgreSQL | — |
| Auth | Supabase Auth | — |
| Storage | Supabase Storage | — |
| Pagamentos | Stripe | (ainda não integrado) |
| Deploy | Vercel | Hobby plan |
| Repositório | GitHub | github.com/Garotasvip/garotasvip |

## Estrutura de pastas

```
app/
├── (public)/         → páginas sem auth (home, perfis, termos)
├── (auth)/           → login, cadastro, recuperar-senha
├── dashboard/        → área da acompanhante (requer auth)
├── admin/            → painel admin (requer role=admin)
├── api/              → Route Handlers
│   └── webhooks/stripe/
└── auth/callback/    → callback OAuth Supabase

components/
├── ui/               → shadcn/ui components (Radix UI)
└── *.tsx             → componentes de domínio

lib/
├── queries.ts        → server-only (usa next/headers)
├── mutations.ts      → client-safe (usa browser client)
├── supabase.ts       → createClient() browser
├── supabase-server.ts → createServerSupabaseClient()
├── stripe.ts         → cliente Stripe + planos
├── trust-score.ts    → cálculo do Trust Score
└── utils.ts          → cn(), slugify(), getCoverPhoto(), etc.
```

## Regras críticas de import
- `lib/queries.ts` → APENAS em Server Components e Route Handlers
- `lib/mutations.ts` → pode ser importado em `"use client"`
- NUNCA importar `lib/queries.ts` em arquivo com `"use client"`
- NUNCA usar `import crypto from "crypto"` → usar `crypto.subtle`

## Variáveis de ambiente necessárias
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLIC_KEY    (pendente)
STRIPE_SECRET_KEY                (pendente)
STRIPE_WEBHOOK_SECRET            (pendente)
NEXT_PUBLIC_APP_URL
```
