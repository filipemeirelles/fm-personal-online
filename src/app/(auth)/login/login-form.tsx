"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getLoginErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email ou senha inválidos. Confira os dados e tente novamente.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirme seu email antes de entrar. Verifique sua caixa de entrada.";
  }

  if (normalizedMessage.includes("invalid email")) {
    return "Informe um email válido para entrar.";
  }

  return `Não foi possível entrar agora (${message}).`;
}

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("senha") ?? "");

    if (!email || !password) {
      setErrorMessage("Preencha email e senha para entrar.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(getLoginErrorMessage(error.message));
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setErrorMessage(
          "Sua conta foi encontrada, mas o perfil ainda não está configurado. Tente novamente em instantes."
        );
        return;
      }

      router.push(profile.role === "trainer" ? "/trainer" : "/student");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar agora. Tente novamente em instantes."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
          />
        </div>

        {errorMessage && (
          <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
            {errorMessage}
          </p>
        )}

        <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray">
        Ainda não tem acesso?{" "}
        <Link
          href="/cadastro"
          className="font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 transition-colors hover:text-brand-rose"
        >
          Criar conta
        </Link>
      </p>
    </>
  );
}
