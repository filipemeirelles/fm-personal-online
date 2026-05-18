# Architecture — FM Personal Online

## Objetivo

Documentar as principais decisões técnicas do projeto para manter consistência durante o desenvolvimento com IA e facilitar leitura por recrutadores ou colaboradores.

## Stack principal

- Next.js 14+ com App Router
- React
- TypeScript em modo estrito
- Tailwind CSS
- Supabase para autenticação, banco PostgreSQL e Row Level Security
- Vercel para deploy

## Princípios de arquitetura

1. Separar regras de negócio da interface sempre que possível.
2. Manter componentes reutilizáveis em `src/components`.
3. Centralizar acesso ao Supabase em `src/lib/supabase`.
4. Usar tipos TypeScript explícitos para entidades principais.
5. Evitar lógica crítica apenas no frontend.
6. Proteger dados sensíveis com RLS no banco.
7. Implementar funcionalidades pequenas, testáveis e revisáveis.

## Estrutura prevista

```txt
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── trainer/
│   │   └── student/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── shared/
├── hooks/
├── lib/
│   ├── supabase/
│   └── utils.ts
└── types/
```

## Perfis de acesso

### Trainer

O trainer gerencia alunos, treinos, exercícios, históricos e feedbacks.

### Student

O student acessa apenas os próprios treinos, registra execuções e visualiza seu histórico.

## Decisões pendentes

- Definir se haverá cadastro público de alunos ou apenas convite criado pelo trainer.
- Definir se cada treino terá vários dias estruturados (`workout_days`) ou se cada plano será um treino único.
- Definir se vídeos/GIFs serão links externos ou arquivos armazenados.
- Definir primeiro design system baseado na identidade visual FM.
