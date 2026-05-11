# Negócio — Regras Gerais

## O que é o GarotasVip
Marketplace adulto brasileiro onde acompanhantes criam perfis verificados e clientes encontram e contactam via WhatsApp. Inspirado no Fatal Model, porém com melhor UX, verificação real e sistema de Trust Score.

## Público-alvo
- **Anunciantes:** acompanhantes que querem visibilidade online
- **Visitantes:** clientes adultos (+18) buscando serviços de acompanhia

## Fluxo principal da acompanhante
1. Cadastro grátis (`/cadastro`)
2. Perfil criado com status `pending`
3. Completa perfil (nome, cidade, fotos, descrição, WhatsApp)
4. Admin aprova → status vira `active` → aparece na listagem
5. Opcionalmente: envia vídeo de verificação → ganha selo
6. Opcionalmente: assina Premium → aparece em destaque

## Fluxo do visitante
1. Navega em `/perfis` com filtros (cidade, preço, avaliação)
2. Vê card do perfil → clica para ver detalhes
3. Clica no botão WhatsApp → abre conversa direta
4. Pode deixar avaliação anônima (sem cadastro)

## Regras de status de perfil
- `pending` → recém cadastrado, aguarda aprovação do admin
- `active` → visível para todos na listagem pública
- `suspended` → removido da listagem, acesso bloqueado

## Trust Score
Score de 0 a 100 que indica confiabilidade do perfil:
- Avaliações: média × 20 × 0.5 = até 50 pts
- Vídeo verificado: +25 pts
- WhatsApp verificado: +15 pts
- 3+ fotos: +10 pts

Cores: verde (70+), amarelo (40-69), vermelho (0-39)

## Avaliações
- Visitantes avaliam SEM cadastro (anônimo por hash de IP+data)
- Máximo 1 avaliação por perfil por IP por dia
- Comentários com 3+ denúncias vão para fila de moderação admin
- Admin pode manter ou remover comentários denunciados

## Selos de verificação
- **Vídeo Verificado:** vídeo enviado e aprovado pelo admin
- **WhatsApp Verificado:** número confirmado (futuro)
- Ambos visíveis no card e na página do perfil
