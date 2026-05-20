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
- [ ] Conectar cadastro ao Supabase Auth.
- [ ] Conectar login ao Supabase Auth.
- [ ] Criar logout.
- [ ] Criar proteção de rotas.
- [ ] Redirecionar por perfil `trainer` ou `student`.

## Sprint 3 - Gestão de Alunas

Status: planejada.

- [ ] Cadastro manual de alunas.
- [ ] Listagem de alunas ativas.
- [ ] Perfil individual da aluna.
- [ ] Soft delete/desativação sem perda de histórico.

## Sprint 4 - Prescrição de Treinos

Status: planejada.

- [ ] Criar plano de treino.
- [ ] Adicionar exercícios ao plano.
- [ ] Registrar séries, repetições, carga, descanso e observações.
- [ ] Adicionar link de vídeo ou GIF.
- [ ] Atribuir treino a uma aluna.

## Sprint 5 - Execução de Treinos

Status: planejada.

- [ ] Aluna visualizar treino vigente.
- [ ] Aluna registrar carga realizada e observações.
- [ ] Marcar treino como concluído.
- [ ] Salvar histórico de execução.

## Sprint 6 - MVP Utilizável

Status: planejada.

- [ ] Dashboard simples para trainer.
- [ ] Dashboard simples para student.
- [ ] Fluxo completo: personal cria treino, aluna acessa e registra execução.
- [ ] Revisão de RLS e segurança.
- [ ] Preparação para deploy na Vercel.

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
