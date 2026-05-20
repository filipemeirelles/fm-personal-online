import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CadastroForm } from "./cadastro-form";

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-10 md:grid-cols-[0.9fr_1fr] md:items-center">
          <section className="space-y-5">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-brand-rose">
              FM Personal Online
            </p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-brand-charcoal md:text-5xl">
                Uma base simples para evoluir com consistência.
              </h1>
              <p className="max-w-md font-sans text-sm leading-7 text-brand-gray">
                Crie seu acesso para organizar treinos, registros e acompanhamento
                em uma experiência profissional e acolhedora.
              </p>
            </div>
          </section>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Crie seu acesso</CardTitle>
              <CardDescription>
                Organize sua experiência de treino online em um ambiente simples e profissional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CadastroForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
