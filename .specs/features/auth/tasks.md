# Tasks - Autenticação

## 1. Criar spec da autenticação

Status: concluído.

Critérios de verificação:

- Existe documentação da feature em `.specs/features/auth/`.
- Escopo e fora de escopo estão claros.

## 2. Criar páginas visuais de login e cadastro

Status: concluído.

Critérios de verificação:

- `/login` renderiza formulário visual de email e senha.
- `/cadastro` renderiza formulário visual de nome, email, senha e perfil.
- Nenhuma autenticação real acontece nesta etapa.

## 3. Configurar Supabase client

Status: concluído.

Critérios de verificação:

- `@supabase/supabase-js` está instalado.
- Existe `src/lib/supabase/client.ts`.
- `.env.example` contém variáveis públicas esperadas.

## 4. Criar migration inicial de profiles

Status: concluído no repositório, pendente de aplicação em ambiente.

Critérios de verificação:

- Existe `supabase/migrations/001_create_profiles.sql`.
- Migration cria `profiles`.
- RLS está habilitada.
- Policies mínimas do próprio usuário existem.

## 5. Aplicar migration no Supabase

Status: pendente.

Critérios de verificação:

- Projeto Supabase local ou remoto está disponível.
- Migration foi aplicada sem erro.
- Tabela `profiles` aparece no Supabase Studio.
- RLS está habilitada.
- Policies aparecem na tabela.

## 6. Conectar cadastro ao Supabase Auth

Status: pendente.

Critérios de verificação:

- `/cadastro` cria usuário com email e senha.
- `/cadastro` cria registro correspondente em `profiles`.
- Erros são exibidos em português brasileiro.
- Não há dashboard real nesta etapa.

## 7. Conectar login ao Supabase Auth

Status: pendente.

Critérios de verificação:

- `/login` autentica com email e senha.
- Erros são exibidos em português brasileiro.
- Usuário autenticado pode ser identificado pela sessão.

## 8. Criar placeholders de dashboard

Status: pendente.

Critérios de verificação:

- Existem placeholders mínimos para trainer e student.
- Não há funcionalidade real de dashboard.
- Conteúdo visível está em português brasileiro.

## 9. Criar proteção de rotas e redirecionamento

Status: pendente.

Critérios de verificação:

- Usuário sem sessão volta para `/login`.
- Trainer vai para área trainer.
- Student vai para área student.
- Acesso por role incompatível é bloqueado.

## 10. Rodar validações

Status: pendente a cada etapa.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
