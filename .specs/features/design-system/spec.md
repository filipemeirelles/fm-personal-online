# Feature Spec - Design System

## Objetivo

Criar uma base visual reutilizável para o FM Personal Online com identidade Filipe Meirelles Personal Trainer, mantendo o produto premium, minimalista, elegante, limpo e acolhedor.

## Escopo

- Definir tokens de marca no Tailwind.
- Configurar fontes da marca.
- Ajustar estilos globais.
- Criar componentes base simples e reutilizáveis.
- Criar página temporária `/style-guide` para visualização.
- Criar documentação do design system.

## Fora de Escopo

- Login funcional.
- Cadastro funcional.
- Dashboard.
- Supabase.
- Banco de dados.
- Fluxos de treino.
- Uploads, gráficos, relatórios ou APIs.

## Requisitos

### DS-001 - Tokens de cor

O Tailwind deve centralizar as cores da marca: charcoal, gray, rose, off-white e beige.

### DS-002 - Tipografia

O app deve usar Playfair Display para títulos e Montserrat para textos e UI.

### DS-003 - Estilo global

O background principal deve usar off-white, texto principal charcoal e bordas suaves em beige.

### DS-004 - Componentes base

O design system deve incluir `Button`, `Card`, `Input`, `Label`, `Badge` e `PageHeader`.

### DS-005 - Variantes simples

Componentes devem ter variantes simples apenas quando fizer sentido, sem adicionar biblioteca externa de UI.

### DS-006 - Style guide

Deve existir uma página `/style-guide` para visualizar paleta, tipografia e componentes.

### DS-007 - Conteúdo em português

Todo texto visível na página de style guide deve estar em português brasileiro.

### DS-008 - Validações

`npm run lint`, `npm run type-check` e `npm run build` devem passar.

## Critérios de Aceite

- Tokens da marca estão centralizados no Tailwind.
- Fontes estão configuradas com `next/font/google`.
- Componentes base existem e são reutilizáveis.
- `/style-guide` renderiza a base visual.
- Documentação do design system existe.
- Nenhuma funcionalidade de produto foi criada junto com o design system.
