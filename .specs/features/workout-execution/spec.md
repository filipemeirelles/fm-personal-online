# Feature Spec - Execução de Treinos

## Objetivo

Permitir que a aluna visualize o plano de treino ativo e registre a execução de cada exercício (carga, repetições e observações realizadas), salvando o histórico para consulta futura.

## Contexto

A Sprint 4 entregou prescrição: o trainer cria planos e atribui à aluna. Agora a aluna precisa consumir esses planos. Esta sprint fecha o loop principal do MVP: personal cria treino → aluna acessa → aluna registra execução.

## Escopo

- Aluna vê o próprio plano ativo na área do aluno.
- Aluna inicia um registro de execução do plano.
- Para cada exercício prescrito, aluna informa séries realizadas, repetições realizadas, carga usada e observação opcional.
- Aluna marca o treino como concluído. Sistema salva o `workout_log` e os `exercise_logs` associados.
- Aluna consulta histórico de execuções do plano ativo (lista das últimas execuções com data e duração).
- Aluna pode editar uma execução anterior (sem janela de 24h no MVP — decisão consciente).

## Fora de Escopo

- Cronômetro de descanso e tempo de exercício.
- Visualização de gráfico de evolução (backlog).
- Feedback do personal sobre execução (backlog).
- Aluna escolher um plano diferente do ativo (no MVP só o ativo é executável; planos anteriores ficam só como histórico).
- Marcar exercício individual como "pulado".
- Múltiplas sessões abertas simultaneamente — a aluna abre o form, preenche, conclui (não há rascunho persistido).
- Trainer ver detalhes de cada execução (na Sprint 6 fica apenas um contador resumido por aluna).

## Requisitos

### WEX-001 - Schema de logs

Migration deve criar:

- Tabela `workout_logs` com `id`, `student_id`, `plan_id`, `started_at`, `completed_at`, `notes`, `created_at`, `updated_at`.
- Tabela `exercise_logs` com `id`, `workout_log_id`, `plan_exercise_id`, `sets_done`, `reps_done`, `load_done`, `notes`, `created_at`, `updated_at`.
- RLS: aluna manage próprios logs; trainer pode ler logs de alunas vinculadas (visualização passa a aparecer no Sprint 6).

### WEX-002 - Página `/student` exibe plano ativo

A área da aluna `/student` mostra:

- Nome do plano ativo + descrição.
- Lista resumida dos exercícios prescritos (nome, séries, reps, carga, descanso).
- Botão primário "Registrar treino".
- Quando não há plano ativo, estado vazio orienta a aguardar o personal.

### WEX-003 - Página de registro `/student/treinos/[planId]/registrar`

Formulário com uma seção por exercício prescrito, contendo campos `sets_done`, `reps_done`, `load_done` e `notes`. Campo de observação geral do treino aparece no fim.

- Validação: pelo menos um exercício deve ter algum campo preenchido para concluir o registro.
- Botão "Concluir treino" cria `workout_log` com `started_at = now()` (aproximação), `completed_at = now()` e os `exercise_logs` correspondentes.
- Após concluir, redireciona para `/student` com mensagem de sucesso.

### WEX-004 - Histórico de execuções

Em `/student`, exibir lista das últimas execuções (data, status concluído, link para detalhe). No MVP, "detalhe" abre `/student/treinos/[planId]/historico/[logId]` em modo somente leitura.

### WEX-005 - Edição de execução

Aluna pode reabrir uma execução anterior em modo edição. Decisão MVP: sem janela de 24h. Histórico do que foi editado não é versionado.

### WEX-006 - Trainer vê histórico resumido

Sprint 6 adiciona ao perfil da aluna (`/trainer/alunas/[id]`) um bloco com últimas execuções (data e número de exercícios registrados). Não há acesso ao detalhe nesta etapa.

### WEX-007 - Conteúdo em português brasileiro

Todo texto visível em pt-BR.

## Critérios de Aceite da Feature

- Aluna entra em `/student`, vê o plano ativo e registra a execução em uma página única.
- Após concluir, o registro aparece no histórico em `/student`.
- Aluna pode reabrir e editar uma execução anterior.
- Trainer não consegue editar logs alheios (RLS).
- Trainer consegue ver o resumo na própria aluna em Sprint 6.
- `npm run lint`, `npm run type-check` e `npm run build` passam.
