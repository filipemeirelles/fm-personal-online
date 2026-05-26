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
import { ExerciseForm } from "./exercise-form";
import { ExerciseRow } from "./exercise-row";
import { PlanActions } from "./plan-actions";
import { PlanMetadataForm } from "./plan-metadata-form";

interface PageProps {
  params: Promise<{ id: string; planId: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function EditPlanPage({ params }: PageProps) {
  const { id, planId } = await params;
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
    .select("id, name")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .eq("role", "student")
    .single();

  if (!student) {
    notFound();
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, title, description, is_active, created_at")
    .eq("id", planId)
    .eq("trainer_id", user.id)
    .eq("student_id", student.id)
    .single();

  if (!plan) {
    notFound();
  }

  const { data: exercises } = await supabase
    .from("plan_exercises")
    .select("id, name, sets, reps, load, rest, notes, video_url, order_index")
    .eq("plan_id", plan.id)
    .order("order_index", { ascending: true });

  const exerciseList = exercises ?? [];

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow={`Aluna · ${student.name}`}
            title={plan.title}
            description={`Plano criado em ${dateFormatter.format(new Date(plan.created_at))}.`}
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href={`/trainer/alunas/${student.id}/treinos`}
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Status do plano</CardTitle>
              <Badge variant={plan.is_active ? "rose" : "neutral"}>
                {plan.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardDescription>
              Ativar este plano desativa qualquer outro plano da mesma aluna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanActions
              planId={plan.id}
              studentId={student.id}
              isActive={plan.is_active}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do plano</CardTitle>
            <CardDescription>
              Atualize título e descrição quando precisar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanMetadataForm
              planId={plan.id}
              initialTitle={plan.title}
              initialDescription={plan.description ?? ""}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Exercícios</CardTitle>
              <Badge variant="neutral">{exerciseList.length}</Badge>
            </div>
            <CardDescription>
              A ordem aqui é a ordem que a aluna verá durante o treino.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {exerciseList.length === 0 ? (
              <p className="text-sm text-brand-gray">
                Nenhum exercício cadastrado ainda. Adicione o primeiro abaixo.
              </p>
            ) : (
              <ul className="space-y-3">
                {exerciseList.map((exercise, index) => (
                  <li key={exercise.id}>
                    <ExerciseRow
                      exercise={exercise}
                      isFirst={index === 0}
                      isLast={index === exerciseList.length - 1}
                    />
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-brand-beige pt-6">
              <h4 className="font-display text-base font-medium text-brand-charcoal">
                Adicionar exercício
              </h4>
              <p className="mt-1 mb-4 text-xs text-brand-gray">
                Apenas o nome é obrigatório. Os demais campos aceitam texto livre
                (ex: &quot;8-12&quot; ou &quot;60kg&quot;).
              </p>
              <ExerciseForm planId={plan.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
