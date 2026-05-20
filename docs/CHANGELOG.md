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

## 2026-05-20 — Sprint 1: migration inicial de profiles

### Adicionado

- `supabase/migrations/001_create_profiles.sql` com tabela `profiles`.
- RLS habilitada para `profiles`.
- Políticas para usuário autenticado visualizar, inserir e atualizar o próprio perfil.
- Trigger para atualizar `updated_at` automaticamente.

### Observação

- A migration ainda precisa ser aplicada em um projeto Supabase local ou remoto.

## 2026-05-20 — Reorganização spec-driven

### Adicionado

- Estrutura `.specs/` para documentação orientada por Specify, Design, Tasks e Execute.
- Documentos de projeto em `.specs/project/`.
- Documentos técnicos de codebase em `.specs/codebase/`.
- Feature spec do design system em `.specs/features/design-system/`.

### Alterado

- `README.md` atualizado para apontar para a nova estrutura `.specs/`.

### Observação

- Nenhum código funcional do app foi alterado nesta reorganização.

## 2026-05-20 — Spec de autenticação em `.specs/`

### Adicionado

- Feature spec de autenticação em `.specs/features/auth/`.
- `spec.md`, `design.md` e `tasks.md` para guiar as próximas etapas de autenticação.

### Alterado

- Roadmap e estado do projeto atualizados para refletir a spec de autenticação no novo fluxo.

## 2026-05-20 — Configuração local do Supabase CLI

### Adicionado

- `supabase/config.toml` gerado pelo Supabase CLI.
- `supabase/.gitignore` para ignorar arquivos temporários e ambientes locais do Supabase.

### Alterado

- Configuração local ajustada para `http://localhost:3000`.
- Seed local desabilitado enquanto não houver arquivo de seed versionado.

### Observação

- A migration ainda não foi aplicada porque Docker não está disponível no terminal atual e nenhum projeto remoto foi linkado.

## 2026-05-20 — Migration aplicada no Supabase remoto

### Alterado

- Projeto Supabase remoto `emvisxoadtdeojddvumd` linkado via CLI.
- Migration `001_create_profiles.sql` aplicada com `npx supabase db push`.
- Specs atualizadas para marcar a aplicação da migration como concluída.

### Validado

- `npx supabase migration list` confirmou `Local 001 | Remote 001`.

## 2026-05-20 — Cadastro conectado ao Supabase Auth

### Adicionado

- Formulário funcional de cadastro em `/cadastro`.
- Migration `002_create_profile_on_signup.sql` para criar `profiles` automaticamente após signup.
- Mensagens de sucesso e erro em português brasileiro.

### Validado

- `npx supabase migration list` confirmou `Local 001/002 | Remote 001/002`.

### Observação

- Login funcional, logout, dashboards e proteção de rotas permanecem fora desta etapa.
