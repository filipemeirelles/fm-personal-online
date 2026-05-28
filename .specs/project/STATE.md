# Estado do Projeto - FM Personal Online

## Decisões Já Tomadas

- O produto será uma plataforma web para consultoria online de personal trainer.
- O MVP validará o fluxo: personal cria treino, aluna acessa e registra execução.
- A stack base é Next.js 15, React 19, TypeScript, Tailwind CSS e ESLint.
- Supabase será usado para Auth, Postgres e RLS (projeto remoto `emvisxoadtdeojddvumd`).
- Vercel será usada futuramente para deploy.
- O design system segue a identidade Filipe Meirelles Personal Trainer.
- A autenticação usará `auth.users` do Supabase e uma tabela pública `profiles` para nome e perfil de acesso.
- Os perfis principais são `trainer` e `student`.
- Todo conteúdo visível no webapp deve estar em português brasileiro.
- A confirmação de email no Supabase está desligada para o MVP. Cadastro entra direto sem verificação de inbox. Reavaliar antes do go-live.
- O middleware do Next vive em `src/middleware.ts` (não na raiz), porque o projeto usa estrutura `src/`.
- O cadastro de alunas será via convite com token gerado pelo trainer (decisão da Sprint 3). Não há mais signup público para `student`.
- Remoção de aluna é soft delete via `profiles.is_active = false`. Histórico preservado.
- A `SUPABASE_SERVICE_ROLE_KEY` é usada apenas server-side, restrita por `import "server-only"` em `src/lib/supabase/admin.ts`.
- `exercises` é uma biblioteca global por trainer (decisão da Sprint 4), reaproveitável entre planos e alunas. O exercício prescrito vive em `workout_exercises`, separado da biblioteca.
- Há `workout_days` para separar Treino A, B, C dentro de um plano (decisão da Sprint 4).
- Uma aluna pode ter vários planos, mas só um ativo por vez (garantido por índice único parcial em `workout_plans`).
- Na prescrição, a aluna só pode alterar `suggested_load`, garantido por RLS + trigger `guard_workout_exercise_columns` (mesmo padrão do guard de `profiles`).
- Grupo muscular, repetições e descanso são listas fixas em `src/lib/workout/options.ts` (armazenados como texto, sem migration para ampliar).

## Decisões Pendentes

- Definir política final de imutabilidade de logs após 24 horas.
- Definir quando será feito o deploy inicial na Vercel.
- Definir provedor de envio de email (Resend, Postmark, etc.) para automatizar a entrega do link de convite (hoje é manual).

## Blockers

- Docker não está disponível no terminal atual, então o ambiente Supabase local ainda não foi executado. Todo trabalho está apontando para o projeto remoto.
- As chaves reais devem ficar apenas em `.env.local` e nunca serem commitadas.

## Próximos Passos

Sprint 4 — Prescrição de Treinos implementada na branch `claude/github-project-analysis-vJMeq`. Código completo e validado (`lint`, `type-check`, `build` passam com env do Supabase).

Próximos passos imediatos:

- Aplicar as migrations `004_workout_prescription.sql` e `005_seed_exercises.sql` no Supabase remoto (`npx supabase db push`) — pendente de credenciais/ambiente.
- O trainer fornecer o arquivo da base de exercícios para completar o seed `005` (hoje é só um scaffold).
- Smoke test manual end-to-end da prescrição (biblioteca → plano → treino → exercícios → aluna visualiza → aluna edita carga).

Branch atual: `claude/github-project-analysis-vJMeq`.

Itens pendentes que carregam para sprints futuras:

- Reavaliar a confirmação de email do Supabase antes do deploy em produção.
- Definir provedor de envio de email para automatizar a entrega do link de convite.
- Iniciar Sprint 5 — Execução de Treinos (registro de séries realizadas, marcar treino concluído, histórico de carga).

## Histórico Resumido

- O projeto foi inicialmente criado por engano em outro repositório e depois migrado para `filipemeirelles/fm-personal-online`.
- A fundação técnica com Next.js, TypeScript, Tailwind, ESLint e documentação foi criada.
- O design system inicial da marca foi implementado com tokens, fontes, componentes base e `/style-guide`.
- A Sprint de autenticação foi iniciada com páginas visuais de login/cadastro, Supabase client e migration inicial de `profiles`.
- A documentação foi reorganizada para `.specs/`, incluindo specs de design system e autenticação.
- O projeto Supabase remoto `emvisxoadtdeojddvumd` foi linkado e recebeu a migration `001_create_profiles.sql`.
- O cadastro foi conectado ao Supabase Auth e a migration `002_create_profile_on_signup.sql` cria profiles automaticamente.
- Login, logout, placeholders `/trainer` e `/student`, middleware e redirecionamento por perfil foram implementados.
- Bug do middleware sendo ignorado (estava na raiz com projeto em `src/`) foi corrigido movendo para `src/middleware.ts`. Matcher passou a cobrir explicitamente as rotas-raiz `/trainer` e `/student`.
- Mapeamento de mensagens de erro do login foi melhorado para diferenciar credenciais inválidas, email não confirmado e expor a mensagem bruta do Supabase em casos não previstos.
- Sprint 2 fechada após smoke test manual end-to-end: cadastro, login, redirect por role, logout, proteção de rotas e cross-protection trainer↔student.
- Sprint 3 iniciada em branch `feat/sprint-3-student-management`. Migration `003_student_management.sql` aplicada no Supabase remoto (adiciona `is_active` e `trainer_id` em `profiles`, cria `student_invites`, função `get_invite_by_token` security definer, trigger anti-tampering em `profiles`, RLS para trainer ver/gerenciar alunas vinculadas).
- Sprint 3 entregou: `src/lib/supabase/admin.ts` (service role server-only), `src/lib/supabase/server.ts` (client server com cookies), `src/app/(dashboard)/trainer/alunas/` (página + actions `createInvite`/`cancelInvite`/`resendInvite`/`deactivateStudent` + form e botões por linha), `src/app/(dashboard)/trainer/alunas/[id]/` (perfil individual com nome, email Auth, data de entrada, status e desativação), `src/app/convite/[token]/` (página pública + action `acceptInvite` que cria `auth.users` via admin, marca convite como aceito e loga a aluna), middleware bloqueando aluna desativada e `/cadastro` redirecionando para `/login?info=convite`.
- Tasks 10 a 13 da Sprint 3 foram concluídas em 23/05/2026. `npm run lint`, `npm run type-check` e `npm run build` passaram.
- Sprint 3 fechada em 24/05/2026 após smoke test manual end-to-end. Pronta para abrir PR para `main`.
- Sprint 4 iniciada na branch `claude/github-project-analysis-vJMeq` com spec/design/tasks em `.specs/features/workout-prescription/`. Resolveu as decisões pendentes de `exercises` (biblioteca global) e `workout_days` (Treino A/B/C).
- Migration `004_workout_prescription.sql` criada: tabelas `exercises`, `workout_plans`, `workout_days`, `workout_exercises`, índices, RLS para trainer e aluna, índice único parcial de plano ativo e trigger `guard_workout_exercise_columns` (aluna só altera `suggested_load`). Migration `005_seed_exercises.sql` criada como scaffold idempotente aguardando a base real do trainer.
- Sprint 4 entregou: `src/lib/workout/options.ts` (listas fixas de reps/descanso/grupos musculares), `src/components/ui/select.tsx`, biblioteca de exercícios em `/trainer/exercicios` (page + actions + `exercises-manager`), planos na página da aluna (`plans-section` + `planos/actions.ts` com `createPlan`/`activatePlan`/`deactivatePlan`/`deletePlan`), editor de plano em `/trainer/alunas/[id]/planos/[planId]` (page + actions de dias/exercícios/reorder + `plan-editor` + `exercise-form`), visão da aluna em `/student/treinos` (page + `load-input` + action `updateSuggestedLoad`) e links de navegação nos painéis de trainer e aluna.
- Validações da Sprint 4 (`lint`, `type-check`, `build`) passaram. Falta aplicar migrations no remoto, completar o seed e smoke test manual.
