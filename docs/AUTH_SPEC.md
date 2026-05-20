# Auth Spec - FM Personal Online

## Objetivo

Definir o escopo da Sprint 1 de autenticação antes de implementar telas, Supabase, middleware ou regras de acesso. Esta spec deve evitar que a autenticação cresça além do necessário para o MVP.

## Princípio da Sprint 1

A autenticação deve ser construída em etapas pequenas:

1. Criar páginas visuais de login e cadastro usando o design system existente.
2. Configurar Supabase Auth somente depois das telas visuais estarem aprovadas.
3. Criar proteção de rotas por perfil apenas depois da estrutura de usuário estar definida.
4. Manter todo texto visível da interface em português brasileiro.

## Escopo do MVP de Autenticação

### Usuários

- `trainer`: personal trainer que administra alunas, treinos e evolução.
- `student`: aluna que acessa seus próprios treinos e registra execução.

### Fluxos Necessários

- Login com email e senha.
- Cadastro com email, senha, nome e perfil inicial.
- Logout.
- Redirecionamento por perfil após login.
- Proteção de rotas privadas.

### Rotas Planejadas

```txt
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── cadastro/
│       └── page.tsx
└── (dashboard)/
    ├── trainer/
    │   └── page.tsx
    └── student/
        └── page.tsx
```

As rotas de dashboard devem começar como placeholders mínimos apenas quando a proteção de rotas for implementada.

## Primeira Implementação Recomendada

Criar apenas as páginas visuais de autenticação:

- `/login`
- `/cadastro`

Essa primeira implementação não deve:

- conectar Supabase;
- criar sessão real;
- criar middleware;
- criar dashboard funcional;
- criar banco de dados;
- validar credenciais reais.

## Conteúdo Visual Inicial

### Login

Campos:

- Email
- Senha

Ações:

- Entrar
- Link para cadastro

Textos sugeridos:

- Título: `Acesse sua consultoria`
- Descrição: `Entre para acompanhar treinos, evolução e registros da sua jornada.`
- Botão: `Entrar`
- Link: `Ainda não tem acesso? Criar conta`

### Cadastro

Campos:

- Nome completo
- Email
- Senha
- Perfil: `Personal trainer` ou `Aluna`

Ações:

- Criar conta
- Link para login

Textos sugeridos:

- Título: `Crie seu acesso`
- Descrição: `Organize sua experiência de treino online em um ambiente simples e profissional.`
- Botão: `Criar conta`
- Link: `Já tem acesso? Entrar`

## Decisão Técnica Inicial

Quando Supabase for configurado, a decisão definida é usar:

- `auth.users` para autenticação nativa do Supabase;
- tabela `profiles` para dados públicos do usuário e role (`trainer` ou `student`);
- RLS baseada em `auth.uid()` e relacionamento entre trainer e student.

Essa decisão já está refletida em `docs/DATABASE_SCHEMA.md` e deve orientar a implementação real do banco.

## Configuração do Supabase Client

O pacote `@supabase/supabase-js` está instalado e o browser client inicial fica em:

```txt
src/lib/supabase/client.ts
```

Esse client usa as variáveis públicas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Nesta etapa, o client ainda não é usado pelos formulários de login e cadastro. A integração real de autenticação deve ser feita em uma etapa separada.

## Critérios de Aceite da Primeira Etapa Visual

- As páginas `/login` e `/cadastro` existem.
- Todo texto visível está em português brasileiro.
- As páginas usam o design system atual.
- O Supabase client pode existir, mas os formulários ainda não devem autenticar usuários.
- Não há dashboard real.
- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.

## Fora de Escopo Nesta Primeira Etapa

- Recuperação de senha.
- Confirmação de email.
- Login social.
- Convite por email.
- Multi-trainer.
- Dashboard funcional.
- CRUD de alunos.
- Treinos, exercícios ou registros de execução.
