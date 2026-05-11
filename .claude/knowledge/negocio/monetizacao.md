# Negócio — Monetização

## Modelo
Freemium — cadastro e perfil básico grátis. Paga-se por visibilidade (destaque).

## Quem paga
As ACOMPANHANTES pagam. Visitantes NUNCA pagam.

## Planos Premium (definidos e aprovados)
| Plano | Preço | Duração | Stripe Price ID |
|-------|-------|---------|-----------------|
| Semanal | R$ 29,90 | 7 dias | (pendente) |
| Mensal | R$ 89,90 | 30 dias | (pendente) |
| Trimestral | R$ 199,90 | 90 dias | (pendente) |

**NUNCA alterar preços sem aprovação do dono do projeto.**

## O que o Premium oferece
- Perfil aparece ANTES dos gratuitos na listagem
- Badge "Premium" visível no card
- Destaque na seção "Destaques Premium" da home
- Até 5x mais visualizações (estimativa)

## Comparativo com concorrência
| Plano | GarotasVip | Fatal Model | Economia |
|-------|-----------|-------------|----------|
| Semanal | R$ 29,90 | R$ 49,90 | 40% |
| Mensal | R$ 89,90 | R$ 149,90 | 40% |
| Trimestral | R$ 199,90 | R$ 349,90 | 43% |

## Estratégia de lançamento
- **Fase 1 (0-50 perfis):** TUDO GRÁTIS — popular a plataforma
- **Fase 2 (50-200 perfis):** cobrar apenas plano mensal
- **Fase 3 (200+ perfis):** tabela completa de 3 planos

## Integração Stripe (pendente)
- Checkout: criar sessão em `app/api/checkout/route.ts`
- Webhook: receber em `app/api/webhooks/stripe/route.ts`
- Após pagamento confirmado: `is_premium = true`, `premium_until = now + dias`
- Job de expiração: verificar `premium_until` e desativar quando vencer

## Receita projetada (base Fatal Model)
Fatal Model fatura R$85mi/ano com ~100k usuários.
Com 1% de market share = ~R$850k/ano potencial.
