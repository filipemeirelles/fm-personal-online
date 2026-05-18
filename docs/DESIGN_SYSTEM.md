# Design System — FM Personal Online

## Identidade Visual

Estilo **premium, minimalista e acolhedor**, voltado para mulheres 30+ em consultoria online de treino.
Tom visual: limpo, sofisticado, com bastante espaçamento, bordas finas e detalhes em rose.

---

## Paleta de Cores

| Token Tailwind         | Nome        | Hex       | Uso principal                             |
|------------------------|-------------|-----------|-------------------------------------------|
| `brand-charcoal`       | Charcoal    | `#222222` | Texto principal, botão primário           |
| `brand-gray`           | Gray        | `#A6A6A6` | Textos secundários, ícones, placeholders  |
| `brand-rose`           | Rose        | `#D8A6A6` | Detalhes, badges, hover accent, foco      |
| `brand-off-white`      | Off-white   | `#F7F3F1` | Fundo de página                           |
| `brand-beige`          | Beige       | `#E6DED6` | Bordas, fundo de cards, separadores       |

### Uso por contexto

- **Fundo de página:** `brand-off-white`
- **Cards e superfícies:** branco ou `brand-beige` claro
- **Texto principal:** `brand-charcoal`
- **Texto secundário / labels:** `brand-gray`
- **Acento e destaque:** `brand-rose`
- **Bordas:** `brand-beige`

---

## Tipografia

### Fontes

| Papel                      | Família           | Peso sugerido | CSS Variable         |
|----------------------------|-------------------|---------------|----------------------|
| Títulos, destaques, display | Playfair Display  | 400, 600, 700 | `--font-playfair`    |
| Corpo, labels, UI          | Montserrat        | 400, 500, 600 | `--font-montserrat`  |

### Classes Tailwind

- Títulos: `font-display`
- Corpo: `font-sans` (remapeia para Montserrat)

### Escala tipográfica sugerida

| Uso              | Classe Tailwind       | Fonte         |
|------------------|-----------------------|---------------|
| Título de página | `text-3xl font-display font-semibold` | Playfair Display |
| Título de seção  | `text-xl font-display font-medium`   | Playfair Display |
| Subtítulo        | `text-base font-sans font-medium`    | Montserrat       |
| Corpo            | `text-sm font-sans`                  | Montserrat       |
| Label / caption  | `text-xs font-sans font-medium tracking-wide uppercase` | Montserrat |

---

## Componentes Base

### Button

Variantes: `primary`, `secondary`, `outline`, `ghost`
Tamanhos: `sm`, `md` (padrão), `lg`

- **primary:** fundo charcoal, texto branco
- **secondary:** fundo rose claro, texto charcoal
- **outline:** borda charcoal, fundo transparente
- **ghost:** sem borda, hover sutil

### Card

- Fundo branco ou off-white
- Borda `brand-beige`
- `rounded-xl` com sombra leve
- Padding configurável via `className`

### Input

- Borda `brand-beige`, foco em `brand-rose`
- Sem borda agressiva no estado normal
- Placeholder em `brand-gray`
- Fonte Montserrat

### Label

- Texto pequeno, uppercase, espaçado
- Cor `brand-charcoal` ou `brand-gray`

### Badge

Variantes: `default`, `rose`, `gray`, `beige`

- Pill arredondado, texto pequeno
- Sem visual de academia/alerta

### PageHeader

- Título em Playfair Display
- Subtítulo em Montserrat gray
- Separador fino em `brand-beige`

---

## Princípios de UI

1. Espaçamento generoso — preferir `p-6`, `gap-6`, `py-10` a valores menores
2. Bordas finas — `border` (1px), nunca `border-2`
3. Arredondamento suave — `rounded-xl` em cards, `rounded-lg` em botões e inputs
4. Sem sombras pesadas — `shadow-sm` no máximo
5. Sem gradientes ou visuais agressivos
6. Ícones discretos, se usados
7. Sempre priorizar legibilidade e respiro visual
