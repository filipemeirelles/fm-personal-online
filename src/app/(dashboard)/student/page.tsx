import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function StudentPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student" || !profile.is_active) {
    redirect("/login");
  }

  const { data: activePlan } = await supabase
    .from("workout_plans")
    .select("id, title, description, created_at")
    .eq("student_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const { data: exercises } = activePlan
    ? await supabase
        .from("plan_exercises")
        .select("id, name, sets, reps, load, rest")
        .eq("plan_id", activePlan.id)
        .order("order_index", { ascending: true })
    : { data: [] };

  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("id, plan_id, completed_at, started_at")
    .eq("student_id", user.id)
    .order("completed_at", { ascending: false, nullsFirst: false })
    .limit(5);

  const exerciseList = exercises ?? [];
  const logs = recentLogs ?? [];

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área da aluna"
            title={`Olá, ${profile.name}`}
            description="Seu plano ativo e os últimos treinos registrados."
            className="flex-1"
          />
          <LogoutButton />
        </div>

        {activePlan ? (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle>{activePlan.title}</CardTitle>
                <Badge variant="rose">Plano ativo</Badge>
              </div>
              {activePlan.description && (
                <CardDescription>{activePlan.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {exerciseList.length === 0 ? (
                <p className="text-sm text-brand-gray">
                  Este plano ainda não tem exercícios. Avise o personal.
                </p>
              ) : (
                <ol className="space-y-3">
                  {exerciseList.map((exercise, index) => {
                    const planLine = [
                      exercise.sets ? `${exercise.sets} séries` : null,
                      exercise.reps ? `${exercise.reps} reps` : null,
                      exercise.load ? `carga ${exercise.load}` : null,
                      exercise.rest ? `descanso ${exercise.rest}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <li
                        key={exercise.id}
                        className="rounded-lg border border-brand-beige bg-white/60 p-3"
                      >
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                          Exercício {index + 1}
                        </p>
                        <p className="mt-1 text-sm font-medium text-brand-charcoal">
                          {exercise.name}
                        </p>
                        {planLine && (
                          <p className="mt-1 text-xs text-brand-gray">
                            {planLine}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}

              {exerciseList.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/student/treinos/${activePlan.id}/registrar`}
                  >
                    <Button>Registrar treino</Button>
                  </Link>
                  <p className="text-xs text-brand-gray">
                    Plano vigente desde {dateFormatter.format(new Date(activePlan.created_at))}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sem plano ativo</CardTitle>
              <CardDescription>
                Você ainda não tem um plano de treino ativo. Assim que o personal
                ativar um plano, ele aparece aqui.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Últimos treinos registrados</CardTitle>
              <Badge variant="neutral">{logs.length}</Badge>
            </div>
            <CardDescription>
              Toque em um registro para revisar ou editar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-brand-gray">
                Nenhum treino registrado ainda. Comece pelo botão acima.
              </p>
            ) : (
              <ul className="divide-y divide-brand-beige">
                {logs.map((log) => (
                  <li
                    key={log.id}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-brand-charcoal">
                      {dateTimeFormatter.format(
                        new Date(log.completed_at ?? log.started_at)
                      )}
                    </span>
                    <Link
                      href={`/student/treinos/${log.plan_id}/historico/${log.id}`}
                      className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                    >
                      Ver detalhe
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
