# Graph Report - fm-personal-online  (2026-05-24)

## Corpus Check
- 130 files · ~116,777 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 863 nodes · 1196 edges · 57 communities (50 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e175b82c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `DesignSystemGenerator` - 24 edges
2. `_search_csv()` - 21 edges
3. `ui-ux-pro-max` - 21 edges
4. `BM25` - 20 edges
5. `generate_design_system()` - 20 edges
6. `persist_design_system()` - 18 edges
7. `cn()` - 18 edges
8. `search()` - 17 edges
9. `format_page_override_md()` - 17 edges
10. `_generate_intelligent_overrides()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `requireTrainerSession()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/(dashboard)/trainer/alunas/actions.ts → src/lib/supabase/server.ts
- `ConvitePage()` --calls--> `createSupabaseAdminClient()`  [EXTRACTED]
  src/app/convite/[token]/page.tsx → src/lib/supabase/admin.ts
- `middleware()` --calls--> `updateSession()`  [EXTRACTED]
  src/middleware.ts → src/lib/supabase/middleware.ts
- `TrainerAlunasPage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/(dashboard)/trainer/alunas/page.tsx → src/lib/supabase/server.ts
- `TrainerAlunaDetalhePage()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/(dashboard)/trainer/alunas/[id]/page.tsx → src/lib/supabase/server.ts

## Communities (57 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (59): InviteForm(), dateFormatter, getAppUrl(), TrainerAlunasPage(), PendingInviteActions(), LogoutButton(), Role, DeactivateStudentButton() (+51 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (25): DesignSystemGenerator, _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (43): Accessibility, Available Domains, Available Stacks, code:bash (python3 --version || python --version), code:bash (python3 prompts/ui-ux-pro-max/scripts/search.py "<keyword>" ), code:bash (python3 prompts/ui-ux-pro-max/scripts/search.py "beauty spa ), code:bash (# Get UX guidelines for animation and accessibility), code:bash (python3 prompts/ui-ux-pro-max/scripts/search.py "layout resp) (+35 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (42): 2026-05-18 — Sprint 0: organização inicial, 2026-05-20 — Cadastro conectado ao Supabase Auth, 2026-05-20 — Configuração local do Supabase CLI, 2026-05-20 — Login e proteção inicial de rotas, 2026-05-20 — Migration aplicada no Supabase remoto, 2026-05-20 — Reorganização spec-driven, 2026-05-20 — Spec de autenticação em `.specs/`, 2026-05-20 — Sprint 0: base visual e design system (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): 10. Padrão de Commits, 1. Visão do Produto, 2. Público-Alvo, 3. Problema Resolvido, 4. MVP (Minimum Viable Product), 5. Funcionalidades Futuras (Backlog), 6. Perfis de Usuário, 7. Regras de Negócio Iniciais (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (15): BM25, detect_domain(), _load_csv(), Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, Load CSV and return list of dicts, Core search function using BM25 (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): auth.users, code:txt (id uuid primary key), code:txt (id uuid primary key references auth.users(id) on delete casc), code:txt (id uuid primary key), code:txt (id uuid primary key), code:txt (id uuid primary key), code:txt (id uuid primary key), code:txt (id uuid primary key) (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (26): dependencies, next, react, react-dom, server-only, @supabase/ssr, @supabase/supabase-js, devDependencies (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (24): Alteração em `profiles`, code:sql (alter table public.profiles), code:txt (src/app/), code:sql (create policy "Trainers can view own students"), code:sql (alter table public.student_invites enable row level security), code:ts (const { data: profile } = await supabase), code:txt (NEXT_PUBLIC_SUPABASE_URL=), Decisão Técnica (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (22): auth.users, Banco de Dados - FM Personal Online, code:txt (id uuid primary key), code:txt (id uuid primary key references auth.users(id) on delete casc), code:txt (id uuid primary key), code:txt (id uuid primary key), code:txt (id uuid primary key), code:txt (id uuid primary key) (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (21): Badge, Button, Card, Classes Tailwind, code:tsx (<PageHeader), code:tsx (<Card>), Componentes Base, Design System - FM Personal Online (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): Auth Spec - FM Personal Online, Cadastro, code:txt (src/app/), code:txt (src/lib/supabase/client.ts), code:txt (supabase/migrations/001_create_profiles.sql), Configuração do Supabase Client, Conteúdo Visual Inicial, Critérios de Aceite da Primeira Etapa Visual (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (17): Contexto, Critérios de Aceite da Feature, Escopo, Feature Spec - Gestão de Alunas, Fora de Escopo, Objetivo, Requisitos, STU-001 - Schema de convites e ativação (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (16): AUTH-001 - Cadastro visual, AUTH-002 - Login visual, AUTH-003 - Supabase client, AUTH-004 - Schema de profiles, AUTH-005 - Cadastro funcional, AUTH-006 - Login funcional, AUTH-007 - Logout, AUTH-008 - Redirecionamento por perfil (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (16): 10. Perfil individual `/trainer/alunas/[id]`, 11. Server Action `deactivateStudent`, 12. Bloqueio de aluna desativada no middleware, 13. Desabilitar signup público, 14. Smoke test manual, 15. Rodar validações, 1. Criar spec, design e tasks da feature, 2. Migration de profiles e student_invites (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (15): Badge, Button, Card, code:ts (brand: {), code:ts (fontFamily: {), Componentes Planejados, Cores da Marca, Design - Design System (+7 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (14): Critérios de Aceite, DS-001 - Tokens de cor, DS-002 - Tipografia, DS-003 - Estilo global, DS-004 - Componentes base, DS-005 - Variantes simples, DS-006 - Style guide, DS-007 - Conteúdo em português (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (14): Branches, code:txt (feature/sprint-0-foundation), code:txt (<tipo>(<escopo>): <descrição curta em português>), code:txt (docs(spec): atualiza escopo do MVP), code:md (## Resumo), code:bash (npm run lint), Comandos esperados futuramente, Commits (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.27
Nodes (12): addDays(), buildInviteLink(), cancelInvite(), createInvite(), deactivateStudent(), getAppUrl(), InviteActionResult, isValidEmail() (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (13): Arquivos Técnicos Existentes, code:txt (src/app/), code:txt (src/lib/supabase/client.ts), code:txt (NEXT_PUBLIC_SUPABASE_URL=), Criação de Profile no Cadastro, Decisão Técnica, Design - Autenticação, Fluxo de Cadastro Planejado (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.14
Nodes (13): 10. Rodar validações, 1. Criar spec da autenticação, 2. Criar páginas visuais de login e cadastro, 3. Configurar Supabase client, 4. Criar migration inicial de profiles, 5. Aplicar migration no Supabase, 6. Conectar cadastro ao Supabase Auth, 7. Conectar login ao Supabase Auth (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (12): AI Coding Guide — FM Personal Online, Checklist antes de aceitar uma resposta da IA, code:txt (Você é o executor técnico do projeto FM Personal Online.), code:txt (Revise as alterações feitas nesta etapa do projeto FM Person), code:txt (Criar apenas a página de login visual, sem autenticação func), code:txt (Criar todo o sistema de login, dashboard, alunos e treinos.), Escopo ideal por tarefa, Objetivo (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.21
Nodes (13): code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" -), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "<product_typ), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa w), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --d), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --d), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" -), How to Use This Skill, How to Use This Workflow (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.23
Nodes (12): code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa w), code:bash (# Get UX guidelines for animation and accessibility), code:bash (python3 skills/ui-ux-pro-max/scripts/search.py "layout respo), Example Workflow, Step 1: Analyze Requirements, Step 2: Generate Design System (REQUIRED), Step 2: Generate Design System (REQUIRED), Step 2: Generate Design System (REQUIRED) (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (10): Branches, code:txt (<tipo>(<escopo>): <descrição curta em português>), code:txt (docs(specs): reorganiza documentação em fluxo spec-driven), code:txt (docs/specs-reorganization), Commits, Convenções - FM Personal Online, Escopo Pequeno por Alteração, Nomes de Arquivos (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (10): Architecture — FM Personal Online, code:txt (src/), Decisões pendentes, Estrutura prevista, Objetivo, Perfis de acesso, Princípios de arquitetura, Stack principal (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): Available Domains, Available Stacks, code:bash (# ASCII box (default) - best for terminal display), How to Use, Output Formats, Rule Categories by Priority, Search Reference, Tips for Better Results (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.20
Nodes (9): App Router, Arquitetura - FM Personal Online, Arquitetura Geral, code:txt (src/app/), Integração Futura com Supabase, Segurança e RLS, Separação Entre Trainer e Student, Student (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.20
Nodes (9): code:bash (# 1. Instalar dependências), code:text (<tipo>(<escopo>): <descrição em português>), Como rodar localmente, Convenção de commits, Documentação, FM Personal Online, Scripts disponíveis, Stack (+1 more)

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (9): Alunas, Objetivos de Negócio, Objetivos de Portfólio Técnico, Personal Trainer, Princípios do Produto, Problema Resolvido, Projeto - FM Personal Online, Público-Alvo (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (9): Backlog Futuro, Roadmap - FM Personal Online, Sprint 0 - Fundação, Sprint 1 - Design System, Sprint 2 - Autenticação, Sprint 3 - Gestão de Alunas, Sprint 4 - Prescrição de Treinos, Sprint 5 - Execução de Treinos (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (8): code:txt (src/), code:txt (.specs/), code:txt (src/app/), Estrutura Atual Principal, Estrutura de Specs, Estrutura Desejada de Rotas, Estrutura - FM Personal Online, Finalidade de Cada Pasta

### Community 35 - "Community 35"
Cohesion: 0.22
Nodes (8): 1. Configurar Tokens Tailwind, 2. Configurar Fontes, 3. Ajustar `globals.css`, 4. Criar Componentes Base, 5. Criar `/style-guide`, 6. Criar `docs/DESIGN_SYSTEM.md`, 7. Rodar Validações, Tasks - Design System

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (8): Exercise, ExerciseLog, Student, Trainer, User, UserRole, WorkoutLog, WorkoutPlan

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (9): 1. Accessibility (CRITICAL), 2. Touch & Interaction (CRITICAL), 3. Performance (HIGH), 4. Layout & Responsive (HIGH), 5. Typography & Color (MEDIUM), 6. Animation (MEDIUM), 7. Style Selection (MEDIUM), 8. Charts & Data (LOW) (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (7): Concerns - FM Personal Online, Risco de Autenticação/Banco Sem RLS, Risco de Complexidade Antes do MVP, Risco de Design System Genérico, Risco de IA Implementar Coisa Demais, Riscos de Escopo, Riscos Técnicos

### Community 39 - "Community 39"
Cohesion: 0.29
Nodes (6): code:bash (npm run dev), Observações, Scripts Principais, Stack Atual, Stack - FM Personal Online, Stack Planejada

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (6): code:bash (npm run lint), Comandos Obrigatórios, Critérios Mínimos Antes de Merge, Testes Automatizados Futuros, Testes Manuais Recomendados, Testing e Validação - FM Personal Online

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): Blockers, Decisões Já Tomadas, Decisões Pendentes, Estado do Projeto - FM Personal Online, Histórico Resumido, Próximos Passos

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (5): Futuras Integrações Possíveis, GitHub, Integrações - FM Personal Online, Supabase, Vercel

### Community 43 - "Community 43"
Cohesion: 0.53
Nodes (4): config, middleware(), getSupabaseConfig(), updateSession()

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (6): Accessibility, Interaction, Layout, Light/Dark Mode, Pre-Delivery Checklist, Visual Quality

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (3): metadata, montserrat, playfair

### Community 46 - "Community 46"
Cohesion: 0.40
Nodes (4): name, organization_id, organization_slug, ref

### Community 47 - "Community 47"
Cohesion: 0.40
Nodes (5): Common Rules for Professional UI, Icons & Visual Elements, Interaction & Cursor, Layout & Spacing, Light/Dark Mode Contrast

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (5): code:bash (python3 --version || python --version), code:bash (brew install python3), code:bash (sudo apt update && sudo apt install python3), code:powershell (winget install Python.Python.3.12), Prerequisites

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (3): dependencies, @kilocode/plugin, @opencode-ai/plugin

## Knowledge Gaps
- **460 isolated node(s):** `extends`, `nextConfig`, `name`, `version`, `private` (+455 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ui-ux-pro-max` connect `Community 24` to `Community 44`, `Community 47`, `Community 48`, `Community 25`, `Community 26`, `Community 29`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `UI/UX Pro Max - Design Intelligence` connect `Community 29` to `Community 37`, `Community 44`, `Community 47`, `Community 48`, `Community 25`, `Community 26`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `extends`, `nextConfig`, `name` to the rest of the system?**
  _486 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.055633473585787754 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._