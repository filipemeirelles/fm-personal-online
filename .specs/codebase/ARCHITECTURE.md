# Arquitetura - FM Personal Online

## Arquitetura Geral

O projeto usa Next.js com App Router. A aplicação será organizada por rotas públicas, rotas protegidas e componentes reutilizáveis.

O frontend deve continuar simples, com regras críticas protegidas por autenticação, banco e RLS quando Supabase estiver integrado.

## App Router

Estrutura planejada para rotas:

```txt
src/app/
├── (auth)/
│   ├── login/
│   └── cadastro/
├── (dashboard)/
│   ├── trainer/
│   └── student/
├── style-guide/
├── layout.tsx
└── page.tsx
```

## Separação Entre Trainer e Student

### Trainer

- Administra alunas.
- Cria e edita treinos.
- Acompanha histórico e evolução.
- Futuramente visualiza registros e envia feedbacks.

### Student

- Acessa apenas os próprios treinos.
- Registra execução.
- Consulta histórico e evolução.
- Não pode editar planos de treino.

## Integração Futura com Supabase

- `auth.users` será a base de autenticação.
- `profiles` armazenará nome e role (`trainer` ou `student`).
- Tabelas de domínio devem referenciar `profiles`, `trainers` e `students`.
- O acesso ao Supabase deve ficar centralizado em `src/lib/supabase`.

## Segurança e RLS

- Toda tabela com dados sensíveis deve ter RLS habilitada.
- Políticas devem usar `auth.uid()` como base de identidade.
- Alunas não podem acessar dados de outras alunas.
- Trainers só devem acessar alunas vinculadas a eles.
- Nenhuma regra crítica deve depender apenas do frontend.
