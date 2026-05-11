# Componentes — Design System

## Identidade Visual

### Cores
```
#C2185B  primary     → botões principais, links, destaques
#F8BBD9  secondary   → fundos suaves, badges secundários
#FFFFFF  white       → fundos de card
#111827  gray-900    → textos principais
#6B7280  gray-500    → textos secundários (muted)
#F9FAFB  gray-50     → fundos de página
```

### Tipografia
- Font: Inter (Google Fonts)
- Títulos: font-bold, text-2xl+
- Corpo: text-sm, text-base
- Labels: text-xs, text-sm

### Border radius padrão
- Cards: rounded-2xl (16px)
- Botões: rounded-xl ou rounded-md (shadcn)
- Badges: rounded-full
- Inputs: rounded-md

## Componentes shadcn/ui disponíveis
```
Button     → variantes: default, outline, ghost, secondary, destructive, link
Input      → padrão com ring focus
Textarea   → redimensionável
Label      → associado a inputs
Checkbox   → com indicador de check
Badge      → variantes: default, secondary, outline, destructive
Card       → CardHeader, CardTitle, CardContent, CardFooter
Dialog     → modal
Sheet      → drawer lateral/bottom
Select     → dropdown
Tabs       → abas
Avatar     → com fallback
Separator  → divisor
Skeleton   → loading state
Sonner     → toasts/notificações
```

## Padrões de UX

### Estados de loading
```tsx
import { Loader2 } from "lucide-react";
<Loader2 className="w-6 h-6 animate-spin text-[#C2185B]" />
```

### Estado vazio
```tsx
<div className="text-center py-20 text-muted-foreground">
  <Icon className="w-12 h-12 mx-auto mb-3 opacity-20" />
  <p>Mensagem explicativa</p>
</div>
```

### Feedback de sucesso
```tsx
{saved && (
  <span className="text-green-600 text-sm font-medium">✓ Salvo!</span>
)}
```

### Cores de Trust Score
```tsx
score >= 70 → bg-green-500  (Alta Confiança)
score >= 40 → bg-yellow-500 (Confiança Média)
score < 40  → bg-red-400    (Baixa Confiança)
```

## Ícones
Biblioteca: lucide-react
Tamanhos padrão: w-4 h-4 (pequeno), w-5 h-5 (médio), w-6 h-6 (grande)
