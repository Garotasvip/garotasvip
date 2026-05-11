# Moderação — Regras

## Moderação de Perfis

### Fluxo de aprovação
1. Acompanhante se cadastra → perfil criado com `status = 'pending'`
2. Admin acessa `/admin/perfis` e analisa o perfil
3. Admin clica **Aprovar** → `status = 'active'` → perfil visível publicamente
4. Ou Admin clica **Suspender** → `status = 'suspended'` → perfil oculto

### Critérios de aprovação (a definir formalmente)
- Fotos condizentes com o perfil
- Informações básicas preenchidas (nome, cidade)
- Sem conteúdo ilegal ou de menores
- WhatsApp válido

### Critérios de suspensão
- Fotos de menores de idade
- Conteúdo ilegal
- Perfil falso/golpe
- Múltiplas denúncias procedentes

## Moderação de Vídeos de Verificação

### Fluxo
1. Acompanhante envia vídeo → `status = 'pending'`
2. Admin acessa `/admin/videos`, assiste ao vídeo
3. **Aprovar** → `is_video_verified = true`, recalcula trust score (+25pts)
4. **Rejeitar** → `status = 'rejected'`, acompanhante é notificada (futuro)

### Critérios de aprovação de vídeo
- Rosto claramente visível
- Segurando papel com "GarotasVip" + data atual
- Fala o nome de exibição
- Boa qualidade (iluminação, áudio)
- Duração máxima: 30 segundos

## Moderação de Avaliações

### Fluxo automático
- Comentário com palavras bloqueadas → `is_approved = false` automaticamente
- Após 3 denúncias diferentes → vai para fila do admin

### Palavras bloqueadas (configurável em lib/utils.ts)
```ts
const BLOCKED_WORDS = ["spam", "fraude", "golpe"];
// Adicionar conforme necessário
```

### Fila de moderação (`/admin/moderacao`)
- Admin vê comentários com 3+ denúncias
- **Manter** → zera flag_count, remove da fila
- **Remover** → `is_approved = false`, comentário some da página

### Regras de avaliação anônima
- Visitante não precisa de conta
- Token = SHA256(IP + data_hoje)
- Máximo 1 avaliação por perfil por token por dia
- Bloquear via trigger `enforce_review_limit` no banco

## Palavras e conteúdos proibidos
- Menção a menores de idade
- Conteúdo de violência
- Números de telefone em textos (exceto campo WhatsApp)
- Links externos em descrições
