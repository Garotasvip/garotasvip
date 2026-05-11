# Segurança — Regras

## Regras invioláveis

### Credenciais
- NUNCA commitar `.env.local` ou qualquer arquivo com credenciais
- NUNCA hardcodar API keys no código
- `vercel.env` DEVE estar no `.gitignore`
- Credenciais ficam em: `C:\Users\DELL\vault\marketplaceAdulto\credenciais.md`
- service_role key APENAS em server-side/Route Handlers com SUPABASE_SERVICE_ROLE_KEY

### Supabase
- RLS SEMPRE ativo em todas as tabelas
- NUNCA usar service_role key no frontend
- NUNCA desativar RLS "temporariamente"
- Storage: profile-photos (público), verification-videos (privado)

### Autenticação
- Middleware protege /dashboard e /admin
- Admin verificado via JWT user_metadata.role = 'admin'
- Senhas: mínimo 8 caracteres (validado via Zod)
- Confirmação de email: OFF (ambiente de desenvolvimento)

### LGPD
- Checkbox obrigatório de aceite dos termos no cadastro
- Checkbox obrigatório de confirmação de +18 anos
- Avaliações anônimas via hash (IP + data) — nunca armazenar IP bruto
- Botão de exclusão de conta no dashboard (a implementar)
- Vídeos de verificação: privados, apenas admin visualiza

### Frontend
- NUNCA usar `import crypto from "crypto"` — usar `crypto.subtle` (Web API)
- Validação sempre com Zod no frontend + validação no banco
- Inputs sanitizados contra XSS

## Políticas de rate limiting (a implementar)
- Login: máx 5 tentativas por IP em 15 minutos
- Cadastro: máx 3 por IP por hora
- Avaliação: máx 1 por perfil por IP por dia (via trigger no banco)

## Incidentes anteriores
- vercel.env foi commitado acidentalmente → arquivo removido e adicionado ao .gitignore
- next.config.ts usado → migrado para next.config.mjs (Next.js 14 não suporta .ts)
