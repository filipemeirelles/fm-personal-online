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
import { StatCard } from "@/components/shared/stat-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TrainerPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "trainer") {
    redirect("/student");
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    activeStudentsRes,
    pendingInvitesRes,
    activePlansRes,
    studentsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("trainer_id", user.id)
      .eq("role", "student")
      .eq("is_active", true),
    supabase
      .from("student_invites")
      .select("id", { count: "exact", head: true })
      .eq("trainer_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("workout_plans")
      .select("id", { count: "exact", head: true })
      .eq("trainer_id", user.id)
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("id")
      .eq("trainer_id", user.id)
      .eq("role", "student"),
  ]);

  const studentIds = (studentsRes.data ?? []).map((row) => row.id);

  let recentLogsCount = 0;
  if (studentIds.length > 0) {
    const { count } = await supabase
      .from("workout_logs")
      .select("id", { count: "exact", head: true })
      .in("student_id", studentIds)
      .gte("completed_at", sevenDaysAgo.toISOString());
    recentLogsCount = count ?? 0;
  }

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área do personal"
            title={`Olá, ${profile.name}`}
            description="Visão rápida da sua consultoria."
            className="flex-1"
          />
          <LogoutButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Alunas ativas"
            value={activeStudentsRes.count ?? 0}
            href="/trainer/alunas"
            description="Com acesso liberado"
          />
          <StatCard
            label="Convites pendentes"
            value={pendingInvitesRes.count ?? 0}
            href="/trainer/alunas"
            description="Aguardando aceite"
          />
          <StatCard
            label="Planos ativos"
            value={activePlansRes.count ?? 0}
            description="Em execução pelas alunas"
          />
          <StatCard
            label="Execuções (7 dias)"
            value={recentLogsCount}
            description="Treinos registrados na semana"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
            <CardDescription>
              Atalhos para os fluxos mais comuns da consultoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/trainer/alunas"
                  className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                >
                  Gerenciar alunas e convites →
                </Link>
              </li>
              <li>
                <p className="text-sm text-brand-gray">
                  Para criar um plano de treino, abra o perfil de uma aluna e clique em &quot;Ver treinos&quot;.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
