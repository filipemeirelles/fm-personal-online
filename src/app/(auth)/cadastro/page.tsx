import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Crie uma senha"
                  />
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-xs font-sans font-medium uppercase tracking-wide text-brand-charcoal">
                    Perfil
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-brand-beige bg-white p-4 transition-colors hover:border-brand-rose">
                      <input
                        type="radio"
                        name="perfil"
                        value="trainer"
                        className="mt-1 accent-brand-charcoal"
                      />
                      <span>
                        <span className="block text-sm font-medium text-brand-charcoal">
                          Personal trainer
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-gray">
                          Para administrar alunas e treinos.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-brand-beige bg-white p-4 transition-colors hover:border-brand-rose">
                      <input
                        type="radio"
                        name="perfil"
                        value="student"
                        className="mt-1 accent-brand-charcoal"
                      />
                      <span>
                        <span className="block text-sm font-medium text-brand-charcoal">
                          Aluna
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-gray">
                          Para acessar treinos e registrar evolução.
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                <Button className="w-full" size="lg">
                  Criar conta
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-brand-gray">
                Já tem acesso?{" "}
                <Link
                  href="/login"
                  className="font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 transition-colors hover:text-brand-rose"
                >
                  Entrar
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
