# Estado do Projeto - FM Personal Online

## Decisões Já Tomadas

- O produto será uma plataforma web para consultoria online de personal trainer.
- O MVP validará o fluxo: personal cria treino, aluna acessa e registra execução.
- A stack base é Next.js 15, React 19, TypeScript, Tailwind CSS e ESLint.
- Supabase será usado futuramente para Auth, Postgres e RLS.
- Vercel será usada futuramente para deploy.
- O design system segue a identidade Filipe Meirelles Personal Trainer.
- A autenticação usará `auth.users` do Supabase e uma tabela pública `profiles` para nome e perfil de acesso.
- Os perfis principais são `trainer` e `student`.
- Todo conteúdo visível no webapp deve estar em português brasileiro.

## Decisões Pendentes

- Decidir se o cadastro de alunas será público ou via convite/manual pelo trainer.
- Decidir se `exercises` será biblioteca global ou exercício por plano no MVP.
- Decidir se haverá `workout_days` para separar Treino A, B, C dentro de um plano.
- Definir política final de imutabilidade de logs após 24 horas.
- Definir quando será feito o deploy inicial na Vercel.

## Blockers

- Docker não está disponível no terminal atual, então o ambiente Supabase local ainda não foi executado.
- As chaves reais devem ficar apenas em `.env.local` e nunca serem commitadas.
- O fluxo de autenticação real depende da aplicação da migration `profiles`.

## Próximos Passos

1. Testar manualmente o fluxo completo de cadastro, login, redirecionamento e logout.
2. Revisar se a proteção por role está suficiente antes de iniciar gestão de alunas.
3. Planejar a próxima feature em `.specs/features/student-management/` antes de implementar CRUD.

## Histórico Resumido

- O projeto foi inicialmente criado por engano em outro repositório e depois migrado para `filipemeirelles/fm-personal-online`.
- A fundação técnica com Next.js, TypeScript, Tailwind, ESLint e documentação foi criada.
- O design system inicial da marca foi implementado com tokens, fontes, componentes base e `/style-guide`.
- A Sprint de autenticação foi iniciada com páginas visuais de login/cadastro, Supabase client e migration inicial de `profiles`.
- A documentação foi reorganizada para `.specs/`, incluindo specs de design system e autenticação.
- O projeto Supabase remoto `emvisxoadtdeojddvumd` foi linkado e recebeu a migration `001_create_profiles.sql`.
- O cadastro foi conectado ao Supabase Auth e a migration `002_create_profile_on_signup.sql` cria profiles automaticamente.
- Login, logout, placeholders `/trainer` e `/student`, middleware e redirecionamento por perfil foram implementados.
