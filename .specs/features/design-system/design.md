# Design - Design System

## Identidade Visual

Marca: Filipe Meirelles Personal Trainer.

Tom visual:

- Premium.
- Minimalista.
- Elegante.
- Limpo.
- Profissional.
- Feminino sem ser infantil.
- Acolhedor.
- Sofisticado.
- Editorial.
- Com bastante respiro visual.
- Sem estética agressiva de academia.

## Cores da Marca

| Nome | Hex | Uso |
|---|---|---|
| Charcoal | `#222222` | Texto principal e botão primário |
| Gray | `#A6A6A6` | Texto secundário e placeholders |
| Rose | `#D8A6A6` | Destaques, foco e detalhes |
| Off-white | `#F7F3F1` | Background principal |
| Beige | `#E6DED6` | Bordas e separadores |

## Fontes

| Uso | Fonte |
|---|---|
| Títulos e destaques | Playfair Display |
| Textos e informações | Montserrat |

## Tokens Tailwind Planejados

```ts
brand: {
  charcoal: "#222222",
  gray: "#A6A6A6",
  rose: "#D8A6A6",
  offwhite: "#F7F3F1",
  beige: "#E6DED6",
}
```

Font families:

```ts
fontFamily: {
  serifBrand: ["var(--font-playfair)", "Georgia", "serif"],
  sansBrand: ["var(--font-montserrat)", "system-ui", "sans-serif"],
  display: ["var(--font-playfair)", "Georgia", "serif"],
  sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
}
```

## Componentes Planejados

### Button

Variantes: `primary`, `secondary`, `outline`, `ghost`.

Tamanhos: `sm`, `md`, `lg`.

### Card

Partes: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

### Input

Input simples com borda beige, foco rose e placeholder gray.

### Label

Label acessível com `htmlFor`, uppercase e tracking sutil.

### Badge

Variantes: `default`, `rose`, `neutral`, `outline`.

### PageHeader

Props: `eyebrow`, `title`, `description`.

## Página `/style-guide`

Deve mostrar:

- Paleta de cores.
- Tipografia.
- Botões.
- Cards.
- Inputs.
- Labels.
- Badges.
- Exemplo de `PageHeader`.
- Aplicação visual básica da identidade.
