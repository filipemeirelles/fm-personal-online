import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function TrainerAlunaTreinosPage({ params }: PageProps) {
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

  const { data: plans } = await supabase
    .from("workout_plans")
    .select("id, title, description, is_active, created_at")
    .eq("student_id", student.id)
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false });

  const plansList = plans ?? [];
  const activePlan = plansList.find((plan) => plan.is_active);
  const otherPlans = plansList.filter((plan) => !plan.is_active);

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow={`Aluna · ${student.name}`}
            title="Planos de treino"
            description="Crie, edite e ative os planos de treino desta aluna."
            className="flex-1"
          />
          <div className="flex items-center gap-3">
            <Link
              href={`/trainer/alunas/${student.id}`}
              className="text-sm font-sans text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
            >
              Voltar ao perfil
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="flex justify-end">
          <Link href={`/trainer/alunas/${student.id}/treinos/novo`}>
            <Button>Novo plano</Button>
          </Link>
        </div>

        {plansList.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum plano ainda</CardTitle>
              <CardDescription>
                Crie o primeiro plano de treino desta aluna para começar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/trainer/alunas/${student.id}/treinos/novo`}>
                <Button>Criar primeiro plano</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {activePlan && (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle>Plano ativo</CardTitle>
                    <Badge variant="rose">Ativo</Badge>
                  </div>
                  <CardDescription>
                    Este é o plano atualmente em vigor para a aluna.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-base font-medium text-brand-charcoal">
                        {activePlan.title}
                      </p>
                      {activePlan.description && (
                        <p className="text-sm text-brand-gray">
                          {activePlan.description}
                        </p>
                      )}
                      <p className="text-xs text-brand-gray">
                        Criado em {dateFormatter.format(new Date(activePlan.created_at))}
                      </p>
                    </div>
                    <Link
                      href={`/trainer/alunas/${student.id}/treinos/${activePlan.id}`}
                      className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                    >
                      Abrir editor
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {otherPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle>Outros planos</CardTitle>
                    <Badge variant="neutral">{otherPlans.length}</Badge>
                  </div>
                  <CardDescription>
                    Histórico de planos. Você pode reativar a qualquer momento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-brand-beige">
                    {otherPlans.map((plan) => (
                      <li
                        key={plan.id}
                        className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-brand-charcoal">
                            {plan.title}
                          </p>
                          {plan.description && (
                            <p className="text-xs text-brand-gray">
                              {plan.description}
                            </p>
                          )}
                          <p className="text-xs text-brand-gray">
                            Criado em {dateFormatter.format(new Date(plan.created_at))}
                          </p>
                        </div>
                        <Link
                          href={`/trainer/alunas/${student.id}/treinos/${plan.id}`}
                          className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                        >
                          Abrir
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
