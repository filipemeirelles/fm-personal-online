# Tasks - Gestão de Alunas

> **PONTO DE RETOMADA (sessão 2026-05-21):** Tasks 1 a 9 concluídas e testadas manualmente end-to-end (trainer cria convite, aluna aceita, vai para `/student`). Próximo trabalho é a Task 10 (perfil individual da aluna em `/trainer/alunas/[id]`). Branch ativa: `feat/sprint-3-student-management`. Dev server: `npm run dev` em `http://localhost:3000`. Para detalhes de contexto, ver `.specs/project/STATE.md` seção "Próximos Passos".

## 1. Criar spec, design e tasks da feature

Status: concluído ao mergear este documento.

Critérios de verificação:

- Existe `.specs/features/student-management/spec.md`.
- Existe `.specs/features/student-management/design.md`.
- Existe `.specs/features/student-management/tasks.md`.

## 2. Migration de profiles e student_invites

Status: concluído.

Critérios de verificação:

- Existe `supabase/migrations/003_student_management.sql`.
- `profiles` ganha `is_active boolean` e `trainer_id uuid`.
- Tabela `student_invites` criada com os campos definidos em `design.md`.
- Índice único parcial impede dois convites pendentes para o mesmo email pelo mesmo trainer.
- RLS habilitada em `student_invites`.
- Policies atualizadas em `profiles` para trainer ver/desativar próprias alunas.
- Função `security definer` para carregar convite por token criada.

## 3. Aplicar migration no Supabase remoto

Status: concluído.

Critérios de verificação:

- `npx supabase db push` aplica a migration sem erro.
- `npx supabase migration list` mostra a 003 alinhada local/remote.
- Tabelas e policies aparecem no Supabase Studio.

## 4. Adicionar Supabase Admin client

Status: concluído.

Critérios de verificação:

- Existe `src/lib/supabase/admin.ts` usando `SUPABASE_SERVICE_ROLE_KEY`.
- O arquivo é importado apenas em código server-side.
- `.env.example` lista a variável (sem valor).
- `.env.local` contém o valor real (não commitado).
- `npm run build` não inclui a service role no bundle do cliente.

## 5. Atualizar tipos de banco

Status: concluído.

Critérios de verificação:

- `src/types/database.ts` reflete as novas colunas e tabelas (gerado ou ajustado manualmente).
- `npm run type-check` passa.

## 6. Server Actions de convite (criar, listar, reenviar, cancelar)

Status: concluído.

Critérios de verificação:

- `createInvite(name, email)` valida sessão e role trainer, gera token, insere convite com expiração de 7 dias.
- `cancelInvite(id)` marca como `cancelled`.
- `resendInvite(id)` estende `expires_at` em 7 dias e mantém o token.
- Erros retornados são amigáveis e em português brasileiro.

## 7. Página de listagem `/trainer/alunas`

Status: concluído.

Critérios de verificação:

- Lista convites pendentes com nome, email, link copiável, botões reenviar/cancelar.
- Lista alunas ativas com nome, email, data de entrada.
- Botão primário "Convidar aluna" abre formulário (inline ou rota separada).
- Estados vazios claros para "sem convites" e "sem alunas".
- Estilo segue o design system.

## 8. Página pública `/convite/[token]`

Status: concluído.

Critérios de verificação:

- Carrega convite via função `security definer`.
- Mostra mensagem clara quando token é inválido, expirado ou já usado.
- Formulário exibe nome e email em modo somente leitura e campo de senha.
- Submit chama Server Action `acceptInvite`.

## 9. Server Action `acceptInvite`

Status: concluído.

Critérios de verificação:

- Usa Supabase Admin para criar `auth.users`.
- Garante `profiles` com role `student`, `trainer_id` correto, `is_active = true`.
- Marca convite como `accepted` com `accepted_at = now()`.
- Em caso de email já existente em `auth.users`, retorna mensagem clara.
- Em caso de sucesso, autentica a aluna e redireciona para `/student`.

## 10. Perfil individual `/trainer/alunas/[id]`

Status: pendente.

Critérios de verificação:

- Carrega profile somente se `trainer_id = auth.uid()`.
- Exibe nome, email, data de entrada.
- Botão "Desativar acesso" com modal de confirmação.

## 11. Server Action `deactivateStudent`

Status: pendente.

Critérios de verificação:

- Atualiza `profiles.is_active = false` para o id especificado.
- Falha se `trainer_id` não bate com `auth.uid()`.
- Após sucesso, lista de alunas ativas deixa de incluir a aluna.

## 12. Bloqueio de aluna desativada no middleware

Status: pendente.

Critérios de verificação:

- Middleware lê `is_active` junto com `role`.
- Aluna desativada que tenta acessar `/student` é deslogada e mandada para `/login?info=acesso-suspenso`.
- Mensagem em português brasileiro na tela de login.

## 13. Desabilitar signup público

Status: pendente.

Critérios de verificação:

- `/cadastro` redireciona server-side para `/login?info=convite`.
- Link "Criar conta" some das telas (ou vira "Recebi um convite").
- Tela de login exibe banner contextual quando `info=convite` ou `info=acesso-suspenso`.

## 14. Smoke test manual

Status: pendente.

Critérios de verificação:

- Trainer cria convite e copia o link.
- Aluna abre o link, define senha, é redirecionada para `/student`.
- Aluna aparece em `/trainer/alunas` como ativa.
- Trainer desativa a aluna; ela some da listagem padrão.
- Aluna desativada tenta logar e vê mensagem de acesso suspenso.
- Convite expirado e convite já usado mostram mensagens corretas.
- Acesso direto a `/cadastro` redireciona para `/login`.

## 15. Rodar validações

Status: pendente.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
