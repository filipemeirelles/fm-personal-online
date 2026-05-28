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
import { ExercisesManager } from "./exercises-manager";

export default async function TrainerExerciciosPage() {
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

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, muscle_group, video_url, description, is_active")
    .eq("trainer_id", user.id)
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área do personal"
            title="Biblioteca de exercícios"
            description="Cadastre os exercícios que você usa para prescrever treinos. Eles ficam disponíveis para todos os planos."
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href="/trainer"
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exercícios</CardTitle>
            <CardDescription>
              Adicione, edite ou desative exercícios. Exercícios já usados em
              treinos não podem ser excluídos, apenas desativados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExercisesManager exercises={exercises ?? []} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
