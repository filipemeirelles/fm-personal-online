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
- **Exercícios são por plano**, não biblioteca global no MVP (decisão da Sprint 4). Cada exercício vive dentro de um único `workout_plan`.
- **Sem `workout_days`** no MVP (decisão da Sprint 4). Cada variação de treino (A, B, C) é um plano separado. Simplifica modelo e UI.
- **Plano ativo único por aluna**, garantido por índice único parcial + trigger no banco (Sprint 4).
- **Logs de execução editáveis sem janela de tempo** no MVP (decisão da Sprint 5). Aluna pode reabrir e editar qualquer execução anterior. Reavaliar antes do go-live se virar dor.
- **Reordenação de exercícios em duas etapas** (não atômica). Risco aceito; reescrever se houver colisão real.

## Decisões Pendentes

- Definir provedor de envio de email (Resend, Postmark, etc.) para automatizar a entrega do link de convite (hoje é manual).
- Reavaliar confirmação de email do Supabase antes do go-live.
- Reavaliar imutabilidade de logs após 24h quando houver uso real.
- Considerar drag-and-drop para reordenar exercícios (hoje é botão ↑/↓).
- Considerar biblioteca global de exercícios quando houver dor real de duplicação entre planos.

## Blockers

- Docker não está disponível no terminal atual, então o ambiente Supabase local ainda não foi executado. Todo trabalho está apontando para o projeto remoto.
- As chaves reais devem ficar apenas em `.env.local` e nunca serem commitadas.
- Migrations `004_workout_plans.sql` e `005_workout_logs.sql` ainda precisam ser aplicadas no Supabase remoto via `npx supabase db push` antes do smoke test.

## Próximos Passos

Sprints 4, 5 e 6 implementadas em 26/05/2026 na branch `claude/web-app-creation-Fq8pk`.

Próximos passos imediatos do usuário:

1. Aplicar migrations 004 e 005 no Supabase remoto (`npx supabase db push`).
2. Atualizar `.env.local` se faltar variável (todas já estão em `.env.example`).
3. Rodar smoke test manual end-to-end:
   - Trainer cria plano para aluna, adiciona exercícios, ativa.
   - Aluna abre `/student`, vê plano ativo, registra execução.
   - Histórico aparece em `/student`; aluna reabre e edita registro.
   - Trainer abre perfil da aluna e vê resumo de atividade.
4. Abrir PR `claude/web-app-creation-Fq8pk` → `main` após smoke test.
5. Iniciar preparo de deploy na Vercel seguindo `README.md`.

Itens carregando para depois do MVP:

- Provedor de email transacional para automatizar convite.
- Reavaliar confirmação de email e janela de edição de logs.
- Backlog: gráficos de evolução, feedback do personal, biblioteca global de exercícios, anamnese.

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
- Sprints 4, 5 e 6 implementadas em 26/05/2026 na branch `claude/web-app-creation-Fq8pk`. Sprint 4 entrega prescrição de treinos (CRUD de planos e exercícios pelo trainer com plano ativo único por aluna garantido por trigger). Sprint 5 entrega execução pela aluna (formulário único de registro + edição de execuções anteriores). Sprint 6 entrega dashboard do trainer com stats agregados, bloco de atividade no perfil da aluna e instruções de deploy na Vercel. Migrations `004_workout_plans.sql` e `005_workout_logs.sql` criadas mas pendentes de aplicação. `npm run lint`, `npm run type-check` e `npm run build` (com env vars dummy) passaram.
