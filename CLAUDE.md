# GarotasVip — Contexto Master

## Projeto
Marketplace adulto brasileiro. Acompanhantes criam perfis verificados, clientes encontram e contactam via WhatsApp. Monetização via planos premium (visibilidade). Similar ao Fatal Model, porém com melhor UX, verificação real e Trust Score.

## Stack
- Next.js 14 + TypeScript + App Router
- Tailwind CSS v3 + shadcn/ui (Radix UI — NUNCA usar base-nova/v4)
- Supabase (PostgreSQL + Auth + Storage + RLS)
- Stripe (pagamentos — ainda não integrado)
- Vercel (deploy)
- GitHub: github.com/Garotasvip/garotasvip

## URLs
- Produção: https://garotasvip.vercel.app
- Admin: https://garotasvip.vercel.app/admin

## Memória do projeto
Atualizar sempre: `C:\Users\DELL\.claude\projects\c--Users-DELL-marketplaceAdulto\memory\`

## Arquitetura de Agentes
Leia `.claude/agents/00-orquestrador.md` antes de qualquer task complexa.
Sequência obrigatória: **Planejar → Implementar → Revisar → Aprovar**

## Regras Invioláveis
1. NUNCA commitar sem aprovação do Revisor
2. NUNCA duplicar informação — knowledge/ é a fonte de verdade
3. NUNCA usar dados mock em produção
4. NUNCA expor credenciais no código ou commits
5. Supabase RLS SEMPRE ativo — nunca desativar
6. shadcn/ui SEMPRE estilo "default" com Radix UI

## Onde encontrar o quê
- Decisões de negócio → `.claude/knowledge/negocio/`
- Schema do banco → `.claude/knowledge/banco-de-dados/`
- Padrões de componentes → `.claude/knowledge/componentes/`
- Stack técnica → `.claude/knowledge/stack/`
- Regras de segurança → `.claude/knowledge/seguranca/`
- Regras de moderação → `.claude/knowledge/moderacao/`
