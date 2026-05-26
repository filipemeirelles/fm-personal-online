# Tasks - MVP Utilizável

## 1. Spec, design e tasks

Status: concluído.

## 2. Componente `StatCard`

Status: pendente.

Critérios de verificação:

- Existe `src/components/shared/stat-card.tsx`.
- Usado pelo dashboard do trainer.

## 3. Dashboard `/trainer`

Status: pendente.

Critérios de verificação:

- Página mostra saudação com nome do trainer.
- Quatro stats: alunas ativas, convites pendentes, planos ativos, execuções 7 dias.
- Atalho para `/trainer/alunas`.

## 4. Resumo de atividade no perfil da aluna

Status: pendente.

Critérios de verificação:

- `/trainer/alunas/[id]` mostra plano ativo + últimas 5 execuções.
- Link "Ver treinos".

## 5. Dashboard `/student` com histórico

Status: pendente — entregue parcialmente na Sprint 5.

Critérios de verificação:

- Mostra plano ativo + lista compacta de exercícios + botão registrar.
- Mostra últimas 5 execuções.
- Estado vazio quando não há plano ativo.

## 6. README com seção Deploy na Vercel

Status: pendente.

Critérios de verificação:

- Variáveis de ambiente listadas.
- Passos para deploy descritos.
- Lembrete de aplicar migrations antes do primeiro deploy.

## 7. Atualizar `.env.example`

Status: pendente.

Critérios de verificação:

- Inclui todas as variáveis usadas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`).

## 8. Atualizar roadmap e state

Status: pendente.

Critérios de verificação:

- `ROADMAP.md` marca Sprints 4, 5 e 6 como concluídas.
- `STATE.md` documenta decisões arquiteturais tomadas e novos próximos passos.
- `docs/CHANGELOG.md` ganha entrada por sprint.

## 9. Rodar validações

Status: pendente.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
