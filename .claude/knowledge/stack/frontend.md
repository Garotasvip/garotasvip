# Stack — Frontend

## Tailwind CSS v3

### Cores da marca (SEMPRE usar estas)
```
#C2185B  → primary (rosa escuro) — botões, destaques, links
#F8BBD9  → secondary (rosa claro) — fundos suaves, badges
#FFFFFF  → branco — fundos de card
```

### CSS Variables (globals.css)
```css
--primary: hsl(336 75% 44%)      → #C2185B
--secondary: hsl(330 80% 84%)    → #F8BBD9
--primary-foreground: white
```

### shadcn/ui — REGRAS OBRIGATÓRIAS
- Estilo: "default" com Radix UI
- NUNCA usar base-nova/v4 (@base-ui/react)
- Componentes disponíveis: button, input, textarea, label, checkbox,
  badge, card, dialog, sheet, select, tabs, avatar, separator, skeleton, sonner

## Padrões de componente

### Server Component (default)
```tsx
export default async function Page() {
  const data = await fetchFromSupabase(); // lib/queries.ts
  return <div>{data}</div>;
}
```

### Client Component
```tsx
"use client";
import { createClient } from "@/lib/supabase";        // ✅
import { uploadPhoto } from "@/lib/mutations";          // ✅
// import { getProfiles } from "@/lib/queries";         // ❌ PROIBIDO
```

## Imagens
```tsx
import Image from "next/image";
import { getCoverPhoto, getStorageUrl } from "@/lib/utils";

// Foto de capa de um perfil
const url = getCoverPhoto(profile.profile_photos);

// URL genérica de storage
const url = getStorageUrl("profile-photos", path);
```

## Formulários
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

## Bugs conhecidos e soluções
- `next.config.ts` → DEVE ser `next.config.mjs` (Next.js 14 não suporta .ts)
- shadcn base-nova → reescrever componentes com Radix UI padrão
- `import crypto from "crypto"` → usar `crypto.subtle.digest()` (Web API)
- Cache antigo do .next → `Remove-Item -Recurse -Force ".next"` antes de reiniciar
