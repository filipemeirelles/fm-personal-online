"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Role = "trainer" | "student";

function getCadastroErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("already registered")) {
    return "Este email já está cadastrado. Tente entrar na sua conta.";
  }

  if (normalizedMessage.includes("password")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }

  if (normalizedMessage.includes("email")) {
    return "Informe um email válido para criar sua conta.";
  }

  return "Não foi possível criar sua conta agora. Tente novamente em instantes.";
}

export function CadastroForm() {
  const [role, setRole] = useState<Role>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const name = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("senha") ?? "");

    if (!name || !email || !password) {
      setErrorMessage("Preencha todos os campos para criar sua conta.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        setErrorMessage(getCadastroErrorMessage(error.message));
        return;
      }

      await supabase.auth.signOut();

      form.reset();
      setRole("student");
      setSuccessMessage(
        "Conta criada com sucesso. Agora você já pode entrar com seu email e senha."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta agora. Tente novamente em instantes."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            required
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
            required
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
            minLength={6}
            required
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
                checked={role === "trainer"}
                onChange={() => setRole("trainer")}
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
                checked={role === "student"}
                onChange={() => setRole("student")}
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

        {errorMessage && (
          <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="rounded-lg border border-brand-beige bg-brand-offwhite px-4 py-3 text-sm text-brand-charcoal">
            {successMessage}
          </p>
        )}

        <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
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
    </>
  );
}
