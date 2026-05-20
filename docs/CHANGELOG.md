# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue uma versão simplificada de changelog por etapas de desenvolvimento.

## 2026-05-18 — Sprint 0: organização inicial

### Adicionado

- Repositório dedicado `fm-personal-online`.
- README inicial do projeto.
- `docs/PROJECT_SPEC.md` com visão, MVP, regras de negócio e roadmap.
- `docs/ARCHITECTURE.md` com decisões técnicas iniciais.
- `docs/DEVELOPMENT_WORKFLOW.md` com fluxo de Git, commits e PRs.
- `docs/DATABASE_SCHEMA.md` com modelo inicial de dados.
- `docs/AI_CODING_GUIDE.md` com regras para trabalhar com Claude/Codex.
- `.env.example` com variáveis esperadas.

### Próximo passo

- Criar a estrutura real do projeto Next.js + TypeScript + Tailwind.

## 2026-05-20 — Sprint 0: base visual e design system

### Adicionado

- Estrutura inicial do projeto com Next.js 15, App Router, React 19, TypeScript e Tailwind CSS.
- Tokens de marca no Tailwind para charcoal, gray, rose, off-white e beige.
- Fontes Playfair Display e Montserrat configuradas com `next/font/google`.
- Componentes base de UI: `Button`, `Card`, `Input`, `Label`, `Badge` e `PageHeader`.
- Página temporária `/style-guide` para visualizar paleta, tipografia e componentes.
- `docs/DESIGN_SYSTEM.md` com regras visuais iniciais da marca.

### Validado

- `npm run lint`
- `npm run type-check`
- `npm run build`

### Ainda pendente na Sprint 0

- Configurar Supabase somente quando a etapa de autenticação/banco for iniciada.
- Configurar deploy na Vercel em etapa própria.

## 2026-05-20 — Sprint 1: planejamento da autenticação

### Adicionado

- `docs/AUTH_SPEC.md` com escopo da autenticação para o MVP.
- Definição da primeira etapa visual: páginas `/login` e `/cadastro` sem integração com Supabase.
- Critérios de aceite para manter a Sprint 1 pequena e orientada por especificação.

## 2026-05-20 — Sprint 1: páginas visuais de autenticação

### Adicionado

- Página `/login` com formulário visual de email e senha.
- Página `/cadastro` com formulário visual de nome, email, senha e seleção de perfil.
- Navegação visual entre login e cadastro.

### Observação

- As páginas ainda não conectam Supabase, não criam sessão e não validam credenciais reais.

## 2026-05-20 — Sprint 1: decisão de modelo de autenticação

### Alterado

- Modelo inicial atualizado para usar `auth.users` do Supabase e tabela `profiles` para dados públicos e role.
- Referências de `trainers` e `students` ajustadas para `profile_id`.
- `docs/AUTH_SPEC.md` atualizado para refletir a decisão antes da implementação real do Supabase.

## 2026-05-20 — Sprint 1: configuração inicial do Supabase client

### Adicionado

- Dependência `@supabase/supabase-js`.
- Browser client inicial em `src/lib/supabase/client.ts`.
- Tipagem inicial do banco em `src/types/database.ts`, começando por `profiles`.

### Observação

- Os formulários de login e cadastro ainda não executam autenticação real.
