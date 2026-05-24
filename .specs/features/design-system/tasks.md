# Tasks - Design System

## 1. Configurar Tokens Tailwind

Critérios de verificação:

- `tailwind.config.ts` contém `brand.charcoal`, `brand.gray`, `brand.rose`, `brand.offwhite` e `brand.beige`.
- Classes como `bg-brand-offwhite` e `text-brand-charcoal` funcionam no app.

## 2. Configurar Fontes

Critérios de verificação:

- `src/app/layout.tsx` usa `next/font/google`.
- Playfair Display está vinculada a `--font-playfair`.
- Montserrat está vinculada a `--font-montserrat`.
- Tailwind expõe as famílias planejadas.

## 3. Ajustar `globals.css`

Critérios de verificação:

- `body` usa background off-white.
- Texto principal usa charcoal.
- Headings usam fonte display.
- Bordas globais seguem beige.

## 4. Criar Componentes Base

Critérios de verificação:

- Existem arquivos em `src/components/ui` para `button`, `card`, `input`, `label` e `badge`.
- Existe `src/components/shared/page-header.tsx`.
- Componentes usam TypeScript e Tailwind.
- Não foi adicionada biblioteca externa de UI.

## 5. Criar `/style-guide`

Critérios de verificação:

- Existe `src/app/style-guide/page.tsx`.
- A página mostra paleta, tipografia, botões, cards, inputs, labels, badges e PageHeader.
- A página é apenas visual e não implementa funcionalidade de produto.

## 6. Criar `docs/DESIGN_SYSTEM.md`

Critérios de verificação:

- Documento explica propósito, paleta, tipografia, componentes e regras visuais.
- Documento explica o que evitar visualmente.

## 7. Rodar Validações

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
