# Feature Spec - Prescrição de Treinos

## Objetivo

Permitir que o trainer monte uma biblioteca de exercícios e prescreva treinos para cada aluna, organizando-os em planos com um ou mais treinos por dia (Treino A, B, C...), cada um com seus exercícios, séries, repetições, carga sugerida, descanso e observações. A aluna visualiza o treino prescrito e pode ajustar a carga sugerida para registrar e controlar a evolução da própria carga.

## Contexto

A Sprint 3 entregou a gestão de alunas com vínculo `trainer_id` em `profiles`. Com o vínculo trainer ↔ aluna estabelecido, a Sprint 4 entrega o núcleo do produto: a prescrição de treinos. Sem ela não há como evoluir para a execução de treinos (Sprint 5) nem para o MVP utilizável (Sprint 6).

Esta sprint resolve duas decisões pendentes do projeto:

- `exercises` será uma **biblioteca global por trainer**, reaproveitável entre planos e alunas (não exercício solto por plano).
- Haverá **`workout_days`** para separar Treino A, B, C dentro de um mesmo plano.

A base de exercícios do trainer hoje vive no computador dele e ainda não está no Supabase. A sprint entrega tanto a tela de gestão da biblioteca quanto uma migration de seed para popular a tabela quando o arquivo for fornecido.

## Escopo

- Trainer gerencia uma biblioteca de exercícios (`/trainer/exercicios`): criar, editar e desativar (soft delete).
- Cada exercício da biblioteca tem nome, grupo muscular, URL de vídeo/GIF e descrição/instruções.
- Trainer cria um plano de treino para uma aluna (nome, descrição, datas opcionais).
- Dentro de um plano, o trainer cria treinos por dia (Treino A, B, C...), cada um com nome e foco opcional.
- Dentro de cada treino, o trainer adiciona exercícios escolhidos da biblioteca.
- Para cada exercício prescrito o trainer define: número de séries, repetições (dropdown), carga sugerida, tempo de descanso (dropdown) e observações.
- O trainer pode reordenar, editar e remover treinos e exercícios prescritos.
- A aluna visualiza o plano vigente em `/student/treinos`, com os treinos e exercícios prescritos.
- A aluna pode editar **apenas a carga sugerida** de cada exercício prescrito, para registrar a carga que está usando.
- Seed de exercícios via migration, a ser gerado quando o trainer fornecer o arquivo da base atual.

## Fora de Escopo

- Registro de execução de treino, séries realizadas, marcação de "treino concluído" e histórico de execução (Sprint 5).
- Gráficos de evolução de carga (backlog).
- Biblioteca global compartilhada entre múltiplos trainers (cada trainer tem a própria biblioteca).
- Upload de arquivos de vídeo/imagem (usamos apenas URL externa nesta sprint).
- Duplicar/clonar planos ou treinos (backlog, avaliar na Sprint 6).
- Versionamento/histórico de alterações da prescrição.
- Notificações para a aluna quando um treino novo é prescrito.

## Requisitos

### WKT-001 - Schema de prescrição

Deve existir migration que cria:

- `exercises` — biblioteca global por trainer: `id`, `trainer_id`, `name`, `muscle_group`, `video_url`, `description`, `is_active`, `created_at`, `updated_at`.
- `workout_plans` — plano por aluna: `id`, `trainer_id`, `student_id`, `name`, `description`, `is_active`, `starts_at`, `ends_at`, `created_at`, `updated_at`.
- `workout_days` — treinos por dia dentro do plano (Treino A, B, C): `id`, `workout_plan_id`, `name`, `focus`, `sort_order`, `created_at`, `updated_at`.
- `workout_exercises` — exercício prescrito dentro de um treino: `id`, `workout_day_id`, `exercise_id`, `sets`, `reps`, `suggested_load`, `rest`, `notes`, `sort_order`, `created_at`, `updated_at`.
- RLS em todas as tabelas: trainer gerencia o que é seu; aluna lê apenas o que pertence aos seus planos; aluna só pode alterar `suggested_load`.

### WKT-002 - Biblioteca de exercícios

Trainer autenticado deve conseguir cadastrar, editar e desativar exercícios na própria biblioteca em `/trainer/exercicios`.

- Campos: nome (obrigatório), grupo muscular, URL de vídeo/GIF, descrição.
- Desativação é soft delete (`is_active = false`); exercícios já prescritos continuam válidos.
- Lista é filtrável/agrupável por grupo muscular.

### WKT-003 - Seed da base de exercícios

Deve existir uma migration de seed que popula `exercises` com a base atual do trainer quando o arquivo for fornecido.

- O seed associa os exercícios ao `trainer_id` correto.
- É idempotente (não duplica ao reaplicar).

### WKT-004 - Criar plano de treino

Trainer deve conseguir criar um plano para uma aluna vinculada a ele.

- A criação parte do perfil da aluna (`/trainer/alunas/[id]`).
- Campos: nome (obrigatório), descrição, data de início e fim (opcionais).
- O plano nasce com `is_active = true` e `trainer_id`/`student_id` corretos.

### WKT-005 - Treinos por dia (Treino A, B, C)

Dentro de um plano, o trainer adiciona, edita, reordena e remove treinos.

- Cada treino tem nome (ex: "Treino A") e foco opcional (ex: "Peito e tríceps").
- `sort_order` define a ordem de exibição.

### WKT-006 - Exercícios prescritos no treino

Dentro de um treino, o trainer adiciona exercícios da biblioteca e define os parâmetros.

- `sets`: número inteiro de séries (obrigatório).
- `reps`: escolhido em dropdown de valores fixos (ex: 8-12).
- `suggested_load`: carga sugerida (texto livre, ex: "20kg", "barra + 5kg").
- `rest`: escolhido em dropdown de valores fixos (ex: 60s).
- `notes`: observações livres.
- Exercícios podem ser reordenados e removidos.

### WKT-007 - Aluna visualiza o plano

A aluna vê seu plano vigente em `/student/treinos`, com os treinos e respectivos exercícios.

- Exibe nome do treino, foco, e por exercício: nome, vídeo/GIF (link), séries, repetições, carga sugerida, descanso e observações.
- Estado vazio acolhedor quando não há plano prescrito.

### WKT-008 - Aluna edita a carga sugerida

A aluna pode editar **apenas** a carga sugerida de cada exercício prescrito.

- Nenhum outro campo é editável pela aluna.
- A restrição é garantida no banco (RLS + trigger guard), não só na UI.

### WKT-009 - Conteúdo em português brasileiro

Todo texto visível continua em português brasileiro, seguindo o tom e o design system existentes.

## Critérios de Aceite da Feature

- Trainer cadastra exercícios na biblioteca e os vê listados por grupo muscular.
- Trainer cria um plano para uma aluna, adiciona Treino A/B/C e prescreve exercícios com séries, repetições, carga, descanso e observações.
- Repetições e descanso são escolhidos em dropdowns de valores fixos.
- A aluna abre `/student/treinos` e vê o plano prescrito.
- A aluna consegue editar a carga sugerida e não consegue alterar nenhum outro campo (testado contra manipulação direta de request, não só UI).
- O trainer só enxerga e edita exercícios, planos e treinos que lhe pertencem; a aluna só enxerga os próprios planos. RLS impede vazamento entre trainers e entre alunas.
- `npm run lint`, `npm run type-check` e `npm run build` passam.
- Smoke test manual: biblioteca → plano → treino → exercícios → aluna visualiza → aluna edita carga.
</content>
</invoke>
