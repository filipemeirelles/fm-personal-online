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
import { NewPlanForm } from "./new-plan-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewPlanPage({ params }: PageProps) {
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
    .select("id, name")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .eq("role", "student")
    .single();

  if (!student) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow={`Aluna · ${student.name}`}
            title="Novo plano de treino"
            description="Comece com um título. Você adiciona os exercícios na próxima tela."
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href={`/trainer/alunas/${student.id}/treinos`}
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Cancelar
            </Link>
            <LogoutButton />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do plano</CardTitle>
            <CardDescription>
              O plano nasce inativo. Você ativa quando estiver pronto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewPlanForm studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
