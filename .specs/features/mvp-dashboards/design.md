# Design - MVP Utilizável

## Decisão Técnica

Esta sprint não cria novo modelo de dados. Reaproveita queries das Sprints 3, 4 e 5 para montar resumos e fechar o produto. Toda agregação é feita server-side via Supabase server client, usando `count` e queries simples (sem RPC novo).

## Páginas

### `/trainer` — Dashboard do personal

Layout em grid 2x2 de cards:

1. Alunas ativas (`count` em `profiles` com `trainer_id = me`, `role = 'student'`, `is_active = true`). Link para `/trainer/alunas`.
2. Convites pendentes (`count` em `student_invites` com `trainer_id = me`, `status = 'pending'`). Link para `/trainer/alunas`.
3. Planos ativos (`count` em `workout_plans` com `trainer_id = me`, `is_active = true`).
4. Execuções nos últimos 7 dias (`count` em `workout_logs` com `student_id in (alunas)` e `completed_at >= now() - 7d`).

Cabeçalho da página: saudação `Olá, {nome}` com `LogoutButton` no canto.

### `/trainer/alunas/[id]` — Perfil da aluna (incremento)

Adicionar bloco "Atividade":

- Plano ativo (título + data de criação ou aviso "Nenhum plano ativo").
- Últimas 5 execuções (data formatada em pt-BR e contagem de exercícios registrados).
- Link "Ver treinos".

### `/student` — Dashboard da aluna (incremento Sprint 5)

Estrutura:

- Cabeçalho saudação `Olá, {nome}`.
- Card "Plano ativo" com título, descrição e lista compacta de exercícios. Botão primário "Registrar treino".
- Card "Últimas execuções" com últimas 5 datas + link "Ver detalhe".
- Quando sem plano ativo: estado vazio orientando a aguardar o personal.

## Componentes

- `StatCard` (em `src/components/shared/stat-card.tsx`) — card compacto com título, número grande, descrição opcional. Será usado no dashboard do trainer.

## Documentação

- `README.md`: adicionar seção "Deploy na Vercel".
- `.env.example`: garantir todas as variáveis comentadas com exemplo de produção.
- `.specs/project/ROADMAP.md`: marcar sprints concluídas.
- `.specs/project/STATE.md`: documentar decisões arquiteturais tomadas (exercícios por plano, sem workout_days, logs editáveis).
- `docs/CHANGELOG.md`: entradas para sprints 4, 5 e 6.

## Riscos

- Sem agregação otimizada no MVP: queries de contagem podem virar lentas com muita gente. Aceito; o produto será usado por uma única personal com dezenas de alunas no máximo.
- Não há monitoração de erros (Sentry). Adicionar depois do go-live.
