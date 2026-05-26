# Feature Spec - Prescrição de Treinos

## Objetivo

Permitir que o trainer crie planos de treino e os atribua a alunas vinculadas, mantendo cada plano como uma lista ordenada de exercícios com séries, repetições, carga, descanso, observações e link opcional de vídeo.

## Contexto

A Sprint 3 entregou o vínculo trainer ↔ aluna via convite e soft delete. O fluxo principal do MVP (personal cria treino, aluna acessa e registra execução) depende agora de duas peças: prescrição (esta sprint) e execução (Sprint 5). Sem prescrição não há nada para a aluna executar.

## Escopo

- Trainer cria, edita e exclui planos de treino vinculados a uma aluna específica.
- Cada plano tem título, descrição opcional e estado ativo/inativo.
- Trainer adiciona, edita, reordena e remove exercícios de um plano.
- Exercícios contêm nome, séries, repetições, carga sugerida, descanso, observações e link opcional de vídeo/GIF.
- Apenas um plano por aluna pode ficar "ativo" — quando o trainer ativa um novo, os demais ficam automaticamente inativos.
- Trainer vê todos os planos da aluna (ativos e inativos) a partir do perfil da aluna.
- Plano inativo permanece visível para histórico; pode ser reativado.

## Fora de Escopo

- Biblioteca global de exercícios (cada exercício vive dentro de um plano no MVP).
- Separar treino A/B/C dentro do mesmo plano (`workout_days`). Cada variação será um plano separado nesta versão.
- Duplicação de planos entre alunas.
- Templates reutilizáveis ou clonagem de planos (backlog).
- Upload de vídeo próprio — apenas URL externa (YouTube, Drive, etc).
- Execução de treino pela aluna (Sprint 5).
- Histórico de evolução de carga e gráficos (backlog).
- Notificações ou envio do plano pronto.

## Requisitos

### WPR-001 - Schema de planos e exercícios

Migration deve criar:

- Tabela `workout_plans` com `id`, `trainer_id`, `student_id`, `title`, `description`, `is_active`, `created_at`, `updated_at`.
- Tabela `plan_exercises` com `id`, `plan_id`, `name`, `sets`, `reps`, `load`, `rest`, `notes`, `video_url`, `order_index`, `created_at`, `updated_at`.
- RLS habilitada em ambas, com policies que limitam acesso de trainer a planos das próprias alunas e da aluna aos próprios planos.
- Trigger que garante apenas um `workout_plans.is_active = true` por `student_id`.

### WPR-002 - Criar plano

Trainer autenticado abre `/trainer/alunas/[id]/treinos/novo`, informa título e descrição e cria o plano vinculado àquela aluna.

- Validação server-side: trainer só cria plano para aluna com `trainer_id = auth.uid()`.
- Plano nasce inativo. Trainer ativa explicitamente depois.

### WPR-003 - Listar planos da aluna

`/trainer/alunas/[id]/treinos` lista todos os planos da aluna em ordem decrescente de criação, separando ativo de inativos.

- Cada item mostra título, data de criação, status e link para edição.
- Estado vazio orienta a criar o primeiro plano.

### WPR-004 - Editor de plano

`/trainer/alunas/[id]/treinos/[planId]` permite ao trainer:

- Editar título e descrição do plano.
- Adicionar exercício (nome obrigatório, demais opcionais).
- Editar e remover exercícios existentes.
- Reordenar exercícios via `order_index` (botões mover ↑ / ↓ no MVP; drag-and-drop fica para depois).
- Ativar/desativar o plano.
- Excluir o plano (com confirmação).

### WPR-005 - Plano ativo único por aluna

Ao ativar um plano, o sistema deve garantir que qualquer outro plano da mesma aluna fique inativo. Isso vale tanto em UI quanto em trigger/constraint no banco.

### WPR-006 - Acesso da aluna ao plano ativo

A aluna autenticada deve poder ler o próprio plano ativo e seus exercícios via RLS, sem precisar de Server Action específica para isso. A Sprint 5 consome essa leitura na execução.

### WPR-007 - Trainer vê planos a partir do perfil da aluna

A página `/trainer/alunas/[id]` ganha link "Ver treinos" que leva para `/trainer/alunas/[id]/treinos`.

### WPR-008 - Conteúdo em português brasileiro

Todo texto visível continua em pt-BR, seguindo o design system existente.

## Critérios de Aceite da Feature

- Trainer cria um plano para uma aluna, adiciona exercícios e ativa.
- Ativar um plano novo desativa o anterior automaticamente.
- Aluna consegue ler o próprio plano ativo via RLS (validado no console do Supabase ou em smoke test).
- Trainer de outra aluna não acessa planos da aluna alheia (RLS).
- Excluir um plano apaga os exercícios em cascata.
- `npm run lint`, `npm run type-check` e `npm run build` passam.
