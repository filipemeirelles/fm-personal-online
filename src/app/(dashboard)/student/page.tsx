import Link from "next/link";
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

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área da aluna"
            title="Painel da aluna"
            description="Este é um espaço temporário para validar autenticação e proteção de rotas. Os treinos reais serão criados em uma etapa futura."
            className="flex-1"
          />
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Autenticação validada</CardTitle>
              <Badge variant="rose">Aluna</Badge>
            </div>
            <CardDescription>
              Você entrou com um perfil de aluna.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-brand-gray">
              Acesse seus treinos para ver os exercícios prescritos e registrar
              a carga que está usando.
            </p>
          </CardContent>
        </Card>

        <Link href="/student/treinos" className="group block">
          <Card className="transition-colors group-hover:border-brand-rose">
            <CardHeader>
              <CardTitle>Meus treinos</CardTitle>
              <CardDescription>
                Veja o plano prescrito pelo seu personal e registre sua carga.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
