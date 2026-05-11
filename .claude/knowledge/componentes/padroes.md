# Componentes — Padrões

## Componentes de domínio existentes

| Componente | Arquivo | O que faz |
|-----------|---------|-----------|
| ProfileCard | components/ProfileCard.tsx | Card da listagem com foto, nome, preço, Trust Score, selos |
| ProfileGallery | components/ProfileGallery.tsx | Grid de fotos com lightbox e navegação |
| TrustScoreBar | components/TrustScoreBar.tsx | Barra colorida com score e detalhes |
| VerifiedBadge | components/VerifiedBadge.tsx | Selos "Vídeo Verificado" e "WhatsApp Verificado" |
| WhatsAppButton | components/WhatsAppButton.tsx | Botão inline ou fixo para contato |
| ReviewSection | components/ReviewSection.tsx | Lista de avaliações, formulário e denúncia |
| SearchFilters | components/SearchFilters.tsx | Filtros desktop (sidebar) e mobile (sheet) |
| Navbar | components/Navbar.tsx | Header com logo, nav, auth state |
| Footer | components/Footer.tsx | Rodapé com links e legal |

## ProfileCard — props
```tsx
interface ProfileCardProps {
  slug: string;
  displayName: string;
  city: string;
  priceFrom: number | null;
  priceTo: number | null;
  coverPhoto: string | null;
  averageRating: number;
  reviewCount: number;
  trustScore: number;
  isVideoVerified: boolean;
  isWhatsappVerified: boolean;
  isPremium: boolean;
  viewCount?: number;
}
```

## Padrão de página com dados reais
```tsx
// Server Component
import { getProfiles } from "@/lib/queries";
import { getCoverPhoto } from "@/lib/utils";

export default async function Page() {
  const { profiles } = await getProfiles();
  return (
    <div>
      {profiles.map(p => (
        <ProfileCard
          key={p.id}
          slug={p.slug}
          coverPhoto={getCoverPhoto(p.profile_photos)}
          // ... resto das props
        />
      ))}
    </div>
  );
}
```

## Layouts existentes
- `app/dashboard/layout.tsx` → sidebar escura, drawer mobile
- `app/admin/layout.tsx` → sidebar escura com badges de pendências

## Responsividade obrigatória
- Mobile: 360px+, menu hamburguer, filtros em sheet
- Tablet: 768px+
- Desktop: 1024px+
- ProfileCard grid: 2 cols mobile → 3 tablet → 4-6 desktop
