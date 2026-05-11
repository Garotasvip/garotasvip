# Banco de Dados — RLS Policies

## Regra fundamental
RLS SEMPRE ativo. NUNCA desativar para "facilitar" desenvolvimento.

## Policies ativas por tabela

### profiles
| Policy | Operação | Condição |
|--------|----------|----------|
| perfis_publicos_ativos | SELECT | status = 'active' |
| dono_ve_proprio_perfil | SELECT | auth.uid() = user_id |
| dono_edita_proprio_perfil | UPDATE | auth.uid() = user_id |
| usuario_cria_perfil | INSERT | auth.uid() = user_id |
| admin_atualiza_perfis | UPDATE | role = 'admin' no JWT |
| admin_ve_todos_perfis | SELECT | role = 'admin' no JWT |

### profile_photos
| Policy | Operação | Condição |
|--------|----------|----------|
| fotos_publicas | SELECT | perfil relacionado tem status = 'active' |
| dono_gerencia_fotos | ALL | perfil relacionado pertence ao usuário |

### reviews
| Policy | Operação | Condição |
|--------|----------|----------|
| reviews_publicas | SELECT | is_approved = true |
| qualquer_um_avalia | INSERT | true (anônimo) |
| admin_gerencia_reviews | ALL | role = 'admin' no JWT |

### verification_videos
| Policy | Operação | Condição |
|--------|----------|----------|
| dono_gerencia_video | ALL | perfil pertence ao usuário |
| admin_gerencia_videos | ALL | role = 'admin' no JWT |

## Como verificar role admin no JWT
```sql
(auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
```

## Como definir admin
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'garotasvip.contato@gmail.com';
```

## Admin atual
- Email: garotasvip.contato@gmail.com
- Role: admin (configurado no Supabase)
