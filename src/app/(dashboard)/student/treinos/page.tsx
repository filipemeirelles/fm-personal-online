import Link from "next/link";
import { redirect } from "next/navigation";
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
import { LoadInput } from "./load-input";

interface NestedExercise {
  id: string;
  reps: string;
  sets: number;
  suggested_load: string | null;
  rest: string | null;
  notes: string | null;
  sort_order: number;
  exercises: {
    name: string;
    muscle_group: string | null;
    video_url: string | null;
  } | null;
}

interface NestedDay {
  id: string;
  name: string;
  focus: string | null;
  sort_order: number;
  workout_exercises: NestedExercise[] | null;
}

export default async function StudentTreinosPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student") {
    redirect("/trainer");
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, name, description")
    .eq("student_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const { data: rawDays } = plan
    ? await supabase
        .from("workout_days")
        .select(
          "id, name, focus, sort_order, workout_exercises(id, sets, reps, suggested_load, rest, notes, sort_order, exercises(name, muscle_group, video_url))"
        )
        .eq("workout_plan_id", plan.id)
        .order("sort_order", { ascending: true })
    : { data: null };

  const days = ((rawDays as NestedDay[] | null) ?? []).map((day) => ({
    ...day,
    workout_exercises: (day.workout_exercises ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área da aluna"
            title="Meus treinos"
            description="Seu treino prescrito pelo personal. Você pode registrar a carga que está usando em cada exercício."
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

        {!plan ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum treino ativo</CardTitle>
              <CardDescription>
                Seu personal ainda não publicou um plano ativo. Assim que ele
                montar seu treino, ele aparecerá aqui.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
              </CardHeader>
            </Card>

            {days.length === 0 ? (
              <Card>
                <CardContent>
                  <p className="text-sm text-brand-gray">
                    Seu plano ainda não tem treinos cadastrados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              days.map((day) => (
                <Card key={day.id}>
                  <CardHeader>
                    <CardTitle>{day.name}</CardTitle>
                    {day.focus && (
                      <CardDescription>{day.focus}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {day.workout_exercises.length === 0 ? (
                      <p className="text-sm text-brand-gray">
                        Nenhum exercício neste treino.
                      </p>
                    ) : (
                      <ul className="space-y-5">
                        {day.workout_exercises.map((ex) => (
                          <li
                            key={ex.id}
                            className="rounded-xl border border-brand-beige bg-white/60 p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-brand-charcoal">
                                  {ex.exercises?.name ?? "Exercício"}
                                </p>
                                <p className="text-xs text-brand-gray">
                                  {ex.sets} séries · {ex.reps} reps
                                  {ex.rest ? ` · descanso ${ex.rest}` : ""}
                                </p>
                                {ex.exercises?.video_url && (
                                  <a
                                    href={ex.exercises.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                                  >
                                    Ver vídeo
                                  </a>
                                )}
                                {ex.notes && (
                                  <p className="text-xs text-brand-gray">
                                    Obs.: {ex.notes}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                                  Carga
                                </p>
                                <LoadInput
                                  workoutExerciseId={ex.id}
                                  initialLoad={ex.suggested_load}
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </main>
  );
}
