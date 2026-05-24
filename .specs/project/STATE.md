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

## Decisões Pendentes

- Decidir se `exercises` será biblioteca global ou exercício por plano no MVP.
- Decidir se haverá `workout_days` para separar Treino A, B, C dentro de um plano.
- Definir política final de imutabilidade de logs após 24 horas.
- Definir quando será feito o deploy inicial na Vercel.
- Definir provedor de envio de email (Resend, Postmark, etc.) para automatizar a entrega do link de convite (hoje é manual).

## Blockers

- Docker não está disponível no terminal atual, então o ambiente Supabase local ainda não foi executado. Todo trabalho está apontando para o projeto remoto.
- As chaves reais devem ficar apenas em `.env.local` e nunca serem commitadas.

## Próximos Passos

Sprint 3 fechada em 24/05/2026 após smoke test manual end-to-end (desativação de aluna pelo trainer, bloqueio no middleware com encerramento de sessão e mensagem `Seu acesso está suspenso` no login).

Próximo passo imediato: abrir PR da branch `feat/sprint-3-student-management` para `main`.

Branch atual: `feat/sprint-3-student-management`.

Itens pendentes que carregam para sprints futuras:

- Reavaliar a confirmação de email do Supabase antes do deploy em produção.
- Definir provedor de envio de email para automatizar a entrega do link de convite.
- Adicionar `graphify-out/` e `.planning/graphs/` ao `.gitignore` (artefatos de ferramenta entraram no último commit).
- Iniciar Sprint 4 — Prescrição de Treinos.

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
