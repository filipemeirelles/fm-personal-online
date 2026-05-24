# Feature Spec - Gestão de Alunas

## Objetivo

Permitir que o trainer convide, liste, visualize e desative alunas dentro do FM Personal Online, preservando histórico após desativação e mantendo o controle total de quem entra no sistema na mão do trainer.

## Contexto

A Sprint 2 entregou autenticação com signup público. Para a operação real da Filipe Meirelles Personal Trainer, o trainer precisa controlar quem cria conta como aluna. A Sprint 3 substitui o autosserviço por um fluxo de convite: trainer registra a aluna como pendente e envia um link; a aluna conclui o cadastro definindo a própria senha. Sem essa feature não há como evoluir para a prescrição de treinos (Sprint 4) com vínculo claro entre aluna e trainer.

## Escopo

- Trainer convida aluna informando nome e email.
- Sistema cria registro pendente e gera token único de convite.
- Aluna recebe link (`/convite/[token]`), aceita e define senha.
- Aceite cria `auth.users` + `profiles` com role `student` automaticamente.
- Trainer lista alunas ativas em `/trainer/alunas`.
- Trainer vê perfil individual da aluna em `/trainer/alunas/[id]`.
- Trainer desativa aluna via soft delete (`is_active = false`); histórico permanece.
- Aluna desativada perde acesso ao login.
- Trainer lista convites pendentes e pode reenviar ou cancelar.
- Convites expiram após período definido.

## Fora de Escopo

- Reativação de alunas desativadas (backlog).
- Envio real de email (o link é exibido na UI do trainer; integração com provedor de email vira backlog).
- Edição de dados da aluna pelo próprio trainer (somente a aluna edita o próprio profile).
- Múltiplos trainers / atribuição entre trainers.
- Anamnese, avaliação física, fotos de progresso.
- Treinos, exercícios ou logs (Sprints 4 e 5).
- Recuperação de senha (backlog).
- Magic link ou login social.

## Requisitos

### STU-001 - Schema de convites e ativação

Deve existir migration que:

- Cria tabela `student_invites` com `id`, `trainer_id`, `name`, `email`, `token`, `status`, `expires_at`, `accepted_at`, `created_at`.
- Adiciona coluna `is_active boolean not null default true` em `profiles`.
- Adiciona coluna `trainer_id uuid references profiles(id)` em `profiles` (nula para trainers, obrigatória para students vinculados).
- RLS em `student_invites`: trainer só vê os próprios convites; aluna só lê o convite associado ao seu token via função `security definer`.

### STU-002 - Criar convite

Trainer autenticado deve conseguir criar um convite informando nome e email da aluna.

- Email deve ser único entre convites pendentes do mesmo trainer.
- Token é gerado server-side com `crypto.randomUUID()` ou função de geração segura.
- Convite nasce com `status = 'pending'` e `expires_at = now() + 7 days`.

### STU-003 - Listagem de convites pendentes

Página `/trainer/alunas` deve exibir convites pendentes com nome, email, data de criação, link copiável e ações: reenviar (estende expiração) e cancelar.

### STU-004 - Aceite de convite

A página `/convite/[token]` valida o token e exibe formulário com nome (preenchido, somente leitura), email (somente leitura) e campo de senha.

- Token inválido, expirado ou já usado deve mostrar mensagem clara.
- Ao submeter, o sistema cria `auth.users`, garante `profiles` com role `student`, `trainer_id` correto e `is_active = true`, marca o convite como `accepted` e redireciona para `/student`.

### STU-005 - Listagem de alunas ativas

Página `/trainer/alunas` deve exibir alunas com `is_active = true` em uma seção separada dos convites pendentes, mostrando nome, email e data de entrada.

### STU-006 - Perfil individual da aluna

Página `/trainer/alunas/[id]` exibe os dados da aluna. Trainer só pode abrir perfis das próprias alunas (RLS por `trainer_id`).

### STU-007 - Desativar aluna (soft delete)

Trainer pode desativar uma aluna a partir do perfil individual.

- A ação muda `profiles.is_active` para `false`.
- O registro permanece no banco para preservar histórico.
- A aluna deixa de aparecer na listagem padrão.

### STU-008 - Bloquear login de aluna desativada

Aluna com `is_active = false` que tente logar deve ser deslogada e ver mensagem informando que o acesso foi suspenso. Middleware deve validar `is_active` para rotas `/student`.

### STU-009 - Cadastro público desativado

O signup público em `/cadastro` deve ser removido ou desabilitado. Tentativa direta deve redirecionar para `/login` com mensagem explicando que o acesso ocorre por convite.

### STU-010 - Conteúdo em português brasileiro

Todo texto visível continua em português brasileiro, seguindo o tom e o design system existentes.

## Critérios de Aceite da Feature

- Trainer cria convite, vê o link, e a aluna conclui o cadastro pelo link.
- Convite expirado ou já usado é recusado com mensagem clara.
- Aluna desativada não consegue mais acessar `/student`.
- Aluna desativada continua existindo no banco com `is_active = false`.
- Trainer só vê convites e alunas que lhe pertencem; RLS impede vazamento entre trainers, mesmo manipulando requests.
- Cadastro público em `/cadastro` não cria mais alunas.
- `npm run lint`, `npm run type-check` e `npm run build` passam.
- Smoke test manual: convite → aceite → login → desativação → tentativa de login bloqueada.
