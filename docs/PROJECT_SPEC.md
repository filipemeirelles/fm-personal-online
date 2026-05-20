# FM Personal Online — Project Spec

> Spec Driven Development: este documento deve ser atualizado antes de qualquer nova funcionalidade ser implementada.

---

## 1. Visão do Produto

**FM Personal Online** é uma plataforma web para personal trainers que trabalham com consultoria online. Centraliza a gestão de alunos, prescrição de treinos, acompanhamento de evolução e comunicação, substituindo o uso fragmentado de planilhas, PDFs e WhatsApp.

O produto posiciona o personal trainer como profissional tech-savvy, entregando uma experiência estruturada e profissional para seus alunos.

---

## 2. Público-Alvo

### Personal Trainer (administrador)
- Atua com consultoria online
- Gerencia entre 10 e 100 alunos simultaneamente
- Hoje usa planilhas, Google Drive e WhatsApp para organizar tudo
- Quer profissionalizar a entrega e escalar o atendimento

### Aluno (usuário final)
- Recebe treinos e orientações remotamente
- Quer acessar seu plano de treino de forma simples, a qualquer hora
- Precisa registrar evoluções e tirar dúvidas com o personal

---

## 3. Problema Resolvido

| Dor atual | Solução proposta |
|---|---|
| Treinos enviados por PDF no WhatsApp | Plataforma com treinos organizados e acessíveis |
| Sem histórico de evolução centralizado | Registro de pesos e feedbacks por sessão |
| Comunicação dispersa entre apps | Mensagens e feedbacks dentro da própria plataforma |
| Dificuldade de escalar o atendimento | Dashboard com visão consolidada de todos os alunos |
| Imagem pouco profissional | Interface limpa com identidade do personal |

---

## 4. MVP (Minimum Viable Product)

O MVP deve validar o fluxo principal: **personal cria treino → aluno acessa e registra execução**.

### Funcionalidades do MVP

**Autenticação**
- [ ] Login e cadastro via email/senha (Supabase Auth)
- [ ] Dois perfis: `trainer` e `student`
- [ ] Proteção de rotas por perfil

**Gestão de Alunos (Trainer)**
- [ ] Cadastrar aluno manualmente
- [ ] Listar alunos ativos
- [ ] Visualizar perfil individual do aluno

**Prescrição de Treinos (Trainer)**
- [ ] Criar plano de treino com nome, descrição e data de vigência
- [ ] Adicionar exercícios ao treino: nome, séries, repetições, carga, descanso e observações
- [ ] Atribuir treino a um aluno

**Execução de Treinos (Aluno)**
- [ ] Visualizar treino vigente
- [ ] Registrar execução: carga realizada e observação por exercício
- [ ] Marcar treino como concluído

**Dashboard**
- [ ] Trainer: resumo de alunos ativos e últimos treinos cadastrados
- [ ] Aluno: próximo treino e últimas execuções

---

## 5. Funcionalidades Futuras (Backlog)

### Fase 2 — Evolução e Comunicação
- Gráfico de evolução de carga por exercício
- Upload de foto de progresso pelo aluno
- Feedback do personal sobre execução registrada
- Notificações in-app (treino disponível, feedback recebido)

### Fase 3 — Engajamento
- Anamnese digital (questionário de saúde inicial)
- Sistema de avaliação física (medidas corporais)
- Biblioteca de exercícios com vídeo/GIF de referência
- Calendário de treinos com frequência semanal

### Fase 4 — Escala
- Multi-trainer (agência/studio)
- Planos de assinatura para alunos (Stripe)
- App mobile via PWA
- Exportação de relatórios em PDF
- Integração com wearables (passos, sono)

---

## 6. Perfis de Usuário

### `trainer`
- Acesso total ao painel de gestão
- Pode criar, editar e excluir treinos
- Pode cadastrar e gerenciar alunos
- Visualiza relatórios e histórico de todos os alunos

### `student`
- Acesso restrito ao próprio painel
- Visualiza apenas seus treinos atribuídos
- Registra execuções e feedbacks
- Não acessa dados de outros alunos

---

## 7. Regras de Negócio Iniciais

1. Um aluno só pode ter **um treino ativo por vez** por tipo (ex: treino A, treino B).
2. O trainer deve estar cadastrado antes de cadastrar qualquer aluno.
3. Um treino só é visível ao aluno **após ser atribuído** pelo trainer.
4. Registros de execução são **imutáveis** após 24 horas (auditoria).
5. O aluno não pode editar o plano de treino, apenas registrar execuções.
6. Toda ação de criação/edição de treino fica registrada com `created_by` e `updated_at`.
7. Um aluno pode ser **desativado** (soft delete) sem perder histórico.

---

## 8. Arquitetura Técnica

### Stack
| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15+ (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| Deploy | Vercel |
| Controle de versão | Git + GitHub |

### Estrutura de Pastas
```txt
src/
├── app/                    # App Router (Next.js)
│   ├── style-guide/         # Visualização temporária do design system
│   ├── (auth)/             # Rotas públicas (login, cadastro)
│   ├── (dashboard)/        # Rotas protegidas
│   │   ├── trainer/        # Painel do personal
│   │   └── student/        # Painel do aluno
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # Componentes base (buttons, inputs, cards)
│   └── shared/             # Componentes reutilizáveis de domínio
├── lib/
│   ├── supabase/           # Client e helpers do Supabase
│   └── utils.ts
├── types/                  # Tipos TypeScript globais
└── hooks/                  # Custom hooks
docs/
├── PROJECT_SPEC.md         # Este arquivo
├── ARCHITECTURE.md         # Decisões técnicas e arquitetura
├── DATABASE_SCHEMA.md      # Modelo de dados e RLS
├── AUTH_SPEC.md            # Escopo da autenticação
├── DEVELOPMENT_WORKFLOW.md # Fluxo de Git, commits e PRs
├── AI_CODING_GUIDE.md      # Guia para trabalhar com Claude/Codex
├── DESIGN_SYSTEM.md        # Base visual da marca
└── CHANGELOG.md            # Histórico de mudanças
```

### Modelo de Dados (inicial)
```txt
auth.users     → id, email, created_at
profiles       → id, name, role (trainer|student), created_at
trainers       → id, profile_id, bio, created_at
students       → id, profile_id, trainer_id, active, created_at
workout_plans  → id, trainer_id, student_id, name, description, active, created_at
exercises      → id, workout_plan_id, name, sets, reps, load, rest, notes, order
workout_logs   → id, student_id, workout_plan_id, completed_at, notes
exercise_logs  → id, workout_log_id, exercise_id, actual_load, notes, created_at
```

---

## 9. Roadmap Inicial

### Sprint 0 — Fundação (atual)
- [x] Criar repositório dedicado `fm-personal-online`
- [x] Criar `README.md`
- [x] Criar `docs/PROJECT_SPEC.md`
- [x] Criar documentação técnica complementar
- [x] Criar estrutura real do projeto Next.js + TypeScript + Tailwind
- [ ] Configurar Supabase (projeto + schema inicial)
- [ ] Configurar deploy na Vercel
- [x] Definir design system básico (cores, tipografia)

### Sprint 1 — Autenticação
- [x] Detalhar escopo técnico e visual da autenticação
- [x] Página de login visual, sem integração com Supabase
- [x] Página de cadastro visual, sem integração com Supabase
- [ ] Middleware de proteção de rotas
- [ ] Redirecionamento por perfil (trainer/student)

### Sprint 2 — Gestão de Alunos
- [ ] CRUD de alunos (trainer)
- [ ] Perfil do aluno

### Sprint 3 — Treinos
- [ ] CRUD de planos de treino
- [ ] CRUD de exercícios dentro de um plano
- [ ] Atribuição de treino ao aluno

### Sprint 4 — Execução e MVP
- [ ] Visualização do treino pelo aluno
- [ ] Registro de execução
- [ ] Dashboard resumido (trainer + student)

---

## 10. Padrão de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```txt
<tipo>(<escopo>): <descrição curta em português>
```

### Tipos
| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação, sem mudança de lógica |
| `refactor` | Refatoração sem novo comportamento |
| `test` | Adição ou correção de testes |
| `chore` | Configuração, deps, build |
| `ci` | Pipelines de CI/CD |

### Escopos sugeridos
`auth`, `trainer`, `student`, `workout`, `exercise`, `log`, `ui`, `db`, `config`, `docs`

### Exemplos
```txt
chore(config): inicializa projeto Next.js com TypeScript e Tailwind
docs(spec): cria PROJECT_SPEC.md com visão do produto e MVP
feat(auth): implementa página de login com Supabase Auth
fix(workout): corrige atribuição de treino duplicado
```

### Regras
- Máximo 72 caracteres na linha de título
- Usar imperativo presente: "adiciona", não "adicionando" ou "adicionado"
- Referenciar issue quando aplicável: `feat(auth): implementa login (#12)`
- Commits pequenos e atômicos: um propósito por commit
