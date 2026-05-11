# Banco de Dados — Schema

## Tabelas

### profiles
Principal tabela do sistema.
```sql
id                  UUID PK
user_id             UUID → auth.users
display_name        VARCHAR(100) NOT NULL
slug                VARCHAR(100) UNIQUE NOT NULL
city                VARCHAR(100)
birth_date          DATE
description         TEXT
services            TEXT[]
price_from          DECIMAL(10,2)
price_to            DECIMAL(10,2)
whatsapp_number     VARCHAR(20)
availability        JSONB  -- { seg: "09:00-22:00", ... }
is_whatsapp_verified BOOLEAN DEFAULT false
is_video_verified   BOOLEAN DEFAULT false
is_premium          BOOLEAN DEFAULT false
premium_until       TIMESTAMPTZ
trust_score         DECIMAL(5,2) DEFAULT 0
status              VARCHAR -- 'pending' | 'active' | 'suspended'
view_count          INTEGER DEFAULT 0
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

### profile_photos
```sql
id           UUID PK
profile_id   UUID → profiles
storage_path VARCHAR(500)
is_cover     BOOLEAN DEFAULT false
sort_order   INTEGER
created_at   TIMESTAMPTZ
```

### verification_videos
```sql
id           UUID PK
profile_id   UUID → profiles
storage_path VARCHAR(500)
status       VARCHAR -- 'pending' | 'approved' | 'rejected'
reviewed_at  TIMESTAMPTZ
created_at   TIMESTAMPTZ
```

### reviews
```sql
id           UUID PK
profile_id   UUID → profiles
author_token VARCHAR(64)  -- hash(IP + data)
rating       INTEGER (1-5)
comment      TEXT NOT NULL
is_approved  BOOLEAN DEFAULT true
is_flagged   BOOLEAN DEFAULT false
flag_count   INTEGER DEFAULT 0
created_at   TIMESTAMPTZ
```
Constraint: 1 avaliação por token por perfil por dia (trigger enforce_review_limit)

### review_replies
```sql
id           UUID PK
review_id    UUID → reviews (UNIQUE)
profile_id   UUID → profiles
reply_text   TEXT
created_at   TIMESTAMPTZ
```

### review_flags
```sql
id             UUID PK
review_id      UUID → reviews
reason         VARCHAR(200)
reporter_token VARCHAR(64)
created_at     TIMESTAMPTZ
```
Constraint: 1 denúncia por token por avaliação

### premium_subscriptions
```sql
id                UUID PK
profile_id        UUID → profiles
stripe_session_id VARCHAR UNIQUE
plan              VARCHAR -- 'weekly' | 'monthly' | 'quarterly'
status            VARCHAR -- 'active' | 'expired' | 'cancelled'
started_at        TIMESTAMPTZ
expires_at        TIMESTAMPTZ
amount_paid       DECIMAL(10,2)
created_at        TIMESTAMPTZ
```

## Triggers
- `update_profiles_updated_at` → atualiza updated_at automaticamente
- `enforce_review_limit` → bloqueia 2ª avaliação do mesmo token no mesmo dia
