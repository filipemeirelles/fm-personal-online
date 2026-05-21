import Link from "next/link";
import { redirect } from "next/navigation";
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
import { InviteForm } from "./invite-form";
import { PendingInviteActions } from "./pending-invite-actions";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000"
  );
}

export default async function TrainerAlunasPage() {
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

  const [{ data: pendingInvites }, { data: activeStudents }] = await Promise.all([
    supabase
      .from("student_invites")
      .select("id, name, email, token, expires_at, created_at")
      .eq("trainer_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, name, created_at")
      .eq("trainer_id", user.id)
      .eq("role", "student")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  const invites = pendingInvites ?? [];
  const students = activeStudents ?? [];
  const appUrl = getAppUrl();

  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área do personal"
            title="Alunas"
            description="Convide novas alunas por link e acompanhe quem já está ativa."
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
            <CardTitle>Convidar aluna</CardTitle>
            <CardDescription>
              O link gerado deve ser repassado manualmente (WhatsApp, email,
              etc). O convite expira em 7 dias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Convites pendentes</CardTitle>
              <Badge variant="rose">{invites.length}</Badge>
            </div>
            <CardDescription>
              Convites ainda não aceitos. Você pode copiar o link, reenviar
              (estende a validade) ou cancelar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invites.length === 0 ? (
              <p className="text-sm text-brand-gray">
                Nenhum convite pendente no momento.
              </p>
            ) : (
              <ul className="divide-y divide-brand-beige">
                {invites.map((invite) => {
                  const link = `${appUrl}/convite/${invite.token}`;
                  return (
                    <li
                      key={invite.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-brand-charcoal">
                          {invite.name}
                        </p>
                        <p className="text-xs text-brand-gray">
                          {invite.email}
                        </p>
                        <p className="text-xs text-brand-gray">
                          Expira em {dateFormatter.format(new Date(invite.expires_at))}
                        </p>
                      </div>
                      <PendingInviteActions inviteId={invite.id} link={link} />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Alunas ativas</CardTitle>
              <Badge variant="rose">{students.length}</Badge>
            </div>
            <CardDescription>
              Alunas que aceitaram o convite e estão com acesso liberado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-brand-gray">
                Nenhuma aluna ativa ainda. Convide a primeira acima.
              </p>
            ) : (
              <ul className="divide-y divide-brand-beige">
                {students.map((student) => (
                  <li
                    key={student.id}
                    className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-brand-charcoal">
                        {student.name}
                      </p>
                      <p className="text-xs text-brand-gray">
                        Entrou em {dateFormatter.format(new Date(student.created_at))}
                      </p>
                    </div>
                    <Link
                      href={`/trainer/alunas/${student.id}`}
                      className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                    >
                      Ver perfil
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
