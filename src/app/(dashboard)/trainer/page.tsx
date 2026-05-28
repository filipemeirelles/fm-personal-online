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

export default function TrainerPage() {
  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            eyebrow="Área do personal"
            title="Painel do personal"
            description="Este é um espaço temporário para validar autenticação e proteção de rotas. O dashboard real será criado em uma etapa futura."
            className="flex-1"
          />
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Autenticação validada</CardTitle>
              <Badge variant="rose">Trainer</Badge>
            </div>
            <CardDescription>
              Você entrou com um perfil de personal trainer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-brand-gray">
              Acesse a gestão de alunas e a biblioteca de exercícios para montar
              os planos de treino.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/trainer/alunas" className="group">
            <Card className="h-full transition-colors group-hover:border-brand-rose">
              <CardHeader>
                <CardTitle>Alunas</CardTitle>
                <CardDescription>
                  Convide, acompanhe e monte planos de treino para suas alunas.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/trainer/exercicios" className="group">
            <Card className="h-full transition-colors group-hover:border-brand-rose">
              <CardHeader>
                <CardTitle>Biblioteca de exercícios</CardTitle>
                <CardDescription>
                  Cadastre e organize os exercícios usados nas prescrições.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
