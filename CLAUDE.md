# GarotasVip — Contexto Master

## O projeto
Marketplace adulto brasileiro. Stack: Next.js 14 + Supabase + Tailwind v3 + shadcn/ui (Radix).
Produção: https://garotasvip.vercel.app | GitHub: github.com/Garotasvip/garotasvip

## Duas fontes de memória — entenda a diferença

### 1. Memória automática (estado e progresso)
`C:\Users\DELL\.claude\projects\c--Users-DELL-marketplaceAdulto\memory\`
- **Lida automaticamente** em toda sessão pelo Claude Code
- Contém: status atual, pendências, bugs corrigidos, decisões de negócio
- **Atualizar sempre** ao final de cada sessão

### 2. Knowledge base (referência técnica)
`.claude/knowledge/` dentro do projeto
- Contém: stack, schema do banco, RLS, componentes, segurança, moderação, negócio
- **Consultar** ao implementar qualquer feature
- **Não duplicar** informação entre as duas fontes

## Regras invioláveis
1. NUNCA commitar sem aprovação do Revisor (`.claude/agents/06-revisor.md`)
2. NUNCA usar dados mock em produção
3. NUNCA expor credenciais — ficam em `C:\Users\DELL\vault\marketplaceAdulto\`
4. Supabase RLS SEMPRE ativo
5. shadcn/ui SEMPRE estilo "default" com Radix UI — NUNCA base-nova/v4
6. `lib/queries.ts` → server-only | `lib/mutations.ts` → client-safe
7. NUNCA importar `lib/queries.ts` em arquivos com `"use client"`

## Sequência obrigatória para tasks complexas
Planejar → Implementar → Revisar → Aprovar → Commitar

## Agentes disponíveis
`.claude/agents/` — ler o agente certo antes de cada tarefa
