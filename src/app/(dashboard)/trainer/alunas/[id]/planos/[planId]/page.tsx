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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PlanEditor, type WorkoutDay } from "./plan-editor";

interface PageProps {
  params: Promise<{ id: string; planId: string }>;
}

interface NestedExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  suggested_load: string | null;
  rest: string | null;
  notes: string | null;
  sort_order: number;
  exercises: { name: string; muscle_group: string | null } | null;
}

interface NestedDay {
  id: string;
  name: string;
  focus: string | null;
  sort_order: number;
  workout_exercises: NestedExercise[] | null;
}

export default async function PlanEditorPage({ params }: PageProps) {
  const { id, planId } = await params;
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

  if (!profile || profile.role !== "trainer") {
    redirect("/student");
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, name, description, is_active, student_id")
    .eq("id", planId)
    .eq("trainer_id", user.id)
    .single();

  if (!plan || plan.student_id !== id) {
    notFound();
  }

  const [{ data: studentProfile }, { data: library }, { data: rawDays }] =
    await Promise.all([
      supabase.from("profiles").select("name").eq("id", id).single(),
      supabase
        .from("exercises")
        .select("id, name, muscle_group")
        .eq("trainer_id", user.id)
        .eq("is_active", true)
        .order("muscle_group", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("workout_days")
        .select(
          "id, name, focus, sort_order, workout_exercises(id, exercise_id, sets, reps, suggested_load, rest, notes, sort_order, exercises(name, muscle_group))"
        )
        .eq("workout_plan_id", planId)
        .order("sort_order", { ascending: true }),
    ]);

  const days: WorkoutDay[] = ((rawDays as NestedDay[] | null) ?? []).map(
    (day) => ({
      id: day.id,
      name: day.name,
      focus: day.focus,
      exercises: (day.workout_exercises ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((ex) => ({
          id: ex.id,
          exercise_id: ex.exercise_id,
          exercise_name: ex.exercises?.name ?? "Exercício removido",
          muscle_group: ex.exercises?.muscle_group ?? null,
          sets: ex.sets,
          reps: ex.reps,
          suggested_load: ex.suggested_load,
          rest: ex.rest,
          notes: ex.notes,
        })),
    })
  );

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow={studentProfile?.name ?? "Plano de treino"}
            title={plan.name}
            description={plan.description ?? "Monte os treinos e prescreva os exercícios."}
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href={`/trainer/alunas/${id}`}
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar para a aluna
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Treinos do plano</CardTitle>
              <Badge variant={plan.is_active ? "rose" : "neutral"}>
                {plan.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardDescription>
              Organize os treinos (A, B, C) e adicione os exercícios da sua
              biblioteca com séries, repetições, carga, descanso e observações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanEditor
              planId={plan.id}
              library={library ?? []}
              days={days}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
