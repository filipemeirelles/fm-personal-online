# Roadmap - FM Personal Online

## Sprint 0 - Fundação

Status: concluída em sua base principal.

- [x] Criar repositório dedicado `fm-personal-online`.
- [x] Criar README inicial.
- [x] Criar documentação base.
- [x] Inicializar Next.js 15 com App Router, React 19, TypeScript e Tailwind CSS.
- [x] Configurar scripts `lint`, `type-check` e `build`.
- [x] Configurar estrutura inicial de pastas.

## Sprint 1 - Design System

Status: implementada inicialmente.

- [x] Definir identidade visual da marca.
- [x] Configurar tokens Tailwind.
- [x] Configurar fontes Playfair Display e Montserrat.
- [x] Criar componentes base de UI.
- [x] Criar página `/style-guide`.
- [x] Criar documentação do design system.

## Sprint 2 - Autenticação

Status: em andamento.

- [x] Criar spec de autenticação.
- [x] Migrar spec de autenticação para `.specs/features/auth/`.
- [x] Criar páginas visuais `/login` e `/cadastro`.
- [x] Instalar e configurar client inicial do Supabase.
- [x] Criar migration inicial de `profiles` com RLS.
- [x] Aplicar migration em um projeto Supabase remoto.
- [x] Conectar cadastro ao Supabase Auth.
- [x] Conectar login ao Supabase Auth.
- [x] Criar logout.
- [x] Criar placeholders mínimos de trainer/student.
- [x] Criar proteção de rotas.
- [x] Redirecionar por perfil `trainer` ou `student`.

## Sprint 3 - Gestão de Alunas

Status: concluída em 24/05/2026 após smoke test manual end-to-end.

- [x] Cadastro manual de alunas via convite.
- [x] Listagem de alunas ativas.
- [x] Perfil individual da aluna.
- [x] Soft delete/desativação sem perda de histórico.

## Sprint 4 - Prescrição de Treinos

Status: implementada em 26/05/2026. Aguardando aplicação de migration no Supabase remoto e smoke test manual.

- [x] Criar plano de treino.
- [x] Adicionar exercícios ao plano.
- [x] Registrar séries, repetições, carga, descanso e observações.
- [x] Adicionar link de vídeo ou GIF.
- [x] Atribuir treino a uma aluna.

## Sprint 5 - Execução de Treinos

Status: implementada em 26/05/2026. Aguardando aplicação de migration no Supabase remoto e smoke test manual.

- [x] Aluna visualizar treino vigente.
- [x] Aluna registrar carga realizada e observações.
- [x] Marcar treino como concluído.
- [x] Salvar histórico de execução.

## Sprint 6 - MVP Utilizável

Status: implementada em 26/05/2026. Aguardando smoke test manual e primeiro deploy.

- [x] Dashboard simples para trainer.
- [x] Dashboard simples para student.
- [x] Fluxo completo: personal cria treino, aluna acessa e registra execução.
- [x] Revisão de RLS via specs `.specs/features/workout-prescription/design.md` e `.specs/features/workout-execution/design.md`.
- [x] Preparação para deploy na Vercel (instruções no `README.md`).

## Backlog Futuro

- Gráfico de evolução de carga por exercício.
- Upload de fotos de progresso.
- Feedback do personal.
- Notificações in-app.
- Anamnese digital.
- Avaliação física.
- Biblioteca global de exercícios com vídeo/GIF.
- Calendário de treinos.
- Multi-trainer.
- Planos de assinatura.
- PWA.
- Relatórios em PDF.
- Integração com wearables.
