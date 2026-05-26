import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { PageHeader } from "@/components/shared/page-header";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DeactivateStudentButton } from "./deactivate-student-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function TrainerAlunaDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: trainerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!trainerProfile || trainerProfile.role !== "trainer") {
    redirect("/student");
  }

  const { data: student } = await supabase
    .from("profiles")
    .select("id, name, role, is_active, trainer_id, created_at")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .eq("role", "student")
    .single();

  if (!student) {
    notFound();
  }

  const admin = createSupabaseAdminClient();
  const { data: authUser } = await admin.auth.admin.getUserById(student.id);
  const email = authUser.user?.email ?? "Email não disponível";

  const [{ data: activePlan }, { data: recentLogs }] = await Promise.all([
    supabase
      .from("workout_plans")
      .select("id, title, created_at")
      .eq("student_id", student.id)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("workout_logs")
      .select("id, completed_at, started_at, exercise_logs(id)")
      .eq("student_id", student.id)
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(5),
  ]);

  const logs = (recentLogs ?? []).map((log) => ({
    id: log.id,
    date: log.completed_at ?? log.started_at,
    count: Array.isArray(log.exercise_logs) ? log.exercise_logs.length : 0,
  }));

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área do personal"
            title={student.name}
            description="Perfil individual da aluna vinculada à sua consultoria."
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href="/trainer/alunas"
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar para alunas
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Dados da aluna</CardTitle>
              <Badge variant={student.is_active ? "rose" : "neutral"}>
                {student.is_active ? "Ativa" : "Desativada"}
              </Badge>
            </div>
            <CardDescription>
              Informações básicas do acesso criado via convite.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                  Nome
                </dt>
                <dd className="mt-2 text-sm font-medium text-brand-charcoal">
                  {student.name}
                </dd>
              </div>
              <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                  Email
                </dt>
                <dd className="mt-2 text-sm font-medium text-brand-charcoal">
                  {email}
                </dd>
              </div>
              <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                  Entrada
                </dt>
                <dd className="mt-2 text-sm font-medium text-brand-charcoal">
                  {dateFormatter.format(new Date(student.created_at))}
                </dd>
              </div>
              <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
                <dt className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                  Status
                </dt>
                <dd className="mt-2 text-sm font-medium text-brand-charcoal">
                  {student.is_active ? "Acesso liberado" : "Acesso desativado"}
                </dd>
              </div>
            </dl>

            {student.is_active && <DeactivateStudentButton studentId={student.id} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Atividade</CardTitle>
            </div>
            <CardDescription>
              Resumo do plano vigente e das últimas execuções da aluna.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                Plano ativo
              </p>
              {activePlan ? (
                <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">
                      {activePlan.title}
                    </p>
                    <p className="text-xs text-brand-gray">
                      Desde {dateFormatter.format(new Date(activePlan.created_at))}
                    </p>
                  </div>
                  <Link
                    href={`/trainer/alunas/${student.id}/treinos/${activePlan.id}`}
                    className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                  >
                    Abrir editor
                  </Link>
                </div>
              ) : (
                <p className="mt-2 text-sm text-brand-gray">
                  Nenhum plano ativo no momento.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-brand-beige bg-white/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                Últimas execuções
              </p>
              {logs.length === 0 ? (
                <p className="mt-2 text-sm text-brand-gray">
                  Nenhuma execução registrada ainda.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {logs.map((log) => (
                    <li
                      key={log.id}
                      className="flex items-center justify-between text-sm text-brand-charcoal"
                    >
                      <span>{dateFormatter.format(new Date(log.date))}</span>
                      <span className="text-xs text-brand-gray">
                        {log.count} exercício{log.count === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href={`/trainer/alunas/${student.id}/treinos`}
              className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Ver todos os treinos
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
