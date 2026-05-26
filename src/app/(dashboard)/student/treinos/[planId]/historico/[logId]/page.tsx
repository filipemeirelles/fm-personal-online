import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { PageHeader } from "@/components/shared/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExecutionForm } from "../../registrar/execution-form";

interface PageProps {
  params: Promise<{ planId: string; logId: string }>;
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function HistoricoTreinoPage({ params }: PageProps) {
  const { planId, logId } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student" || !profile.is_active) {
    redirect("/login");
  }

  const { data: log } = await supabase
    .from("workout_logs")
    .select("id, plan_id, started_at, completed_at, notes")
    .eq("id", logId)
    .eq("student_id", user.id)
    .eq("plan_id", planId)
    .single();

  if (!log) {
    notFound();
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, title")
    .eq("id", planId)
    .eq("student_id", user.id)
    .single();

  if (!plan) {
    notFound();
  }

  const { data: exercises } = await supabase
    .from("plan_exercises")
    .select("id, name, sets, reps, load, rest, notes")
    .eq("plan_id", plan.id)
    .order("order_index", { ascending: true });

  const { data: existingLogs } = await supabase
    .from("exercise_logs")
    .select("plan_exercise_id, sets_done, reps_done, load_done, notes")
    .eq("workout_log_id", log.id);

  const exerciseList = exercises ?? [];
  const initialEntries = (existingLogs ?? []).map((item) => ({
    plan_exercise_id: item.plan_exercise_id,
    sets_done: item.sets_done !== null ? String(item.sets_done) : "",
    reps_done: item.reps_done ?? "",
    load_done: item.load_done ?? "",
    notes: item.notes ?? "",
  }));

  const dateLabel = dateTimeFormatter.format(
    new Date(log.completed_at ?? log.started_at)
  );

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área da aluna"
            title={`Registro de ${dateLabel}`}
            description={`Treino: ${plan.title}.`}
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar
            </Link>
            <LogoutButton />
          </div>
        </div>

        {exerciseList.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Plano sem exercícios</CardTitle>
              <CardDescription>
                Este plano não tem mais exercícios cadastrados.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Editar registro</CardTitle>
              <CardDescription>
                Atualize os campos como quiser e salve. Os exercícios anteriores
                serão substituídos pelo conteúdo preenchido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExecutionForm
                planId={plan.id}
                exercises={exerciseList}
                logId={log.id}
                initialNotes={log.notes ?? ""}
                initialEntries={initialEntries}
                redirectAfter="/student"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
