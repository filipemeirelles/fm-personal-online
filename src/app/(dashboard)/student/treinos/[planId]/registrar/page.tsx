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
import { ExecutionForm } from "./execution-form";

interface PageProps {
  params: Promise<{ planId: string }>;
}

export default async function RegistrarTreinoPage({ params }: PageProps) {
  const { planId } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student" || !profile.is_active) {
    redirect("/login");
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, title, description")
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

  const exerciseList = exercises ?? [];

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área da aluna"
            title={`Registrar: ${plan.title}`}
            description="Preencha o que você realmente fez em cada exercício. Você pode editar depois."
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Cancelar
            </Link>
            <LogoutButton />
          </div>
        </div>

        {exerciseList.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Plano sem exercícios</CardTitle>
              <CardDescription>
                Este plano ainda não tem exercícios cadastrados. Avise o personal.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Execução do treino</CardTitle>
              <CardDescription>
                Os valores prescritos aparecem como referência. Os campos abaixo
                são o que você executou hoje.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExecutionForm planId={plan.id} exercises={exerciseList} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
