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
              Próximas etapas planejadas: gestão de alunas, prescrição de treinos
              e acompanhamento de evolução. Nenhuma funcionalidade de dashboard
              real foi implementada nesta etapa.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
