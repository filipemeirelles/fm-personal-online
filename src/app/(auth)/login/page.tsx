import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-brand-offwhite px-6 py-10 md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full gap-10 md:grid-cols-[0.9fr_1fr] md:items-center">
          <section className="space-y-5">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.25em] text-brand-rose">
              Filipe Meirelles Personal Trainer
            </p>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-brand-charcoal md:text-5xl">
                Treino online com acompanhamento claro e elegante.
              </h1>
              <p className="max-w-md font-sans text-sm leading-7 text-brand-gray">
                Acesse sua área para acompanhar treinos, evolução e registros em
                um ambiente organizado para a consultoria online.
              </p>
            </div>
          </section>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Acesse sua consultoria</CardTitle>
              <CardDescription>
                Entre para acompanhar treinos, evolução e registros da sua jornada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
