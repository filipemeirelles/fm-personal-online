import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AcceptInviteForm } from "./accept-form";

interface PageProps {
  params: Promise<{ token: string }>;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function InviteShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <p className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-brand-rose">
              Filipe Meirelles Personal Trainer
            </p>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  );
}

export default async function ConvitePage({ params }: PageProps) {
  const { token } = await params;
  const admin = createSupabaseAdminClient();

  const { data: invites, error } = await admin.rpc("get_invite_by_token", {
    invite_token: token,
  });

  if (error || !invites || invites.length === 0) {
    return (
      <InviteShell
        title="Convite não encontrado"
        description="O link parece inválido. Confirme com seu personal se foi copiado corretamente."
      >
        <Link
          href="/login"
          className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
        >
          Ir para o login
        </Link>
      </InviteShell>
    );
  }

  const invite = invites[0];

  if (invite.status === "expired") {
    return (
      <InviteShell
        title="Convite expirado"
        description={`Este convite expirou em ${dateFormatter.format(new Date(invite.expires_at))}. Peça um novo ao seu personal.`}
      >
        <Link
          href="/login"
          className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
        >
          Ir para o login
        </Link>
      </InviteShell>
    );
  }

  if (invite.status === "cancelled") {
    return (
      <InviteShell
        title="Convite cancelado"
        description="Este convite foi cancelado pelo seu personal. Entre em contato para receber um novo."
      >
        <Link
          href="/login"
          className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
        >
          Ir para o login
        </Link>
      </InviteShell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <InviteShell
        title="Convite já utilizado"
        description="Você já criou sua conta com este convite. Acesse pelo login."
      >
        <Link
          href="/login"
          className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
        >
          Ir para o login
        </Link>
      </InviteShell>
    );
  }

  return (
    <InviteShell
      title={`Bem-vinda, ${invite.name.split(" ")[0]}`}
      description={`${invite.trainer_name} te convidou para a consultoria online. Defina uma senha para entrar.`}
    >
      <AcceptInviteForm token={token} name={invite.name} email={invite.email} />
    </InviteShell>
  );
}
